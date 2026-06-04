/** Merges canonical state with derived snapshot fields. */
export function withDerived<S extends object, D extends object>(
    state: S,
    derived: (state: S) => D
): S & D {
    return { ...state, ...derived(state) };
}
