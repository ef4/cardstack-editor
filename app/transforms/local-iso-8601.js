import DS from 'ember-data';
import moment from 'moment';

// This handles the local times we get from Drupal. ember-data's
// default 'date' transform always treats them as GMT and then
// converts to the user's local zone, which is not what we
// want. Likewise, when we serialize to send back, we want to keep
// them local and not include our time zone.

export default DS.Transform.extend({
  serialize: function(value) {
    if (value != null) {
      return moment(value).format('YYYY-MM-DDTHH:mm:ss');
    }
  },
  deserialize: function(value) {
    if (value != null) {
      return moment(value, moment.ISO_8601).toDate();
    }
  }
});
