import Service from 'ember-service';
import computed from 'ember-computed';

export default Service.extend({

  user: computed(function() {
    return { isEditor: true };
  })
});
