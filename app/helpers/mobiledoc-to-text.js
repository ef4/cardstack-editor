import { helper } from 'ember-helper';
import TextRenderer from 'ember-mobiledoc-text-renderer';

export default helper(function([a], hash) {
  return mobiledocToText(a, hash);
});

export function mobiledocToText(mobiledoc, rendererArgs={}) {
  if (!mobiledoc) { return ''; }
  let renderer = new TextRenderer(rendererArgs);
  let rendered = renderer.render(mobiledoc);
  let text = rendered.result;
  rendered.teardown();
  return text;
}
