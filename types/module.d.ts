/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
/// <reference path="core/jsx.d.ts" />
import * as Attachments from './attachments/attachment';
import Attachment = Attachments.Attachment;
import AttachmentAttributes = Attachments.Attributes;
import AttachmentChild = Attachments.Child;
export { Attachment, AttachmentAttributes, AttachmentChild };
import * as Fragments from './attachments/fragment';
import Fragment = Fragments.Fragment;
import FragmentAttributes = Fragments.Attributes;
import FragmentConstructor = Fragments.Constructor;
export { Fragment, FragmentAttributes, FragmentConstructor };
import * as Components from './attachments/component';
import Component = Components.Component;
import ComponentState = Components.State;
import ComponentAttributes = Components.Attributes;
import ComponentConstructor = Components.Constructor;
export { Component, ComponentState, ComponentAttributes, ComponentConstructor };
import * as Elements from './attachments/element';
import Element = Elements.Element;
import ElementAttributes = Elements.Attributes;
import ElementConstructor = Elements.Constructor;
export { Element, ElementAttributes, ElementConstructor };
import * as Texts from './attachments/text';
import Text = Texts.Text;
import TextAttributes = Texts.Attributes;
import TextConstructor = Texts.Constructor;
export { Text, TextAttributes, TextConstructor };
import * as Nodes from './node';
import Node = Nodes.Node;
import NodeAttributes = Nodes.Attributes;
import NodeTypes = Nodes.Types;
export { Node, NodeAttributes, NodeTypes };
/**
 * Alias for supported elements.
 */
export declare type Types = keyof ElementConstructor | FragmentConstructor<any> | ComponentConstructor<any>;
/**
 * Alias for picking the element attributes.
 */
export declare type PickElementAttributes<T> = T extends keyof ElementConstructor ? ElementConstructor[T] : never;
/**
 * Alias for picking the component attributes.
 */
export declare type PickComponentAttributes<T> = T extends ComponentConstructor<infer U> ? U : never;
/**
 * Alias for picking the attributes.
 */
export declare type PickAttributes<T> = PickElementAttributes<T> | PickComponentAttributes<T>;
/**
 * Class models.
 */
export declare type Models<T extends JSX.ElementClassAttributes = any> = {
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
 * Create a new node from the specified markup.
 * @param models Class models.
 * @param source Markup source.
 * @param attributes Initial attributes.
 * @param children Initial children.
 * @returns Returns the node instance.
 * @throws Throws an error when the markup source isn't supported.
 */
export declare function create<T extends Types>(models: Models, source: T, attributes: Readonly<PickAttributes<T>> | null, children: Readonly<AttachmentChild[]>): Node<PickAttributes<T>>;
/**
 * Get the JSON representation of the specified node.
 * @param node Node instance.
 * @returns Returns the JSON representation.
 * @throws Throws an error when the given node isn't valid or supported.
 */
export declare function json(node: JSX.Element): object;
