import layout from '../templates/components/cms-field';
import Component from 'ember-component';
import inject from 'ember-service/inject';
import FieldInfo from '../lib/field-info';
import { guidFor } from 'ember-metal/utils';
import computed from 'ember-computed';
import { humanize } from '../helpers/humanize';
import { componentNodes } from '../lib/ember-private-api';
import { buildMobiledoc } from '../components/cms-render-mobiledoc';

const CMSField = Component.extend({
  layout,
  tools: inject(),
  tagName: '',

  // whether a hoverable/highlightable overlay box getes generated for this field.
  overlay: true,

  didReceiveAttrs() {
    let field = this.get('field');
    let m = /^customization\.(.*)/.exec(field);
    if (m) {
      this.set('field', m[1]);
      this.set('model', this.get('page.customization'));
    }
    if (!this.get('name')) {
      this.set('name', this.get('field'));
    }
  },

  didRender() {
    this.get('tools').registerField(guidFor(this), this.fieldInfo());
  },

  willDestroyElement() {
    this.get('tools').unregisterField(guidFor(this));
  },

  _fields() {
    return [this.get('field')];
  },

  fieldInfo() {
    let { firstNode, lastNode } = componentNodes(this);
    return new FieldInfo(
      this.get('model'),
      this.get('page'),
      this.get('name'),
      this._fields(),
      firstNode,
      lastNode,
      this.get('overlay'),
      this.get('track')
    );
  },

  defaultValue: computed('field', 'tools.editing', 'tools.primaryPage', function() {
    let field = this.get('field');
    if (this.get('tools.editing') && this.get('tools.primaryPage') === this.get('page')) {
      let meta = this.get('model').constructor.metaForProperty(field);
      if (meta.type === 'mobiledoc') {
        return buildMobiledoc(`Enter ${humanize(field)} here...`);
      } else if (meta.type === 'string' || meta.type === 'tilelist') {
        return `Enter ${humanize(field)}`;
      } else if (meta.type === 'topic' || meta.type === 'issue-type' || meta.type === 'event-type' || meta.type === 'resource-type') {
        return Object.create({ name: `Choose ${humanize(field)}`});
      } else if (meta.type === 'image') {
        return Object.create({
          url: '/placeholder-photo.png',
          caption: 'Enter Caption'
        });
      } else if (meta.type === 'tablist') {
        return [{
          title: '',
          body: buildMobiledoc(`Enter body here...`)
        }];
      }
    }
  })
});

CMSField.reopenClass({
  positionalParams: ['field']
});

export default CMSField;
