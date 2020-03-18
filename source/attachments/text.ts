/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
import { Attachment } from './attachment';

/**
 * Text constructor.
 */
export type Constructor<T> = new () => Text<T>;

/**
 * Text attributes.
 */
export type Attributes = JSX.ElementClassAttributes;

/**
 * Text attachment.
 */
export class Text<T extends Attributes = any> extends Attachment<T> {
  /**
   * Text content.
   */
  #content: string;

  /**
   * Constructor.
   * @param content Text content.
   */
  constructor(content: string) {
    super();
    this.#content = content;
  }

  /**
   * Get text content.
   */
  get content(): string {
    return this.#content;
  }
}
