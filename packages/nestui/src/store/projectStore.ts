import { defineStore } from 'pinia'
import { useNativeNest } from './nativeStore'
import { computed, ref } from 'vue'
import _ from 'lodash'

export interface ProjectData {
    version: string
    inputs: string[]
    outputs: string[]
}

export const useProjectStore = defineStore('projectStore', () => {
    const project = ref<ProjectData | undefined>(undefined)

    const nativeStore = useNativeNest()

    const hasDefinedProject = computed(() => !_.isNil(project.value))

    async function createProject() {
        const newProject = await nativeStore.createNewProject()
        project.value = newProject
    }

    function addInput(input: string) {
        if (project.value) {
            project.value.inputs.push(input)
        }
    }

    function addOutput(output: string) {
        if (project.value) {
            project.value.outputs.push(output)
        }
    }

    function clearProject() {
        project.value = undefined
    }

    return {
        project,
        hasDefinedProject,
        createProject,
        addInput,
        addOutput,
        clearProject
    }
})
