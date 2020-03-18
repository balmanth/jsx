/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
import type { Node } from '../node';

import { Attachment } from './attachment';

/**
 * Fragment constructor.
 */
export type Constructor<T> = new () => Fragment<T>;

/**
 * Fragment attributes.
 */
export type Attributes = JSX.ElementClassAttributes;

/**
 * Fragment attachment.
 */
export class Fragment<T extends Attributes = any> extends Attachment<T> {
  /**
   * Render contents.
   */
  render(): Readonly<Node[]> {
    return this.children;
  }
}
