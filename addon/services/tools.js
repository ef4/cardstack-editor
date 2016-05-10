import Ember from 'ember';
import Service from 'ember-service';
import computed, { readOnly } from 'ember-computed';
import inject from 'ember-service/inject';
import { scheduleOnce } from 'ember-runloop';
import { guidFor } from 'ember-metal/utils';

export default Service.extend({
  auth: inject(),

  init() {
    this._super();
    this.set('fields', []);
    this.set('hasNotBeenActive', true);
    this._fieldSources = Object.create(null);
    this._highlightedFieldId = null;
    this._primaryPageSources = Object.create(null);
  },

  registerField(sourceId, field) {
    this._fieldSources[sourceId] = field;
    scheduleOnce('afterRender', this, this._handleFieldUpdates);
  },

  unregisterField(sourceId) {
    this._fieldSources[sourceId] = null;
    scheduleOnce('afterRender', this, this._handleFieldUpdates);
  },

  _handleFieldUpdates() {
    let sources = this._fieldSources;
    let fields = Object.create(null);
    for (let fieldId in sources) {
      let field = sources[fieldId];
      if (field) {
        fields[field.id] = field;
        field.highlight = this._highlightedFieldId === field.id;
      }
    }
    this.set('fields', Object.keys(fields).map(id => fields[id]));
  },

  requested: readOnly('topController.toolsRequested'),
  _editing: readOnly('topController.editing'),
  editing: computed('_editing', 'active', function() {
    return this.get('_editing') && this.get('active');
  }),
  previewMode: readOnly('topController.previewMode'),
  tab: readOnly('topController.toolsTab'),

  // This is to deal with the flickr that appears when working fastboot is enabled
  // the activation animation triggers when browser javascript is processed
  // and I apologize for the observer
  afterActivated: Ember.observer('topController.toolsRequested', 'available', function() {
    if (this.get('topController.toolsRequested') && this.get('available')) {
      this.set('hasNotBeenActive', false);
    }
  }),

  available: computed('auth.user.isEditor', function() {
    if (!window.janrain) {
      return !!this.get('auth.user');
    }
    return !!this.get('auth.user.isEditor');
  }),

  active: computed('requested', 'available', function() {
    return this.get('requested') && this.get('available');
  }),

  // The following actions are computed properties that return
  // closures so they can be passed around directly in templates.

  activate: computed(function() {
    return (state) => this.get('topController').set('toolsRequested', state);
  }),

  toggle: computed(function() {
    return () => this.get('topController').set('toolsRequested', !this.get('requested'));
  }),

  edit: computed(function() {
    return state => this.get('topController').set('editing', state);
  }),

  preview: computed(function() {
    return mode => {
      if (mode !== this.get('previewMode')) {
        this.set('openedField', null);
        this.get('topController').set('previewMode', mode);
      }
    };
  }),

  highlightField: computed(function() {
    return field => {
      this._highlightedFieldId = field ? field.id : null;
      scheduleOnce('afterRender', this, this._handleFieldUpdates);
    };
  }),

  openField: computed(function() {
    return field => {
      this.set('openedField', field);
      this.get('switchToTab')('compose');
    };
  }),

  switchToTab: computed(function() {
    return tab => {
      this.get('topController').set('toolsTab', tab);
    };
  }),

  setPrimaryPage(page) {
    this._primaryPageSources[guidFor(page)] = page;
    scheduleOnce('afterRender', this, this._updatePrimaryPage);
  },

  clearPrimaryPage(page) {
    delete this._primaryPageSources[guidFor(page)];
    scheduleOnce('afterRender', this, this._updatePrimaryPage);
  },

  _updatePrimaryPage() {
    let key = Object.keys(this._primaryPageSources)[0];
    if (key) {
      this.set('primaryPage', this._primaryPageSources[key]);
    } else {
      this.set('primaryPage', null);
    }
  }

});
