import {createPinia, defineStore} from "pinia"
import {App, computed, ref} from "vue";

export function createStudioStore(app: App) {
    createPinia().install(app)
}

export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)
    const name = ref('Aaron')
    const doubleCount = computed(() => count.value * 2)
    function increment() {
        count.value++
    }

    return { count, name, doubleCount, increment }
})
