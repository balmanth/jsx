/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
import { Attachment } from './attachment';
/**
 * Text constructor.
 */
export declare type Constructor<T> = new () => Text<T>;
/**
 * Text attributes.
 */
export declare type Attributes = JSX.ElementClassAttributes;
/**
 * Text attachment.
 */
export declare class Text<T extends Attributes = any> extends Attachment<T> {
    #private;
    /**
     * Constructor.
     * @param content Text content.
     */
    constructor(content: string);
    /**
     * Get text content.
     */
    get content(): string;
}
