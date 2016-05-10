import Ember from 'ember';
import { alias } from 'ember-computed';
import layout from '../templates/components/content-edit';

export default Ember.Component.extend({
  layout,
  classNames: ['content-edit'],
  model: alias('tools.primaryPage.model')
});
