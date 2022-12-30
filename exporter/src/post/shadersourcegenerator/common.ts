export const BR = ""
export const T = "\\t"
export const HEADER = `#version 300 es`
export const OPEN_MAIN = `void main() {`
export const CLOSE_MAIN = `}`

export const ANAME_POSITION = `position`
export const ANAME_NORMAL = "normal"
export const ANAME_UV = "uv"

export const UNAME_MVP_MATRIX = "mvpMatrix"

export function l(s?: string) {
    return `${s ?? ''}\n`
}

export function t(s?: string) {
    return `\\t${s ?? ''}`
}
