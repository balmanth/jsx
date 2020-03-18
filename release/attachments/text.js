"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _content;
Object.defineProperty(exports, "__esModule", { value: true });
/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
const attachment_1 = require("./attachment");
/**
 * Text attachment.
 */
class Text extends attachment_1.Attachment {
    /**
     * Constructor.
     * @param content Text content.
     */
    constructor(content) {
        super();
        /**
         * Text content.
         */
        _content.set(this, void 0);
        __classPrivateFieldSet(this, _content, content);
    }
    /**
     * Get text content.
     */
    get content() {
        return __classPrivateFieldGet(this, _content);
    }
}
exports.Text = Text;
_content = new WeakMap();
//# sourceMappingURL=text.js.map