const ZOBJECT_SCHEME = 'zobject://';

/** Map a scene node id to a document URI (zobject://id). */
export function nodeIdToDocumentUri(nodeId: string): string {
    return `${ZOBJECT_SCHEME}${nodeId}`;
}

/** Extract node id from a zobject:// URI, or null if not a zobject URI. */
export function documentUriToNodeId(uri: string): string | null {
    return uri.startsWith(ZOBJECT_SCHEME) ? uri.slice(ZOBJECT_SCHEME.length) : null;
}

export function isZObjectDocumentUri(uri: string): boolean {
    return uri.startsWith(ZOBJECT_SCHEME);
}
