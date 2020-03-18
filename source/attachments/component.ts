/**!
 * Copyright (C) 2020 Silas B. Domingos
 * @license MIT
 */
import * as Objects from '@balmanth/objects';

import { Attachment } from './attachment';

/**
 * Component constructor.
 */
export type Constructor<T> = new () => Component<T>;

/**
 * Component state.
 */
export type State = JSX.ElementClassState;

/**
 * Component attributes.
 */
export type Attributes = JSX.ElementClassAttributes;

/**
 * Component attachment.
 */
export class Component<T extends Attributes = any, U extends State = any> extends Attachment<T>
  implements JSX.ElementClass<T> {
  /**
   * Component state.
   */
  #state = Objects.emptyObject;

  /**
   * Get state.
   */
  get state(): Readonly<U> {
    return this.#state;
  }

  /**
   * Construct the component.
   */
  construct(): void {}

  /**
   * Refresh the component attributes.
   */
  refresh(): void {}

  /**
   * Reassign the component children.
   */
  reassign(): void {}

  /**
   * Destruct the component.
   */
  destruct(): void {}

  /**
   * Update the current component state.
   * @param state New state.
   * @param recycle Determines whether or not the component will be recycled. (Default is true)
   */
  update(state: Partial<U>, recycle?: boolean): void {
    this.#state = Object.freeze({ ...this.#state, ...state });
  }
}
