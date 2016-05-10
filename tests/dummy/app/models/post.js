import DrupalNode from 'cardstack-cms/models/drupal-node';
import attr from 'ember-data/attr';

export default DrupalNode.extend({
  body: attr('mobiledoc'),
  title: attr('string')
});
