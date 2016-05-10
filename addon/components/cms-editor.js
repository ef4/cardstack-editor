import Component from 'ember-component';
import inject from 'ember-service/inject';
import layout from '../templates/components/cms-editor';

export default Component.extend({
  layout,
  tools: inject(),
  didRender() {
    if (this.get('isPrimary')) {
      this.get('tools').setPrimaryPage(this);
    } else {
      this.get('tools').clearPrimaryPage(this);
    }
  },
  willDestroyElement() {
    this.get('tools').clearPrimaryPage(this);
  }
});
