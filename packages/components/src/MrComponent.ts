import {MrRenderingContext} from "./MrRenderingContext";

export abstract class MrComponent {

    protected constructor(
        protected readonly ctx: MrRenderingContext,
        protected readonly data: any = {}) {
        // Context should be passed in
    }

    public initialize(_compData?: any): void {
    }

    public render(_compData?: any): void {
    }

}
