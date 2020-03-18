/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
declare namespace JSX {
  /**
   * Element class, child types.
   */
  type ElementClassChild = undefined | null | boolean | number | string | Element;

  /**
   * Setup the element children attribute.
   * @see https://www.typescriptlang.org/docs/handbook/jsx.html#children-type-checking
   */
  interface ElementChildrenAttribute {
    children: ElementClassChild;
  }
}
