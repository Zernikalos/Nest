import {MrVector4} from "./MrVector4";

describe('MrVector4', () => {

    let v;

    beforeEach(() => {
        v = new MrVector4();
    });

    test('bootstrap', () => {
        expect(v.w).toBe(0);
        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
        expect(v.z).toBe(0);
    });
});
