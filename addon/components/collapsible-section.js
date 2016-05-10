import Ember from 'ember';
import { not } from 'ember-computed';
import layout from '../templates/components/collapsible-section';

export default Ember.Component.extend({
  layout,
  tagName: 'section',
  dark: not('isOpen'),
  classNameBindings: ['dark'],
  isOpen: Ember.computed('opened', 'title', function() {
    let opened = this.get('opened');
    return opened === true || opened === this.get('title');
  }),

  mouseEnter(event) {
    this.sendAction('hovered', event);
  },
  mouseLeave(event) {
    this.sendAction('unhovered', event);
  },

  actions: {
    toggle() {
      if (this.get('isOpen')) {
        this.get('close')();
      } else {
        this.get('open')();
      }
    }
  }
});
