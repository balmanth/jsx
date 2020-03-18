/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
import { Attachment } from './attachment';
/**
 * Element constructor.
 */
export declare type Constructor = keyof JSX.IntrinsicElements;
/**
 * Element attributes.
 */
export declare type Attributes = JSX.ElementClassAttributes;
/**
 * Element attachment.
 */
export declare class Element<T extends Attributes = any> extends Attachment<T> {
    #private;
    /**
     * Constructor.
     * @param name Element name.
     */
    constructor(name: string);
    /**
     * Get element name.
     */
    get name(): string;
}
