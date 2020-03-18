/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
import { Attachment } from './attachment';

/**
 * Element constructor.
 */
export type Constructor = keyof JSX.IntrinsicElements;

/**
 * Element attributes.
 */
export type Attributes = JSX.ElementClassAttributes;

/**
 * Element attachment.
 */
export class Element<T extends Attributes = any> extends Attachment<T> {
  /**
   * Element name.
   */
  #name: string;

  /**
   * Constructor.
   * @param name Element name.
   */
  constructor(name: string) {
    super();
    this.#name = name;
  }

  /**
   * Get element name.
   */
  get name(): string {
    return this.#name;
  }
}
