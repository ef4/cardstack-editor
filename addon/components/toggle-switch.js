import Ember from 'ember';
import layout from '../templates/components/toggle-switch';

export default Ember.Component.extend({
  layout,
  classNames: ['toggle-switch'],
  classNameBindings: ['enabled::disabled'],
  enabled: true,
  click() {
    if (this.get('enabled')) {
      this.get('change')(!this.get('value'));
    }
  }
});
