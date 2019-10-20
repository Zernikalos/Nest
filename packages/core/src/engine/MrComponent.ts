import { MrRenderingContext } from "../ui/MrRenderingContext";

export abstract class MrComponent {

    protected abstract data: MrComponentData;
    protected abstract view: MrComponentView;

    constructor(public readonly name: string, protected readonly ctx: MrRenderingContext) {
        // Context should be passed in
    }

    public initialize(): void {
        this.view.initialize(this.ctx, this.data);
    }

    public bind(): void {
        this.view.bind(this.ctx, this.data);
    }

}

export abstract class MrComponentData {

}

export abstract class MrComponentView {

    public abstract initialize(ctx: MrRenderingContext, data: MrComponentData): void;

    public abstract bind(ctx: MrRenderingContext, data: MrComponentData): void;

}
