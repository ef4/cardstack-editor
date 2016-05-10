/*
   This module encapsulates all known uses of Ember private APIs. By
   keeping them all together here we make it easier to upgrade Ember.
*/


// Get the first and last dom nodes for a component (even a tagless
// one, which is why we need private API).
export function componentNodes(component) {
  return {
    firstNode: component._renderNode.firstNode,
    lastNode: component._renderNode.lastNode
  };
}
