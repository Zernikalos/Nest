import { defineStore } from 'pinia';

export const useProjectStore = defineStore('project', {
  state: () => ({
    projectFilePath: null as string | null,
  }),
  actions: {
    setProjectPath(filePath: string) {
      this.projectFilePath = filePath;
    },
    clearProjectPath() {
      this.projectFilePath = null;
    },
  },
});
