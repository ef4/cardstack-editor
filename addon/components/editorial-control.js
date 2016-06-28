import layout from '../templates/components/editorial-control';
import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import Ember from 'ember';

export default Component.extend({
  layout,
  classNames: ['editorial-control'],

  editorialFieldNames: computed('model', function() {
    let model = this.get('model');
    let fields = Ember.A();

    get(model.constructor, 'attributes').forEach((meta, name) => {
      if (meta.options && meta.options.editorial) {
        fields.push({ name, order: meta.options.editorialSortOrder });
      }
    });

    get(model.constructor, 'relationshipsByName').forEach((meta, name) => {
      if (meta.options && meta.options.editorial) {
        fields.push({ name, order: meta.options.editorialSortOrder });
      }
    });

    return fields.sort((a,b) => {
      let aOrder = a.order == null ? 100 : a.order;
      let bOrder = b.order == null ? 100 : b.order;
      return aOrder - bOrder;
    }).mapBy('name');
  }),

  opened: false,

  didReceiveAttrs() {
    // if one of the fields in the template is being opened, we should close
    if (this.get('openedField')) {
      this.set('opened', false);
    }
  },

  actions: {
    open() {
      // when we open, any open field should close
      this.get('closeField')();
      this.set('opened', true);
    },
    close() {
      this.set('opened', false);
    }
  }
});
