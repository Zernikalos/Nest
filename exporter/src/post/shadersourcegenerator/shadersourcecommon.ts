export const BR = ""
export const T = "    "
export const HEADER = `#version 300 es`
export const OPEN_MAIN = `void main() {`
export const CLOSE_MAIN = `}`

export function l(s?: string) {
    return `${s ?? ''}\n`
}

export function t(s?: string) {
    return `    ${s ?? ''}`
}
