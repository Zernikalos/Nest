import {screen} from "electron"
import {store} from "../electronStore"

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

    const height = Math.floor(fullSize.height * maxScale)
    const width = Math.floor(factor*height)

    return {width, height}
}

export function desiredWindowSize(): WindowSize {
    // @ts-ignore
    const storeWindowSize: WindowSize = store.get('windowSize')
    const size169 = windowSize169()
    const fullSize = fullWindowSize()

    const desiredSize = storeWindowSize ?? size169

    desiredSize.width = Math.min(desiredSize.width, fullSize.width)
    desiredSize.height = Math.min(desiredSize.height, fullSize.height)

    return desiredSize
}