import { defineStore } from 'pinia';

export const useProjectUIStore = defineStore('projectUI', {
  state: () => ({
    isCreateDialogOpen: false,
    isCreating: false,
    creationError: null as string | null,
  }),
  actions: {
    setIsCreateDialogOpen(open: boolean) {
      this.isCreateDialogOpen = open;
    },
    setCreating(creating: boolean) {
      this.isCreating = creating;
    },
    setCreationError(error: string | null) {
      this.creationError = error;
    },
  },
});
