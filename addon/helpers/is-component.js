import Ember from 'ember';

export default Ember.Helper.extend({
  compute([name]) {
    let owner = Ember.getOwner(this);
    let res = owner.lookup('component-lookup:main').lookupFactory(name, owner);

    if (!res) {
      console.warn("component `" + name + "` does not exist.");
    }

    return res;
  }
});
