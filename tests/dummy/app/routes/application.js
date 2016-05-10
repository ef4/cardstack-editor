import Route from 'ember-route';
export default Route.extend({
  model() {
    return this.store.createRecord('post', {
      title: 'Hello World'
    });
  }
});
