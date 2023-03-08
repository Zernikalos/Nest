
export interface FileFormats {
    label: string
    extensions: string[]
}

export function defaultFileExtensionMatcher(formats: FileFormats[], filename: string): number {
    const extension = getExtension(filename)
    for (let i = 0; i < formats.length; i++) {
        if (formats[i].extensions.indexOf(extension) >= 0) {
            return i
        }
    }
    return -1
}

function getExtension(filename: string) {
    return filename.split('.').pop() ?? ''
}
