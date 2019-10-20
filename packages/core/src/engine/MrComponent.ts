import { MrRenderingContext } from "../ui/MrRenderingContext";

export abstract class MrComponent {

    protected abstract data: MrComponentData;
    protected abstract view: MrComponentView;

    constructor(public readonly name: string, _ctx: MrRenderingContext) {
        // Context should be passed in
    }

}

export abstract class MrComponentData {

}

export abstract class MrComponentView {

    constructor(protected ctx: MrRenderingContext, protected data: MrComponentData) {

    }

}
