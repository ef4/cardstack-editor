import Helper from 'ember-helper';
import Ember from 'ember';
import { humanize } from './humanize';

export default Helper.extend({
  compute([model]) {
    if (!model) { return; }
    let modelName = model.constructor.modelName;
    let Model = Ember.getOwner(this).resolveRegistration(`model:${modelName}`);
    if (Model && Model.friendlyName) {
      return Model.friendlyName;
    }
    return humanize(modelName);
  }
});
