import Ember from 'ember';
import layout from '../templates/components/editor-overlay';
import raf from '../lib/raf';
import { currentTransform } from '../lib/matrix';
import { or } from 'ember-computed';
import { task } from 'ember-concurrency';
import { boundsEqual } from '../lib/range-bounds';
import { bool } from 'ember-computed';

export default Ember.Component.extend({
  layout,
  classNames: ['editor-overlay'],
  classNameBindings: ['reveal', 'hoverable', 'isOpen', 'hasEditor'],
  hovered: false,
  hasEditor: bool('editor'),

  didReceiveAttrs() {
    this.set('highlight', this.get('field.highlight'));
    let t = this.get('field').closestTransform();
    if (t) {
      this.set('fieldScale', t.a);
    } else {
      this.set('fieldScale', 1);
    }
    this.set('copiedClasses', this.get('field').classContexts().join(' '));
  },

  _targetRect() {
    let field = this.get('field');
    return field.boundingBox();
  },

  _waitForTargetRect: function * () {
    let hiding = false;
    let $elt = this.$();
    while (true) {
      let targetRect = this._targetRect();
      if (targetRect) {
        return targetRect;
      }
      if (!hiding) {
        $elt.css({ display: 'none' });
        hiding = true;
      }
      yield raf();
    }
  },

  _translation(targetRect, ownRect, currentTransform) {
    return `translateX(${targetRect.left - ownRect.left + currentTransform.tx}px) translateY(${targetRect.top - ownRect.top + currentTransform.ty}px)`;
  },

  _matchWidth($elt, targetRect, ownRect) {
    return `${$elt.outerWidth() + targetRect.right - targetRect.left - ownRect.right + ownRect.left}px`;
  },

  _matchHeight($elt, targetRect, ownRect) {
    return `${$elt.outerHeight() + targetRect.bottom - targetRect.top - ownRect.bottom + ownRect.top}px`;
  },

  _track: task(function * () {
    let $elt = this.$();
    let $ownTarget = this.$('.target');

    while (true) {

      // I'm deliberately introducing a scope per animation frame so
      // that local variables like targetRect can be scoped to a
      // single frame.
      {
        // stay hidden until we have a target
        let targetRect = yield* this._waitForTargetRect();

        // position ourselves over the target
        let ownRect = $ownTarget[0].getBoundingClientRect();
        let t = currentTransform($elt);
        $elt.css({
          display: 'initial',
          width: this._matchWidth($elt, targetRect, ownRect),
          height: this._matchHeight($elt, targetRect, ownRect),
          transform: `${this._translation(targetRect, ownRect, t)} scale(${this.get('fieldScale')})`
        });
        $elt.find('> label').css({
          transform: `scale(${1 / this.get('fieldScale')})`
        });

        yield raf();
      }

      let targetRect = this._targetRect();
      let ownRect = $ownTarget[0].getBoundingClientRect();

      if (targetRect && this.get('isOpen') && this.get('hasEditor')) {
        // when editing, scale up to at least 80%.
        let scale = Math.max(0.8, this.get('fieldScale'));
        let t = currentTransform($elt);

        // adjust scale and positioning one last time
        $elt.css({
          width: this._matchWidth($elt, targetRect, ownRect),
          height: this._matchHeight($elt, targetRect, ownRect),
          minHeight: this._matchHeight($elt, targetRect, ownRect),
          transform: `${this._translation(targetRect, ownRect, t)} scale(${scale})`
        });
        $elt.find('> label').css({
          transform: `scale(${1 / scale })`
        });

        yield raf();

        // switch to free floating height
        $elt.css({
          height: 'auto'
        });

        // And then sit around not messing with positioning while the user is working
        while (this._targetRect() && this.get('isOpen') && this.get('hasEditor')) {
          yield raf();
        }
      }

      // as long as we have a target and are not doing editing, track closely
      while ((targetRect = this._targetRect()) && !(this.get('isOpen') && this.get('hasEditor'))) {
        let ownRect = $ownTarget[0].getBoundingClientRect();
        if (!boundsEqual(targetRect, ownRect)) {
          let t = currentTransform($elt);
          $elt.css({
            width: this._matchWidth($elt, targetRect, ownRect),
            height: this._matchHeight($elt, targetRect, ownRect),
            transform: `${this._translation(targetRect, ownRect, t)} scale(${this.get('fieldScale')})`
          });
          $elt.find('> label').css({
            transform: `scale(${1 / this.get('fieldScale') })`
          });
        }
        yield raf();
      }
    }
  }).on('didInsertElement'),

  reveal: or('hovered', 'highlight', 'isOpen'),

  actions: {
    beginHover() {
      this.set('hovered', true);
    },
    endHover() {
      this.set('hovered', false);
    }
  }
});
