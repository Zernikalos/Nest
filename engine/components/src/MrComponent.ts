import {MrRenderingContext} from "./MrRenderingContext";

/**
 * Base class for components
 */
export abstract class MrComponent {

    protected constructor(public readonly ctx: MrRenderingContext) {
    }

    public abstract initialize(compData?: unknown): void;

    public abstract render(compData?: unknown): void

}
