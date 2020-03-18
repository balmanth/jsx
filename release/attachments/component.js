"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _state;
Object.defineProperty(exports, "__esModule", { value: true });
/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
const Objects = require("@balmanth/objects");
const attachment_1 = require("./attachment");
/**
 * Component attachment.
 */
class Component extends attachment_1.Attachment {
    constructor() {
        super(...arguments);
        /**
         * Component state.
         */
        _state.set(this, Objects.emptyObject);
    }
    /**
     * Get state.
     */
    get state() {
        return __classPrivateFieldGet(this, _state);
    }
    /**
     * Construct the component.
     */
    construct() { }
    /**
     * Refresh the component attributes.
     */
    refresh() { }
    /**
     * Reassign the component children.
     */
    reassign() { }
    /**
     * Destruct the component.
     */
    destruct() { }
    /**
     * Update the current component state.
     * @param state New state.
     * @param recycle Determines whether or not the component will be recycled. (Default is true)
     */
    update(state, recycle) {
        __classPrivateFieldSet(this, _state, Object.freeze({ ...__classPrivateFieldGet(this, _state), ...state }));
    }
}
exports.Component = Component;
_state = new WeakMap();
//# sourceMappingURL=component.js.map