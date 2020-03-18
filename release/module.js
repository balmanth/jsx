"use strict";
/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
/// <reference path="../types/core/jsx.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
// Attachments.
const Attachments = require("./attachments/attachment");
var Attachment = Attachments.Attachment;
exports.Attachment = Attachment;
// Fragments.
const Fragments = require("./attachments/fragment");
var Fragment = Fragments.Fragment;
exports.Fragment = Fragment;
// Components.
const Components = require("./attachments/component");
var Component = Components.Component;
exports.Component = Component;
// Elements.
const Elements = require("./attachments/element");
var Element = Elements.Element;
exports.Element = Element;
// Text.
const Texts = require("./attachments/text");
var Text = Texts.Text;
exports.Text = Text;
// Nodes.
const Nodes = require("./node");
var Node = Nodes.Node;
exports.Node = Node;
/**
 * Create a new node from the specified attachment and set all needed properties.
 * @param models Class models.
 * @param attachment Attachment instance.
 * @param attributes Attachment attributes.
 * @param children Attachment children.
 * @returns Returns the node instance.
 */
function getNode(models, attachment, attributes, children) {
    const node = new models.Node(attachment, attributes, children);
    Object.defineProperties(attachment, {
        children: {
            get: () => node.children
        },
        attributes: {
            get: () => node.attributes
        }
    });
    return node;
}
/**
 * Get a new list of nodes from the specified children.
 * @param models Class models.
 * @param children Children list.
 * @returns Returns the node list.
 * @throws Throws an error when there are unsupported children.
 */
function getNodes(models, children) {
    const nodes = [];
    for (const child of children) {
        if (child !== void 0 && child !== null) {
            if (child instanceof Node) {
                nodes.push(child);
            }
            else if (child instanceof Array) {
                nodes.push(...getNodes(models, child));
            }
            else {
                if (child instanceof Object && !(child.toString instanceof Function)) {
                    throw new TypeError(`Child type '${child}' is unsupported.`);
                }
                else {
                    const attachment = new models.Text(`${child}`);
                    nodes.push(getNode(models, attachment, null, []));
                }
            }
        }
    }
    return nodes;
}
/**
 * Create a new node from the specified markup.
 * @param models Class models.
 * @param source Markup source.
 * @param attributes Initial attributes.
 * @param children Initial children.
 * @returns Returns the node instance.
 * @throws Throws an error when the markup source isn't supported.
 */
function create(models, source, attributes, children) {
    let attachment;
    if (Node.isElementType(source)) {
        attachment = new models.Element(source);
    }
    else {
        if (!Node.isComponentType(source) && !Node.isFragmentType(source)) {
            throw new TypeError(`Markup source '${source}' isn't supported.`);
        }
        else {
            attachment = new source();
        }
    }
    const nodes = getNodes(models, children);
    return getNode(models, attachment, attributes, nodes);
}
exports.create = create;
/**
 * Get the JSON list containing all nodes from the specified list.
 * @param nodes Node list.
 * @returns Returns the JSON list.
 */
function jsonArray(nodes) {
    const list = [];
    for (const node of nodes) {
        list.push(json(node));
    }
    return list;
}
/**
 * Get the JSON representation of the specified node.
 * @param node Node instance.
 * @returns Returns the JSON representation.
 * @throws Throws an error when the given node isn't valid or supported.
 */
function json(node) {
    if (!(node instanceof Node)) {
        throw new TypeError(`Node instance isn't valid.`);
    }
    else {
        const attachment = node.attachment;
        if (attachment instanceof Component) {
            const prototype = Reflect.getPrototypeOf(attachment);
            const constructor = prototype.constructor;
            return {
                type: node.type,
                name: constructor.name,
                state: attachment.state,
                attributes: { ...node.attributes },
                children: jsonArray(node.children)
            };
        }
        else if (attachment instanceof Element) {
            return {
                type: node.type,
                name: attachment.name,
                attributes: { ...node.attributes },
                children: jsonArray(node.children)
            };
        }
        else if (attachment instanceof Text) {
            return {
                type: node.type,
                content: attachment.content
            };
        }
        else {
            throw new TypeError(`Node type '${node.type}' isn't supported.`);
        }
    }
}
exports.json = json;
//# sourceMappingURL=module.js.map