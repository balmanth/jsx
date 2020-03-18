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
var _type, _ready, _parent, _children, _attributes, _attachment, _nodes, _reference;
Object.defineProperty(exports, "__esModule", { value: true });
/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
const Differs = require("@balmanth/differs");
const Objects = require("@balmanth/objects");
const component_1 = require("./attachments/component");
const fragment_1 = require("./attachments/fragment");
const element_1 = require("./attachments/element");
const text_1 = require("./attachments/text");
/**
 * Determines whether both nodes are equal or not.
 * @param cache Cache of equality.
 * @param oldNode Old node.
 * @param newNode New node.
 * @returns Returns true when both nodes are equal, false otherwise.
 */
function areEqualNodes(cache, oldNode, newNode) {
    if (oldNode.type === newNode.type) {
        switch (oldNode.type) {
            case 0 /* Fragment */:
            case 1 /* Component */:
                if (Objects.areEqualTypes(oldNode.attachment, newNode.attachment)) {
                    return cache.set(oldNode, newNode), true;
                }
                break;
            case 2 /* Element */:
                if (oldNode.attachment.name === newNode.attachment.name) {
                    return cache.set(oldNode, newNode), true;
                }
                break;
            case 3 /* Text */:
                if (oldNode.attachment.content === newNode.attachment.content) {
                    return cache.set(oldNode, newNode), true;
                }
                break;
        }
    }
    return false;
}
/**
 * Recycle the current nodes with the proposed nodes if there are notable changes.
 * @param parent Parent node.
 * @param current Current nodes.
 * @param proposal Proposed nodes.
 * @returns Returns the resulting list.
 */
function recycleNodes(parent, current, proposal) {
    const cache = new WeakMap();
    const compare = areEqualNodes.bind(null, cache);
    const table = Differs.Core.getTable(current, proposal, compare);
    const changes = Differs.Core.getChanges(current, proposal, compare, table);
    const result = [];
    let previous;
    for (const change of changes) {
        switch (change.action) {
            case 1 /* Insert */:
                for (const current of change.values) {
                    result.push(parent.insert(current, previous));
                    previous = current;
                }
                break;
            case 0 /* Keep */:
                for (const current of change.values) {
                    const newer = cache.get(current);
                    result.push(current.recycle(newer));
                    previous = current;
                }
                break;
            case 2 /* Remove */:
                for (const current of change.values) {
                    parent.remove(current);
                }
                break;
        }
    }
    return result;
}
/**
 * Recycle the current children using the proposed children if there are notable changes.
 * @param current Current children.
 * @param proposal Proposed children.
 * @param result Recycling results.
 * @returns Returns true when some child was recycled, false otherwise.
 */
function recycleChildren(current, proposal, result) {
    const cache = new WeakMap();
    const compare = areEqualNodes.bind(null, cache);
    const table = Differs.Core.getTable(current, proposal, compare);
    const changes = Differs.Core.getChanges(current, proposal, compare, table);
    let counter = 0;
    for (const change of changes) {
        switch (change.action) {
            case 1 /* Insert */:
                result.push(...change.values);
                counter++;
                break;
            case 0 /* Keep */:
                result.push(...change.values);
                break;
            case 2 /* Remove */:
                counter++;
                break;
        }
    }
    return counter > 0;
}
/**
 * Recycle the current attributes using the proposed attributes if there are notable changes.
 * @param current Current attributes.
 * @param proposal Proposed attributes.
 * @param result Recycling results.
 * @returns Returns true when some attribute was recycled, false otherwise.
 */
function recycleAttributes(current, proposal, result) {
    const oldNames = Object.keys(current);
    const newNames = Object.keys(proposal);
    const table = Differs.Core.getTable(oldNames, newNames, Objects.areEqual);
    const changes = Differs.Core.getChanges(oldNames, newNames, Objects.areEqual, table);
    let counter = 0;
    for (const change of changes) {
        for (const name of change.values) {
            const newValue = proposal[name];
            switch (change.action) {
                case 1 /* Insert */:
                    result[name] = newValue;
                    counter++;
                    break;
                case 0 /* Keep */:
                    const oldValue = current[name];
                    if (oldValue !== newValue) {
                        result[name] = newValue;
                        counter++;
                    }
                    break;
                case 2 /* Remove */:
                    result[name] = void 0;
                    counter++;
                    break;
            }
        }
    }
    return counter > 0;
}
/**
 * Get a new list of nodes from the specified input value.
 * @param input Input value.
 * @returns Returns a list of child nodes.
 * @throws Throws an error when some node node isn't a valid instance of Node.
 */
function getNodes(input) {
    if (input === void 0 || input === null) {
        return Objects.emptyArray;
    }
    else {
        const list = [];
        if (input instanceof Array) {
            for (const current of input) {
                list.push(...getNodes(current));
            }
        }
        else {
            if (!(input instanceof Node)) {
                throw new TypeError(`Input value isn't a valid instanceof of Node.`);
            }
            else {
                list.push(input);
            }
        }
        return list;
    }
}
/**
 * Node class.
 */
