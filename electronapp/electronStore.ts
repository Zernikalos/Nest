//import ElectronStore from "electron-store";
import _ from "lodash";

interface ElectronStore {
    get(key: string): any;
    set(key: string, value: any): void;
    delete(key: string): void;
}

let store: ElectronStore | undefined = undefined

function getStore(): ElectronStore {
    if (_.isNil(store)) {
        //store = new ElectronStore({name: "nest-config"});
        //ElectronStore.initRenderer()
        store = {
            get(key: string): any {
                //return localStorage.getItem(key)
                return undefined
            },
            set(key: string, value: any): void {
                //localStorage.setItem(key, value)
            },
            delete(key: string): void {
                //localStorage.removeItem(key)
            }
        }
    }
    return store
}

export {getStore}
