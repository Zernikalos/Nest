import {useRoute} from "vue-router"
import {computed} from "vue"

export default computed(() => useRoute().name)
