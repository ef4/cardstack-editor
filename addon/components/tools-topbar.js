import Component from 'ember-component';
import layout from '../templates/components/tools-topbar';

export default Component.extend({
  classNames: ['tools-topbar'],
  classNameBindings: ['tools.active'],
  layout,

  actions: {
    cardBack() {
      let model = this.get('tools.primaryPage.model');
      if (!model || model.get('hasPage')) {
        this.get('tools.preview')('page');
      } else {
        this.get('returnToHome')();
      }
    },
    maybePreviewPage() {
      let model = this.get('tools.primaryPage.model');
      if (!model || model.get('hasPage')) {
        this.get('tools.preview')('page');
      }
    }
  }
});
