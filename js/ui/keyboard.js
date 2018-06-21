goog.module('stack.ui.Keyboard');

const Disposable = goog.require('goog.Disposable');
const KeyboardShortcutEvent = goog.require('goog.ui.KeyboardShortcutEvent');
const KeyboardShortcutHandler = goog.require('goog.ui.KeyboardShortcutHandler');
const events = goog.require('goog.events');

class Keyboard extends Disposable {

  constructor() {
    super();

    /** @const @private @type {!Object<string,!Array<!function(!KeyboardShortcutEvent)>>} */
    this.callbacks_ = {};

    /** @private @type {!KeyboardShortcutHandler} */
    this.shortcuts_ = new KeyboardShortcutHandler(document);
    this.shortcuts_.setAllShortcutsAreGlobal(true);

    events.listen(this.shortcuts_, KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
                  this.handleKeyboardShortcut, false, this);
  }

  /**
   * @param {!function(!KeyboardShortcutEvent)} callback
   * @param {string} identifier Identifier for the task performed by the keyboard
   *                 combination. Multiple shortcuts can be provided for the same
   *                 task by specifying the same identifier.
   * @param {...(number|string|!Array<number>)} var_args See below.
   */
  shortcut(callback, identifier, var_args) {
    this.shortcuts_.registerShortcut(identifier, var_args);
    var list = this.callbacks_[identifier];
    if (!list) {
      list = [];
      this.callbacks_[identifier] = list;
    }
    list.push(callback);
    //console.log('Registered shortcut', identifier, var_args);
  }

  /**
   * @param {!KeyboardShortcutEvent} e
   */
  handleKeyboardShortcut(e) {
    // this.dir(e, 'Notified of kbd shortcut...');
    for (let c of this.callbacks_[e.identifier]) {
      c(e);
    }
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    if (this.shortcuts_) {
      this.shortcuts_.dispose();
      delete this.shortcuts_;
    }
  }

}

exports = Keyboard;
