/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
import * as Objects from '@balmanth/objects';

import type { Node } from '../node';

/**
 * Attachment child types.
 */
export type Child = JSX.ElementClassChild;

/**
 * Attachment attributes.
 */
export type Attributes = JSX.ElementClassAttributes;

/**
 * Attachment base.
 */
export abstract class Attachment<T extends Attributes = any> {
  /**
   * Get children.
   */
  get children(): Readonly<Node[]> {
    return Objects.emptyArray;
  }

  /**
   * Get attributes.
   */
  get attributes(): Readonly<T> {
    return Objects.emptyObject;
  }

  /**
   * Render contents.
   * @throws Throws an error when the method wasn't overwritten.
   */
  render(): any {
    throw new TypeError(`Render method doesn't implemented.`);
  }
}
