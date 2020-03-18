/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
import type { Node } from '../node';
import { Attachment } from './attachment';
/**
 * Fragment constructor.
 */
export declare type Constructor<T> = new () => Fragment<T>;
/**
 * Fragment attributes.
 */
export declare type Attributes = JSX.ElementClassAttributes;
/**
 * Fragment attachment.
 */
export declare class Fragment<T extends Attributes = any> extends Attachment<T> {
    /**
     * Render contents.
     */
    render(): Readonly<Node[]>;
}
