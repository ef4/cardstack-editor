import Ember from 'ember';
import layout from '../templates/components/cms-icon';

const CMSIcon = Ember.Component.extend({
  layout,
  didReceiveAttrs() {
    this.set('iconName', 'icon-' + this.get('name'));
  },
  tagName: 'span'
});

CMSIcon.reopenClass({
  positionalParams: ['name']
});

export default CMSIcon;
