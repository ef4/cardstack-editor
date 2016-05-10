import layout from '../templates/components/field-editors';
import Component from 'ember-component';
import { task, timeout } from 'ember-concurrency';
import computed from 'ember-computed';

export default Component.extend({
  layout,

  // We are deliberately not observing `tools.fields.[]`. We only do
  // whole array replacements. Glimmer has our back.
  fields: computed('tools.fields', 'tools.primaryPage', function() {
    let primaryPage = this.get('tools.primaryPage');
    return this.get('tools.fields').filter(field => {
      return field.page === primaryPage;
    });
  }),

  highlightField: task(function * (field) {
    this.get('tools.highlightField')(field);
    yield timeout(500);
    if (field) {
      field.reveal();
    }
  }).restartable()
});
