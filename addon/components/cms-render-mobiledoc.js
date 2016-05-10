import layout from '../templates/components/cms-render-mobiledoc';
import Renderer from 'ember-mobiledoc-dom-renderer';
import Component from 'ember-component';
import computed from 'ember-computed';
import inject from 'ember-service/inject';

export const cards = ['image-card', 'images-card'];

export default Component.extend({
  layout,
  tagName: '',
  cardNames: cards,
  fastboot: inject(),
  isFastBoot: computed.readOnly('fastboot.isFastBoot'),

  // When in FastBoot mode, where rendering the Mobiledoc is a one-shot
  // operation, we can build the DOM directly and return the serialized value
  // as this computed property. This lets us insert the raw HTML into the
  // rendered output.
  renderedMobiledoc: computed(function() {
    let SimpleDOM = FastBoot.require('simple-dom');
    let doc = new SimpleDOM.Document();

    let cards = this.get('_mdcCards');
    let mobiledoc = this.get('mobiledoc');

    let renderer = new Renderer({ cards, dom: doc });
    let { result, teardown } = renderer.render(mobiledoc);

    let HTMLSerializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);
    let serialized = HTMLSerializer.serialize(result);

    // Immediately teardown once we've serialized
    teardown();

    return serialized;
  })
});

export function buildMobiledoc(initialString="") {
  return {
    "version": "0.3.0",
    "atoms": [],
    "cards": [],
    "markups": [],
    "sections": [
      [
        1,
        "p",
        [
          [
            0,
            [],
            0,
            initialString
          ]
        ]
      ]
    ]
  };
}
