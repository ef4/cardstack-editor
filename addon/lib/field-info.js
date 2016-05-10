import { guidFor } from 'ember-metal/utils';
import $ from 'jquery';
import { boundingClientRect } from './range-bounds';
import { currentTransform } from './matrix';

// these are classes whose presence in an element's ancestors affects
// the styling of a field, so that if we want to style an overlay
// editor the same way we will need to bring the classes along.
const portableClasses = ['aia-card-1x1', 'aia-card-2x1', 'aia-card'];

export default class FieldInfo {
  constructor(model, page, name, fields, firstNode, lastNode, overlay, trackSelector) {
    this.name = name;
    this.fields = fields;
    this.id = `${page}/${name}/${guidFor(model)}`; // This gives us a stable key across rerenders.
    this.model = model;
    this.page = page;
    this.firstNode = firstNode;
    this.lastNode = lastNode;
    this.overlay = overlay;
    this.trackSelector = trackSelector;
  }

  _fieldRange() {
    let r = new Range();
    r.setStartBefore(this.firstNode);
    r.setEndAfter(this.lastNode);
    return r;
  }

  boundingBox() {
    if (this.trackSelector) {
      // Locate an element that matches trackSelector that also falls
      // within our node range.
      let topLimit = this.firstNode.parentNode;
      let elements = elementsBetween(this.firstNode, this.lastNode);
      for (let elt of Array.from($(topLimit).find(this.trackSelector))) {
        let cursor  = elt;
        while (cursor && cursor !== topLimit) {
          if (elements.indexOf(cursor) !== -1) {
            return elt.getBoundingClientRect();
          }
          cursor = cursor.parentNode;
        }
      }
    }
    return boundingClientRect(this._fieldRange());
  }

  reveal() {
    let midScreen = $(window).height() / 2;
    let box = this.boundingBox();
    if (box && (box.bottom < midScreen || box.top > midScreen)) {
      $('html').velocity('scroll', { offset: box.top - midScreen + $('body').scrollTop() });
    }
  }

  closestTransform() {
    let node = $(this.firstNode).parent();
    while (node.length > 0 && node[0] !== window.document) {
      let t = node.css('transform');
      if (t !== 'none') {
        return currentTransform(node);
      }
      node = node.parent();
    }
  }

  classContexts() {
    let output = [];
    for (let cls of portableClasses) {
      if ($(this.firstNode).closest(`.${cls}`).length > 0) {
        output.push(cls);
      }
    }
    return output;
  }
}

function elementsBetween(startNode, endNode) {
  let elements = [];
  let node = startNode;
  while (node && node !== endNode) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      elements.push(node);
    }
    node = node.nextSibling;
  }
  return elements;
}
