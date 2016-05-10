import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  attrs: {
    created: { serialize: false },
    changed: { serialize: false }
  },
  modelNameFromPayloadKey: function(payloadKey) {
    if (payloadKey === 'node') {
      return 'drupal-node';
    } else {
      return this._super(payloadKey);
    }
  }
});
