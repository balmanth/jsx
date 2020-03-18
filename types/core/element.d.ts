/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
declare namespace JSX {
  /**
   * Element.
   */
  interface Element {
    /**
     * Element type.
     */
    readonly type: number;
    /**
     * Element attachment.
     */
    readonly attachment: any;
    /**
     * Element children.
     */
    readonly children: readonly Element[];
    /**
     * Element reference.
     */
    readonly reference: any;
  }
}
