/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
/// <reference path="../types/core/jsx.d.ts" />

// Attachments.
import * as Attachments from './attachments/attachment';
import Attachment = Attachments.Attachment;
import AttachmentAttributes = Attachments.Attributes;
import AttachmentChild = Attachments.Child;
export { Attachment, AttachmentAttributes, AttachmentChild };

// Fragments.
import * as Fragments from './attachments/fragment';
import Fragment = Fragments.Fragment;
import FragmentAttributes = Fragments.Attributes;
import FragmentConstructor = Fragments.Constructor;
export { Fragment, FragmentAttributes, FragmentConstructor };

// Components.
import * as Components from './attachments/component';
import Component = Components.Component;
import ComponentState = Components.State;
import ComponentAttributes = Components.Attributes;
import ComponentConstructor = Components.Constructor;
export { Component, ComponentState, ComponentAttributes, ComponentConstructor };

// Elements.
import * as Elements from './attachments/element';
import Element = Elements.Element;
import ElementAttributes = Elements.Attributes;
import ElementConstructor = Elements.Constructor;
export { Element, ElementAttributes, ElementConstructor };

// Text.
import * as Texts from './attachments/text';
import Text = Texts.Text;
import TextAttributes = Texts.Attributes;
import TextConstructor = Texts.Constructor;
export { Text, TextAttributes, TextConstructor };

// Nodes.
import * as Nodes from './node';
import Node = Nodes.Node;
import NodeAttributes = Nodes.Attributes;
import NodeTypes = Nodes.Types;
export { Node, NodeAttributes, NodeTypes };

/**
 * Alias for supported elements.
 */
export type Types = keyof ElementConstructor | FragmentConstructor<any> | ComponentConstructor<any>;

/**
 * Alias for picking the element attributes.
 */
export type PickElementAttributes<T> = T extends keyof ElementConstructor ? ElementConstructor[T] : never;

/**
 * Alias for picking the component attributes.
 */
export type PickComponentAttributes<T> = T extends ComponentConstructor<infer U> ? U : never;

/**
 * Alias for picking the attributes.
 */
export type PickAttributes<T> = PickElementAttributes<T> | PickComponentAttributes<T>;

/**
 * Class models.
 */
export type Models<T extends JSX.ElementClassAttributes = any> = {
  /**
   * Element attachment class.
   */
  Element: new (name: string) => Element<T>;
  /**
   * Text attachment class.
   */
  Text: new (content: string) => Text<T>;
  /**
   * Node class.
   */
  Node: new (attachment: Attachment<T>, attributes: T, children: Readonly<Node[]>) => Node<T>;
};

/**
 * Create a new node from the specified attachment and set all needed properties.
 * @param models Class models.
 * @param attachment Attachment instance.
 * @param attributes Attachment attributes.
 * @param children Attachment children.
 * @returns Returns the node instance.
 */
function getNode<T>(
  models: Models,
  attachment: Attachment<T>,
  attributes: T | null,
  children: Readonly<Node[]>
): Node<T> {
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
function getNodes(models: Models, children: Readonly<AttachmentChild[]>): Node[] {
  const nodes = [];
  for (const child of children) {
    if (child !== void 0 && child !== null) {
      if (child instanceof Node) {
        nodes.push(child);
      } else if (child instanceof Array) {
        nodes.push(...getNodes(models, child));
      } else {
        if (child instanceof Object && !(child.toString instanceof Function)) {
          throw new TypeError(`Child type '${child}' is unsupported.`);
        } else {
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
export function create<T extends Types>(
  models: Models,
  source: T,
  attributes: Readonly<PickAttributes<T>> | null,
  children: Readonly<AttachmentChild[]>
): Node<PickAttributes<T>> {
  let attachment;
  if (Node.isElementType(source)) {
    attachment = new models.Element(source);
  } else {
    if (!Node.isComponentType(source) && !Node.isFragmentType(source)) {
      throw new TypeError(`Markup source '${source}' isn't supported.`);
    } else {
      attachment = new source();
    }
  }
  const nodes = getNodes(models, children);
  return getNode(models, attachment, attributes, nodes);
}

/**
 * Get the JSON list containing all nodes from the specified list.
 * @param nodes Node list.
 * @returns Returns the JSON list.
 */
function jsonArray(nodes: Readonly<Node[]>): object[] {
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
export function json(node: JSX.Element): object {
  if (!(node instanceof Node)) {
    throw new TypeError(`Node instance isn't valid.`);
  } else {
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
    } else if (attachment instanceof Element) {
      return {
        type: node.type,
        name: attachment.name,
        attributes: { ...node.attributes },
        children: jsonArray(node.children)
      };
    } else if (attachment instanceof Text) {
      return {
        type: node.type,
        content: attachment.content
      };
    } else {
      throw new TypeError(`Node type '${node.type}' isn't supported.`);
    }
  }
}
