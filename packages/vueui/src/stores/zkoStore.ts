import { defineStore } from 'pinia';
import type { ZkResultExtended } from '@/types/project';

export const useZkoStore = defineStore('zko', {
  state: () => ({
    isConverting: false,
    conversionError: null as string | null,
    zkResult: null as ZkResultExtended | null,
  }),
  actions: {
    setConverting(converting: boolean) {
      this.isConverting = converting;
    },
    setError(error: string | null) {
      this.conversionError = error;
    },
    setZkResult(result: ZkResultExtended | null) {
      this.zkResult = result;
    },
    clearZko() {
      this.isConverting = false;
      this.conversionError = null;
      this.zkResult = null;
    },
  },
});
