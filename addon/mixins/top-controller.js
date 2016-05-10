import Mixin from 'ember-metal/mixin';
import inject from 'ember-service/inject';
import computed from 'ember-computed';
import observer from 'ember-metal/observer';

export default Mixin.create({
  auth: inject(),
  tools: inject(),

  // The top-level controller is the definitive owner of the
  // following state, because this state needs to be expressed in
  // application-wide query parameters. But all access to this state
  // should go through the `tools` service.
  queryParams: {
    emailVerificationCode: 'verification_code',
    toolsRequested: 'tools',
    editing: 'editing',
    previewMode: 'previewing',
    toolsTab: 'tab'
  },
  toolsRequested: false,
  editing: false,
  previewMode: 'page',
  toolsTab: 'compose',

  init() {
    this._super();
    this.get('tools').set('topController', this);
  },

  returnToHome: computed(function() {
    return () => this.transitionToRoute('index', { queryParams: { previewMode: 'page' }});
  }),
  afterEmailVerification: observer('emailVerificationCode', function() {
    if (this.get('emailVerificationCode') && window.janrain) {
      window.janrain.capture.ui.start();
    }
  })
});
