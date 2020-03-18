/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
declare namespace JSX {
  /**
   * Element class, constructor type.
   */
  type ElementClassConstructor<T extends ElementClassAttributes> = new () => ElementClass<T>;

  /**
   * Element class, state type.
   */
  type ElementClassState = {};

  /**
   * Element class.
   * @see https://www.typescriptlang.org/docs/handbook/jsx.html#class-component
   */
  interface ElementClass<T extends ElementClassAttributes> {
    /**
     * Element attributes.
     */
    readonly attributes: T | ElementClassAttributes;

    /**
     * Element children.
     */
    readonly children: readonly Element[];

    /**
     * Element renderer.
     * @returns Returns the render result.
     */
    render(): JSX.Element | Readonly<JSX.Element[]>;
  }
}
