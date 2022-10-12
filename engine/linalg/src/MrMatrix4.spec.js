import {MrMatrix4} from "./MrMatrix4";

describe('MrMatrix4', () => {

    test('lookAt', () => {
        const m = new MrMatrix4();
        MrMatrix4.lookAt(m, {x: 0, y: 0, z: 6}, {x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0});

        expect(m.values).toStrictEqual([1, 0, -0, 0, -0, 1, -0, 0, 0, 0, 1, 0, 0, 0, -6, 1]);
    });

    test('Invertible matrix', () => {
        const m = new MrMatrix4([1, 0, 2, 2, 0, 2, 1, 0, 0, 1, 0, 1, 1, 2, 1, 4]);
        const result = new MrMatrix4();

        MrMatrix4.invert(result, m);

        expect(result.values).toStrictEqual([-2, 1, -8, 3, -1/2, 1/2, -1, 1/2, 1, 0, 2, -1, 1/2, -1/2, 2, -1/2]);
    });

    test('Mult matrix', () => {
        const m1 = new MrMatrix4([1, 0, 2, 2, 0, 2, 1, 0, 0, 1, 0, 1, 1, 2, 1, 4]);
        const m2 = new MrMatrix4();

        MrMatrix4.invert(m2, m1);

        const result = new MrMatrix4();
        MrMatrix4.mult(result, m1, m2);

        expect(result.values).toStrictEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    });
});
