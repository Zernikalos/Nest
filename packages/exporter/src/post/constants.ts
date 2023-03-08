import {ANAME_COLOR, ANAME_NORMAL, ANAME_POSITION, ANAME_UV} from "../constants";

export const ANAME_SHADER_POSITION = "position"
export const ANAME_SHADER_NORMAL = "normal"
export const ANAME_SHADER_UV = "uv"
export const ANAME_IN_VERT_SHADER_COLOR = "color"
export const ANAME_OUT_FRAG_SHADER_COLOR = "outFragColor"
export const ANAME_IN_FRAG_SHADER_COLOR = "fragColor"
export const ANAME_OUT_VERT_SHADER_COLOR = ANAME_IN_FRAG_SHADER_COLOR


export const UNAME_SHADER_MVP_MATRIX = "mvpMatrix"

export const ANAME_SHADER_MAP: {[key: string]: string} = {
    [ANAME_POSITION]: ANAME_SHADER_POSITION,
    [ANAME_NORMAL]: ANAME_SHADER_NORMAL,
    [ANAME_UV]: ANAME_SHADER_UV,
    [ANAME_COLOR]: ANAME_IN_VERT_SHADER_COLOR
}
