import type { Node } from '../node';
/**
 * Attachment child types.
 */
export declare type Child = JSX.ElementClassChild;
/**
 * Attachment attributes.
 */
export declare type Attributes = JSX.ElementClassAttributes;
/**
 * Attachment base.
 */
export declare abstract class Attachment<T extends Attributes = any> {
    /**
     * Get children.
     */
    get children(): Readonly<Node[]>;
    /**
     * Get attributes.
     */
    get attributes(): Readonly<T>;
    /**
     * Render contents.
     * @throws Throws an error when the method wasn't overwritten.
     */
    render(): any;
}
