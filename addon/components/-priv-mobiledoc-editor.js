import MobiledocEditor from 'ember-mobiledoc-editor/components/mobiledoc-editor/component';
import { boundingClientRect } from '../lib/range-bounds';

export default MobiledocEditor.extend({
  init() {
    this._super();
    this._lastSelectionBounds = null;
    this._lastCursor = null;
  },

  cursorDidChange(editor) {
    this._super(editor);

    let bounds;
    if (editor.cursor.selection.rangeCount > 0) {
      bounds = boundingClientRect(editor.cursor.selection.getRangeAt(0));
    }


    let activeSection = editor.activeSection;

    this.sendAction('cursor-changed', {
      bounds,
      hasSelection: editor.cursor.hasSelection(),
      hasCursor: editor.cursor.hasCursor(),
      activeSection,
      activeSectionBounds: activeSection ? activeSection.renderNode._element.getBoundingClientRect() : null
    });
  }


});
