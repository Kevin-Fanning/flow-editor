import path from 'node:path';

import { defineConfig } from "eslint/config";
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs([
	includeIgnoreFile(path.resolve(__dirname, '.gitignore')),
	vue.configs['flat/strongly-recommended'],
	vueTsConfigs.recommended,
	{
		rules: {},
		languageOptions: {
			sourceType: 'module',
			globals: {
				...globals.browser,
			},
		},
	},
]);
