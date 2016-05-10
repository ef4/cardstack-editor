import { helper } from 'ember-helper';
import { mobiledocToText } from './mobiledoc-to-text';

export default helper(function([model, field, value]) {
  let meta = model.constructor.metaForProperty(field);
  switch (meta.type) {
  case 'mobiledoc':
    return mobiledocToText(value).length > 0;
  default:
    return value && value !== '' && (!Array.isArray(value) || value.length > 0);
  }
});
