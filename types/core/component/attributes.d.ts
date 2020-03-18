/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
declare namespace JSX {
  /**
   * Element class, attributes type.
   */
  type ElementClassAttributes = {};

  /**
   * Setup the element attributes property.
   * @see https://www.typescriptlang.org/docs/handbook/jsx.html#attribute-type-checking
   */
  interface ElementAttributesProperty {
    attributes: ElementClassAttributes;
  }
}
