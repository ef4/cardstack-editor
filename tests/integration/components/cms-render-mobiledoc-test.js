import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cms-render-mobiledoc', 'Integration | Component | cms render mobiledoc', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{cms-render-mobiledoc}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#cms-render-mobiledoc}}
      template block text
    {{/cms-render-mobiledoc}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