class Node {
    /**
     * Constructor.
     * @param attachment Attachment instance.
     * @param attributes Attachment attributes.
     * @param children Attachment children
     * @throws Throws an error when the specified attachment isn't supported.
     */
    constructor(attachment, attributes, children) {
        /**
         * Node type.
         */
        _type.set(this, void 0);
        /**
         * Determines whether or not the node was constructed.
         */
        _ready.set(this, void 0);
        /**
         * Node parent.
         */
        _parent.set(this, void 0);
        /**
         * Attachment children.
         */
        _children.set(this, void 0);
        /**
         * Attachment attributes.
         */
        _attributes.set(this, void 0);
        /**
         * Node attachment.
         */
        _attachment.set(this, void 0);
        /**
         * Node children.
         */
        _nodes.set(this, void 0);
        /**
         * Node reference.
         */
        _reference.set(this, void 0);
        __classPrivateFieldSet(this, _ready, false);
        __classPrivateFieldSet(this, _parent, null);
        __classPrivateFieldSet(this, _children, Object.freeze(children));
        __classPrivateFieldSet(this, _attributes, Objects.freeze({ ...attributes }));
        __classPrivateFieldSet(this, _attachment, attachment);
        if (attachment instanceof fragment_1.Fragment) {
            __classPrivateFieldSet(this, _type, 0 /* Fragment */);
            __classPrivateFieldSet(this, _nodes, Object.freeze([]));
        }
        else if (attachment instanceof component_1.Component) {
            __classPrivateFieldSet(this, _type, 1 /* Component */);
            __classPrivateFieldSet(this, _nodes, Object.freeze([]));
        }
        else if (attachment instanceof element_1.Element) {
            __classPrivateFieldSet(this, _type, 2 /* Element */);
            __classPrivateFieldSet(this, _nodes, __classPrivateFieldGet(this, _children));
        }
        else if (attachment instanceof text_1.Text) {
            __classPrivateFieldSet(this, _type, 3 /* Text */);
            __classPrivateFieldSet(this, _nodes, __classPrivateFieldGet(this, _children));
        }
        else {
            throw TypeError(`Unsupported attachment instance.`);
        }
    }
    /**
     * Determines whether or not the specified value is a component type.
     * @param value Value to check.
     * @returns Returns true when the value is a component type, false otherwise.
     */
    static isComponentType(value) {
        return Objects.isDerivedFrom(value, component_1.Component);
    }
    /**
     * Determines whether or not the specified value is a fragment type.
     * @param value Value to check.
     * @returns Returns true when the value is a component type, false otherwise.
     */
    static isFragmentType(value) {
        return Objects.isDerivedFrom(value, fragment_1.Fragment);
    }
    /**
     * Determines whether or not the specified value is an element type.
     * @param value Value to check.
     * @returns Returns true when the value is an element type, false otherwise.
     */
    static isElementType(value) {
        return typeof value === 'string';
    }
    /**
     * Node type.
     */
    get type() {
        return __classPrivateFieldGet(this, _type);
    }
    /**
     * Determines whether the node was constructed or not.
     */
    get ready() {
        return __classPrivateFieldGet(this, _ready);
    }
    /**
     * Node parent.
     */
    get parent() {
        return __classPrivateFieldGet(this, _parent);
    }
    /**
     * Attachment children.
     */
    get children() {
        return __classPrivateFieldGet(this, _children);
    }
    /**
     * Attachment attributes.
     */
    get attributes() {
        return __classPrivateFieldGet(this, _attributes);
    }
    /**
     * Node attachment.
     */
    get attachment() {
        return __classPrivateFieldGet(this, _attachment);
    }
    /**
     * Node children.
     */
    get nodes() {
        return __classPrivateFieldGet(this, _nodes);
    }
    /**
     * Node reference.
     */
    get reference() {
        return __classPrivateFieldGet(this, _reference);
    }
    /**
     * Construct the node.
     * @throws Throws an error when the node is already constructed.
     */
    construct() {
        if (__classPrivateFieldGet(this, _ready)) {
            throw new TypeError(`The node was already constructed.`);
        }
        else {
            __classPrivateFieldSet(this, _ready, true);
            if (__classPrivateFieldGet(this, _type) === 0 /* Fragment */) {
                const nodes = getNodes(__classPrivateFieldGet(this, _attachment).render());
                __classPrivateFieldSet(this, _nodes, Object.freeze(nodes));
            }
            else if (__classPrivateFieldGet(this, _type) === 1 /* Component */) {
                __classPrivateFieldGet(this, _attachment).construct();
                const nodes = getNodes(__classPrivateFieldGet(this, _attachment).render());
                __classPrivateFieldSet(this, _nodes, Object.freeze(nodes));
            }
            else {
                const reference = __classPrivateFieldGet(this, _attachment).render();
                __classPrivateFieldSet(this, _reference, reference);
            }
            let previous;
            for (const current of __classPrivateFieldGet(this, _nodes)) {
                this.insert(current, previous);
                previous = current;
            }
        }
    }
    /**
     * Insert a child node.
     * @param node Node instance.
     * @param previous Previous node in which child is inserted.
     * @returns Returns the child node.
     * @throws Throws an error when the specified nodes has a parent.
     */
    insert(node, previous) {
        if (__classPrivateFieldGet(node, _parent)) {
            throw TypeError(`Input node was already attached.`);
        }
        else {
            __classPrivateFieldSet(node, _parent, this);
            if (!__classPrivateFieldGet(node, _ready)) {
                node.construct();
            }
            return node;
        }
    }
    /**
     * Recycle the node using all the children and attributes from the specified node.
     * @param node Node instance.
     * @returns Returns the self instance.
     * @throws Throws an error when the type of the specified node is different.
     */
    recycle(node) {
        if (__classPrivateFieldGet(this, _type) !== node.type) {
            throw new TypeError(`Input node must have the same type.`);
        }
        else if (__classPrivateFieldGet(this, _type) === 0 /* Fragment */) {
            const nodes = getNodes(node.attachment.render());
            __classPrivateFieldSet(this, _nodes, Object.freeze(recycleNodes(this, __classPrivateFieldGet(this, _nodes), nodes)));
        }
        else {
            const newAttributes = {};
            const useAttributes = recycleAttributes(__classPrivateFieldGet(this, _attributes), node.attributes, newAttributes);
            if (useAttributes) {
                this.refresh(newAttributes);
            }
            if (__classPrivateFieldGet(this, _type) === 1 /* Component */) {
                const newChildren = [];
                const useChildren = recycleChildren(__classPrivateFieldGet(this, _children), node.children, newChildren);
                if (useChildren) {
                    this.reassign(newChildren);
                }
                if (useAttributes || useChildren) {
                    const nodes = getNodes(__classPrivateFieldGet(this, _attachment).render());
                    __classPrivateFieldSet(this, _nodes, Object.freeze(recycleNodes(this, __classPrivateFieldGet(this, _nodes), nodes)));
                }
            }
            else {
                const nodes = recycleNodes(this, __classPrivateFieldGet(this, _nodes), node.children);
                __classPrivateFieldSet(this, _nodes, Object.freeze(nodes));
            }
        }
        return this;
    }
    /**
     * Remove the specified child node.
     * @param node Node instance.
     * @returns Returns the child node.
     * @throws Throws an error when the specified node has no parent or belongs to another parent.
     */
    remove(node) {
        if (!__classPrivateFieldGet(node, _parent)) {
            throw new TypeError(`Input node was already detached.`);
        }
        else if (__classPrivateFieldGet(node, _parent) !== this) {
            throw new TypeError(`Input node belongs to another parent node.`);
        }
        else {
            __classPrivateFieldSet(node, _parent, null);
            if (__classPrivateFieldGet(node, _ready)) {
                node.destruct();
            }
        }
        return node;
    }
    /**
     * Destruct the node.
     * @throws Throws an error when the node is already destroyed.
     */
    destruct() {
        if (!__classPrivateFieldGet(this, _ready)) {
            throw new TypeError(`The node was already destroyed.`);
        }
        else {
            __classPrivateFieldSet(this, _ready, false);
            if (__classPrivateFieldGet(this, _type) === 1 /* Component */) {
                __classPrivateFieldGet(this, _attachment).destruct();
            }
            for (const current of __classPrivateFieldGet(this, _nodes)) {
                this.remove(current);
            }
        }
    }
    /**
     * Reassign the node children.
     * @param children New children.
     */
    reassign(children) {
        if (__classPrivateFieldGet(this, _children) !== children) {
            __classPrivateFieldSet(this, _children, Object.freeze(children));
        }
        if (__classPrivateFieldGet(this, _type) === 1 /* Component */) {
            __classPrivateFieldGet(this, _attachment).reassign();
        }
    }
    /**
     * Refresh the node attributes.
     * @param attributes New attributes.
     */
    refresh(attributes) {
        if (__classPrivateFieldGet(this, _attributes) !== attributes) {
            __classPrivateFieldSet(this, _attributes, Objects.freeze({ ...__classPrivateFieldGet(this, _attributes), ...attributes }));
        }
        if (__classPrivateFieldGet(this, _type) === 1 /* Component */) {
            __classPrivateFieldGet(this, _attachment).refresh();
        }
    }
    /**
     * Update the node tree.
     */
    update() {
        if (__classPrivateFieldGet(this, _type) === 0 /* Fragment */ || __classPrivateFieldGet(this, _type) === 1 /* Component */) {
            const nodes = getNodes(__classPrivateFieldGet(this, _attachment).render());
            __classPrivateFieldSet(this, _nodes, Object.freeze(recycleNodes(this, __classPrivateFieldGet(this, _nodes), nodes)));
        }
        else {
            for (const current of __classPrivateFieldGet(this, _nodes)) {
                current.update();
            }
        }
    }
}
exports.Node = Node;
_type = new WeakMap(), _ready = new WeakMap(), _parent = new WeakMap(), _children = new WeakMap(), _attributes = new WeakMap(), _attachment = new WeakMap(), _nodes = new WeakMap(), _reference = new WeakMap();
//# sourceMappingURL=node.js.map