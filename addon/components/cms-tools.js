import Ember from 'ember';
import layout from '../templates/components/cms-tools';
import inject from 'ember-service/inject';

export default Ember.Component.extend({
  layout,
  tools: inject()
});
