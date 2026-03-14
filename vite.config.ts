import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import dev from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		dts(),
		dev(),
	],
	build: {
		lib: {
			entry: './lib/main.ts',
			fileName: 'index',
			formats: ['es'],
		},
		rollupOptions: {
			external: [
				'vue',
			],
		},
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
