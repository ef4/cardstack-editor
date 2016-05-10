import Component from 'ember-component';
import layout from '../templates/components/tools-sidebar';

export default Component.extend({
  classNames: ['tools-sidebar'],
  classNameBindings: ['active'],
  tabs: [
    { name: "compose", icon: "write" },
    { name: "library", icon: "archive" }
  ],
  layout
});
