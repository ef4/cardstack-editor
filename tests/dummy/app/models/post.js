import attr from 'ember-data/attr';
import Model from 'ember-data/model';

export default Model.extend({
  body: attr('mobiledoc'),
  title: attr('string'),
  featured: attr('boolean', { editorial: true })
});
