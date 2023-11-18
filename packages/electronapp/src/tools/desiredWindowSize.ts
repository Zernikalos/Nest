import {screen} from "electron";
import {head} from "lodash";

export interface WindowSize {
    width: number
    height: number
}

export function fullWindowSize(): WindowSize {
    // Create a window that fills the screen's available work area.
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize
    return {width, height}
}

export function windowSize169(maxScale: number = 0.8): WindowSize {
    const fullSize = fullWindowSize()
    const factor = 16.0/9.0
    //const width = Math.floor(fullSize.width * maxScale)
    //const height = Math.floor(width/(16.0/9.0))

    const height = Math.floor(fullSize.height * maxScale)
    const width = Math.floor(factor*height)

    return {width, height}
}