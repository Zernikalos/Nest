import {ANAME_NORMAL, ANAME_POSITION, ANAME_UV} from "../constants";

export const ANAME_SHADER_POSITION = "position"
export const ANAME_SHADER_NORMAL = "normal"
export const ANAME_SHADER_UV = "uv"

export const UNAME_SHADER_MVP_MATRIX = "mvpMatrix"

export const ANAME_SHADER_MAP: {[key: string]: string} = {
    [ANAME_POSITION]: ANAME_SHADER_POSITION,
    [ANAME_NORMAL]: ANAME_SHADER_NORMAL,
    [ANAME_UV]: ANAME_SHADER_UV
}
