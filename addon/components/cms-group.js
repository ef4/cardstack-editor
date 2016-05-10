import layout from '../templates/components/cms-group';
import CMSField from './cms-field';
import computed from 'ember-computed';

const CMSGroup = CMSField.extend({
  layout,
  tagName: '',

  fieldNames: computed('fields.[]', function() {
    return this.get('fields').split(',');
  }),

  _fields() {
    const limit = 7;
    let fieldNames = this.get('fieldNames');
    if (fieldNames.length > limit) {
      console.warn(`can't handle more than ${limit} in a group at the moment, see template`);
    }
    return fieldNames;
  },

  didReceiveAttrs() {
    if (!this.get('name')) {
      this.set('name', this.get('groupName'));
    }
    this._super();
  }
});

CMSGroup.reopenClass({
  positionalParams: ['groupName']
});

export default CMSGroup;
