import Ember from 'ember';
import layout from '../templates/components/publication-control';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import { alias } from 'ember-computed';

export default Ember.Component.extend({
  layout,
  classNames: ['publication-control'],
  classNameBindings: ['enabled'],
  opened: true,
  store: inject(),
  model: alias('page.model'),

  didReceiveAttrs() {
    this.set('willPublish', this.get('model.published') || false);
  },

  heading: computed('model.isNew', 'model.hasDirtyFields', 'model.published', function(){
    if (this.get('model.isNew')) {
      return {
        title: 'Publish',
        date: null
      };
    } else if (this.get('model.hasDirtyFields')){
      return {
        title: "Changed",
        date: new Date() // we rely on our own caching to be invalidated each time the model is touched
      };
    } else if (this.get('model.published')) {
      return {
        title: "Published",
        date: this.get('model.changed')
      };
    } else {
      return {
        title: "Drafted",
        date: this.get('model.changed')
      };
    }
  }),

  customizationsChanged: computed('page.customization.hasDirtyFields', function() {
    let c = this.get('page.customization');
    // it's important that if a page.customization is present, we
    // actually evaluate the hasDirtyFields computed property
    // here. Otherwise we won't necessary get observaton of its future
    // changes.
    return c && c.get('hasDirtyFields') && !c.isPristine();
  }),

  anythingPending: computed('model.isNew', 'model.hasDirtyFields', 'model.needsUpdate', 'willPublish', 'model.published', 'customizationsChanged', function() {
    return this.get('model.isNew') || this.get('model.needsUpdate') || this.get('model.hasDirtyFields') || this.get('willPublish') !== this.get('model.published') || this.get('customizationsChanged');
  }),

  buttonTitle: computed('willPublish', 'model.published', function() {
    if (this.get('willPublish') && !this.get('model.published')) {
      return 'Publish';
    }
    if (!this.get('willPublish') && this.get('model.published')) {
      return 'Unpublish';
    }
    return 'Update';
  }),

  actions: {
    setPublished(state) {
      if (this.get('enabled')) {
        this.get('model').set('published', state);
      }
    },
    doUpdate() {
      this.get('model').set('published', this.get('willPublish'));
      if (this.get('model.hasDirtyFields') || this.get('model.needsUpdate')) {
        this.get('model').save().then(()=> {
          this.set('model.needsUpdate', false); // deal with `tilelist` dirty checking
        });
      }
      let customization = this.get('page.customization');
      if (customization && customization.get('hasDirtyFields')) {
        customization.save();
      }
    },
    delete() {
      if (confirm(`You are about to delete ${this.get('model.title') || 'this content'}. Are you sure?`)) {
        let content = this.get('model');
        content.set('deleted', true);
        content.save().then(() => {
          this.get('store').unloadRecord(content);
          this.get('returnToHome')();
        });
      }
    }
  }
});
