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
var _name;
Object.defineProperty(exports, "__esModule", { value: true });
/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
const attachment_1 = require("./attachment");
/**
 * Element attachment.
 */
class Element extends attachment_1.Attachment {
    /**
     * Constructor.
     * @param name Element name.
     */
    constructor(name) {
        super();
        /**
         * Element name.
         */
        _name.set(this, void 0);
        __classPrivateFieldSet(this, _name, name);
    }
    /**
     * Get element name.
     */
    get name() {
        return __classPrivateFieldGet(this, _name);
    }
}
exports.Element = Element;
_name = new WeakMap();
//# sourceMappingURL=element.js.map