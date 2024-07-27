import ElectronStore from "electron-store";
import _ from "lodash";

let store: ElectronStore | undefined = undefined

function getStore(): ElectronStore {
    if (_.isNil(store)) {
        store = new ElectronStore({name: "nest-config"});
        ElectronStore.initRenderer()
    }
    return store
}

export {getStore}
