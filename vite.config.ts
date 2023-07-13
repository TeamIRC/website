import { importAssertions } from 'acorn-import-assertions';
import { importAssertionsPlugin } from 'rollup-plugin-import-assert';
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  build: { rollupOptions: {
    acornInjectPlugins: [importAssertions], 
    plugins: [ importAssertionsPlugin() ]
  }},
  plugins: [vue(), svgLoader()],
})
