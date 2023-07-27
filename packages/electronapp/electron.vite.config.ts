import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
    target: 'esnext',
    main: {
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/main.ts')
                }
            }
        }
    },
    preload: {
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/preload.ts')
                }
            }
        }
    },
    renderer: {
        root: '.',
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname,'../studio')
                }
            }
        }
    }
})