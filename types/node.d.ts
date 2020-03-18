import { Attachment } from './attachments/attachment';
import { Constructor as ComponentConstructor } from './attachments/component';
import { Constructor as FragmentConstructor } from './attachments/fragment';
import { Constructor as ElementConstructor } from './attachments/element';
/**
 * Node types.
 */
export declare const enum Types {
    Fragment = 0,
    Component = 1,
    Element = 2,
    Text = 3
}
/**
 * Node attributes.
 */
export declare type Attributes = {
    /**
     * Generic attributes.
     */
    [name: string]: any;
};
/**
 * Node class.
 */
export declare class Node<T extends Attributes = any> implements JSX.Element {
    #private;
    /**
     * Determines whether or not the specified value is a component type.
     * @param value Value to check.
     * @returns Returns true when the value is a component type, false otherwise.
     */
    static isComponentType<T>(value: unknown): value is ComponentConstructor<T>;
    /**
     * Determines whether or not the specified value is a fragment type.
     * @param value Value to check.
     * @returns Returns true when the value is a component type, false otherwise.
     */
    static isFragmentType<T>(value: unknown): value is FragmentConstructor<T>;
    /**
     * Determines whether or not the specified value is an element type.
     * @param value Value to check.
     * @returns Returns true when the value is an element type, false otherwise.
     */
    static isElementType(value: unknown): value is ElementConstructor;
    /**
     * Constructor.
     * @param attachment Attachment instance.
     * @param attributes Attachment attributes.
     * @param children Attachment children
     * @throws Throws an error when the specified attachment isn't supported.
     */
    constructor(attachment: Attachment<T>, attributes: T | null, children: Readonly<Node[]>);
    /**
     * Node type.
     */
    get type(): Types;
    /**
     * Determines whether the node was constructed or not.
     */
    get ready(): boolean;
    /**
     * Node parent.
     */
    get parent(): Node | null;
    /**
     * Attachment children.
     */
    get children(): Readonly<Node[]>;
    /**
     * Attachment attributes.
     */
    get attributes(): Readonly<T>;
    /**
     * Node attachment.
     */
    get attachment(): Attachment<T>;
    /**
     * Node children.
     */
    get nodes(): Readonly<Node[]>;
    /**
     * Node reference.
     */
    get reference(): any;
    /**
     * Construct the node.
     * @throws Throws an error when the node is already constructed.
     */
    construct(): void;
    /**
     * Insert a child node.
     * @param node Node instance.
     * @param previous Previous node in which child is inserted.
     * @returns Returns the child node.
     * @throws Throws an error when the specified nodes has a parent.
     */
    insert<T>(node: Node<T>, previous?: Node): Node<T>;
    /**
     * Recycle the node using all the children and attributes from the specified node.
     * @param node Node instance.
     * @returns Returns the self instance.
     * @throws Throws an error when the type of the specified node is different.
     */
    recycle(node: Node<T>): Node<T>;
    /**
     * Remove the specified child node.
     * @param node Node instance.
     * @returns Returns the child node.
     * @throws Throws an error when the specified node has no parent or belongs to another parent.
     */
    remove<T>(node: Node<T>): Node<T>;
    /**
     * Destruct the node.
     * @throws Throws an error when the node is already destroyed.
     */
    destruct(): void;
    /**
     * Reassign the node children.
     * @param children New children.
     */
    reassign(children: Readonly<Node[]>): void;
    /**
     * Refresh the node attributes.
     * @param attributes New attributes.
     */
    refresh(attributes: Partial<T>): void;
    /**
     * Update the node tree.
     */
    update(): void;
}
