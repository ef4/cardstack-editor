import Component from 'ember-component';
import { componentNodes } from '../lib/ember-private-api';
import $ from 'jquery';

export default Component.extend({
  tagName: '',
  didInsertElement() {
    let { firstNode, lastNode } = componentNodes(this);
    let node = firstNode;
    while (node && node !== lastNode) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        $(node).focus();
        break;
      }
      node = node.nextSibling;
    }
  }
});
