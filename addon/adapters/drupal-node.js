import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend({
  namespace: 'jsonapi/v1',
  pathForType() {
    return 'nodes';
  }
});
