import { Attachment } from './attachment';
/**
 * Component constructor.
 */
export declare type Constructor<T> = new () => Component<T>;
/**
 * Component state.
 */
export declare type State = JSX.ElementClassState;
/**
 * Component attributes.
 */
export declare type Attributes = JSX.ElementClassAttributes;
/**
 * Component attachment.
 */
export declare class Component<T extends Attributes = any, U extends State = any> extends Attachment<T> implements JSX.ElementClass<T> {
    #private;
    /**
     * Get state.
     */
    get state(): Readonly<U>;
    /**
     * Construct the component.
     */
    construct(): void;
    /**
     * Refresh the component attributes.
     */
    refresh(): void;
    /**
     * Reassign the component children.
     */
    reassign(): void;
    /**
     * Destruct the component.
     */
    destruct(): void;
    /**
     * Update the current component state.
     * @param state New state.
     * @param recycle Determines whether or not the component will be recycled. (Default is true)
     */
    update(state: Partial<U>, recycle?: boolean): void;
}
