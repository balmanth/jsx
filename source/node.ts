/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
import * as Differs from '@balmanth/differs';
import * as Objects from '@balmanth/objects';

// General imports.
import { Attachment } from './attachments/attachment';
import { Component, Constructor as ComponentConstructor } from './attachments/component';
import { Fragment, Constructor as FragmentConstructor } from './attachments/fragment';
import { Element, Constructor as ElementConstructor } from './attachments/element';
import { Text } from './attachments/text';

/**
 * Node types.
 */
export const enum Types {
  Fragment,
  Component,
  Element,
  Text
}

/**
 * Node attributes.
 */
export type Attributes = {
  /**
   * Generic attributes.
   */
  [name: string]: any;
};

/**
 * Determines whether both nodes are equal or not.
 * @param cache Cache of equality.
 * @param oldNode Old node.
 * @param newNode New node.
 * @returns Returns true when both nodes are equal, false otherwise.
 */
function areEqualNodes(cache: WeakMap<Node, Node>, oldNode: Node, newNode: Node): boolean {
  if (oldNode.type === newNode.type) {
    switch (oldNode.type) {
      case Types.Fragment:
      case Types.Component:
        if (Objects.areEqualTypes(oldNode.attachment, newNode.attachment)) {
          return cache.set(oldNode, newNode), true;
        }
        break;
      case Types.Element:
        if ((<Element>oldNode.attachment).name === (<Element>newNode.attachment).name) {
          return cache.set(oldNode, newNode), true;
        }
        break;
      case Types.Text:
        if ((<Text>oldNode.attachment).content === (<Text>newNode.attachment).content) {
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
function recycleNodes(parent: Node, current: Readonly<Node[]>, proposal: Readonly<Node[]>): Node[] {
  const cache = new WeakMap<Node, Node>();
  const compare = areEqualNodes.bind(null, cache);
  const table = Differs.Core.getTable(current, proposal, compare);
  const changes = Differs.Core.getChanges(current, proposal, compare, table);
  const result = [];
  let previous;
  for (const change of changes) {
    switch (change.action) {
      case Differs.Action.Insert:
        for (const current of change.values) {
          result.push(parent.insert(current, previous));
          previous = current;
        }
        break;
      case Differs.Action.Keep:
        for (const current of change.values) {
          const newer = cache.get(current)!;
          result.push(current.recycle(newer));
          previous = current;
        }
        break;
      case Differs.Action.Remove:
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
function recycleChildren(current: Readonly<Node[]>, proposal: Readonly<Node[]>, result: Node[]): boolean {
  const cache = new WeakMap<Node, Node>();
  const compare = areEqualNodes.bind(null, cache);
  const table = Differs.Core.getTable(current, proposal, compare);
  const changes = Differs.Core.getChanges(current, proposal, compare, table);
  let counter = 0;
  for (const change of changes) {
    switch (change.action) {
      case Differs.Action.Insert:
        result.push(...change.values);
        counter++;
        break;
      case Differs.Action.Keep:
        result.push(...change.values);
        break;
      case Differs.Action.Remove:
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
function recycleAttributes<T extends Attributes>(current: T, proposal: T, result: Partial<T>): boolean {
  const oldNames = Object.keys(current);
  const newNames = Object.keys(proposal);
  const table = Differs.Core.getTable(oldNames, newNames, Objects.areEqual);
  const changes = Differs.Core.getChanges(oldNames, newNames, Objects.areEqual, table);
  let counter = 0;
  for (const change of changes) {
    for (const name of <(keyof T)[]>change.values) {
      const newValue = proposal[name];
      switch (change.action) {
        case Differs.Action.Insert:
          result[name] = newValue;
          counter++;
          break;
        case Differs.Action.Keep:
          const oldValue = current[name];
          if (oldValue !== newValue) {
            result[name] = newValue;
            counter++;
          }
          break;
        case Differs.Action.Remove:
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
function getNodes(input: Node | Node[]): Readonly<Node[]> {
  if (input === void 0 || input === null) {
    return Objects.emptyArray;
  } else {
    const list = [];
    if (input instanceof Array) {
      for (const current of input) {
        list.push(...getNodes(current));
      }
    } else {
      if (!(input instanceof Node)) {
        throw new TypeError(`Input value isn't a valid instanceof of Node.`);
      } else {
        list.push(input);
      }
    }
    return list;
  }
}

/**
 * Node class.
 */
export class Node<T extends Attributes = any> implements JSX.Element {
  /**
   * Node type.
   */
  #type: Types;

  /**
   * Determines whether or not the node was constructed.
   */
  #ready: boolean;

  /**
   * Node parent.
   */
  #parent: Node | null;

  /**
   * Attachment children.
   */
  #children: Readonly<Node[]>;

  /**
   * Attachment attributes.
   */
  #attributes: Readonly<T>;

  /**
   * Node attachment.
   */
  #attachment: Attachment<T>;

  /**
   * Node children.
   */
  #nodes: Readonly<Node[]>;

  /**
   * Node reference.
   */
  #reference: any;

  /**
   * Determines whether or not the specified value is a component type.
   * @param value Value to check.
   * @returns Returns true when the value is a component type, false otherwise.
   */
  static isComponentType<T>(value: unknown): value is ComponentConstructor<T> {
    return Objects.isDerivedFrom(value, Component);
  }

  /**
   * Determines whether or not the specified value is a fragment type.
   * @param value Value to check.
   * @returns Returns true when the value is a component type, false otherwise.
   */
  static isFragmentType<T>(value: unknown): value is FragmentConstructor<T> {
    return Objects.isDerivedFrom(value, Fragment);
  }

  /**
   * Determines whether or not the specified value is an element type.
   * @param value Value to check.
   * @returns Returns true when the value is an element type, false otherwise.
   */
  static isElementType(value: unknown): value is ElementConstructor {
    return typeof value === 'string';
  }

  /**
   * Constructor.
   * @param attachment Attachment instance.
   * @param attributes Attachment attributes.
   * @param children Attachment children
   * @throws Throws an error when the specified attachment isn't supported.
   */
  constructor(attachment: Attachment<T>, attributes: T | null, children: Readonly<Node[]>) {
    this.#ready = false;
    this.#parent = null;
    this.#children = Object.freeze(children);
    this.#attributes = <T>Objects.freeze({ ...attributes });
    this.#attachment = attachment;
    if (attachment instanceof Fragment) {
      this.#type = Types.Fragment;
      this.#nodes = Object.freeze<Node>([]);
    } else if (attachment instanceof Component) {
      this.#type = Types.Component;
      this.#nodes = Object.freeze<Node>([]);
    } else if (attachment instanceof Element) {
      this.#type = Types.Element;
      this.#nodes = this.#children;
    } else if (attachment instanceof Text) {
      this.#type = Types.Text;
      this.#nodes = this.#children;
    } else {
      throw TypeError(`Unsupported attachment instance.`);
    }
  }

  /**
   * Node type.
   */
  get type(): Types {
    return this.#type;
  }

  /**
   * Determines whether the node was constructed or not.
   */
  get ready(): boolean {
    return this.#ready;
  }

  /**
   * Node parent.
   */
  get parent(): Node | null {
    return this.#parent;
  }

  /**
   * Attachment children.
   */
  get children(): Readonly<Node[]> {
    return this.#children;
  }

  /**
   * Attachment attributes.
   */
  get attributes(): Readonly<T> {
    return this.#attributes;
  }

  /**
   * Node attachment.
   */
  get attachment(): Attachment<T> {
    return this.#attachment;
  }

  /**
   * Node children.
   */
  get nodes(): Readonly<Node[]> {
    return this.#nodes;
  }

  /**
   * Node reference.
   */
  get reference(): any {
    return this.#reference;
  }

  /**
   * Construct the node.
   * @throws Throws an error when the node is already constructed.
   */
  construct(): void {
    if (this.#ready) {
      throw new TypeError(`The node was already constructed.`);
    } else {
      this.#ready = true;
      if (this.#type === Types.Fragment) {
        const nodes = getNodes(this.#attachment.render());
        this.#nodes = Object.freeze(nodes);
      } else if (this.#type === Types.Component) {
        (<Component<T>>this.#attachment).construct();
        const nodes = getNodes(this.#attachment.render());
        this.#nodes = Object.freeze(nodes);
      } else {
        const reference = this.#attachment.render();
        this.#reference = reference;
      }
      let previous;
      for (const current of this.#nodes) {
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
  insert<T>(node: Node<T>, previous?: Node): Node<T> {
    if (node.#parent) {
      throw TypeError(`Input node was already attached.`);
    } else {
      node.#parent = this;
      if (!node.#ready) {
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
  recycle(node: Node<T>): Node<T> {
    if (this.#type !== node.type) {
      throw new TypeError(`Input node must have the same type.`);
    } else if (this.#type === Types.Fragment) {
      const nodes = getNodes(node.attachment.render());
      this.#nodes = Object.freeze(recycleNodes(this, this.#nodes, nodes));
    } else {
      const newAttributes = {};
      const useAttributes = recycleAttributes(this.#attributes, node.attributes, newAttributes);
      if (useAttributes) {
        this.refresh(newAttributes);
      }
      if (this.#type === Types.Component) {
        const newChildren = <Node[]>[];
        const useChildren = recycleChildren(this.#children, node.children, newChildren);
        if (useChildren) {
          this.reassign(newChildren);
        }
        if (useAttributes || useChildren) {
          const nodes = getNodes(this.#attachment.render());
          this.#nodes = Object.freeze(recycleNodes(this, this.#nodes, nodes));
        }
      } else {
        const nodes = recycleNodes(this, this.#nodes, node.children);
        this.#nodes = Object.freeze(nodes);
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
  remove<T>(node: Node<T>): Node<T> {
    if (!node.#parent) {
      throw new TypeError(`Input node was already detached.`);
    } else if (node.#parent !== this) {
      throw new TypeError(`Input node belongs to another parent node.`);
    } else {
      node.#parent = null;
      if (node.#ready) {
        node.destruct();
      }
    }
    return node;
  }

  /**
   * Destruct the node.
   * @throws Throws an error when the node is already destroyed.
   */
  destruct(): void {
    if (!this.#ready) {
      throw new TypeError(`The node was already destroyed.`);
    } else {
      this.#ready = false;
      if (this.#type === Types.Component) {
        (<Component<T>>this.#attachment).destruct();
      }
      for (const current of this.#nodes) {
        this.remove(current);
      }
    }
  }

  /**
   * Reassign the node children.
   * @param children New children.
   */
  reassign(children: Readonly<Node[]>): void {
    if (this.#children !== children) {
      this.#children = Object.freeze(children);
    }
    if (this.#type === Types.Component) {
      (<Component<any>>this.#attachment).reassign();
    }
  }

  /**
   * Refresh the node attributes.
   * @param attributes New attributes.
   */
  refresh(attributes: Partial<T>): void {
    if (this.#attributes !== attributes) {
      this.#attributes = Objects.freeze({ ...this.#attributes, ...attributes });
    }
    if (this.#type === Types.Component) {
      (<Component<any>>this.#attachment).refresh();
    }
  }

  /**
   * Update the node tree.
   */
  update(): void {
    if (this.#type === Types.Fragment || this.#type === Types.Component) {
      const nodes = getNodes(this.#attachment.render());
      this.#nodes = Object.freeze(recycleNodes(this, this.#nodes, nodes));
    } else {
      for (const current of this.#nodes) {
        current.update();
      }
    }
  }
}
