import { defineConfig } from 'vite'
import { resolve } from 'path'

const root = import.meta.dirname

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        work: resolve(root, 'work/index.html'),
        roomTone: resolve(root, 'work/room-tone.html'),
        nexora: resolve(root, 'work/nexora.html'),
        auroraLabs: resolve(root, 'work/aurora-labs.html'),
        vertex: resolve(root, 'work/vertex.html'),
        about: resolve(root, 'about/index.html'),
      },
    },
  },
})
