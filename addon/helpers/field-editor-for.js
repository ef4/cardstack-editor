import { helper } from 'ember-helper';
import { pluralize } from 'ember-inflector';

export default helper(function([model, field]) {
  if (!model || !field) { return; }
  let constructor = model.constructor;
  if (!constructor || !constructor.metaForProperty) { return; }
  let meta;
  try {
    meta = constructor.metaForProperty(field);
  } catch(err) {
    return;
  }
  if (meta && (meta.isAttribute || meta.isRelationship)) {
    let type = meta.type || 'default';
    // Ember Data labels both attributes and relationships with 'type',
    // and we're going to match either, leaving it up to the individual
    // editors to know which kind of thing they're supposed to be
    // handling.

    if (meta.isRelationship && meta.kind === 'hasMany') {
      // This lets us have different editors for editing hasMany vs
      // belongsTo relationships to the same model type.
      type = pluralize(type);
    }

    return `field-editors/${type}-editor`;
  }
});
