import path from 'node:path';

import vue from 'eslint-plugin-vue';
import globals from 'globals';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs([
	includeIgnoreFile(path.resolve(__dirname, '.gitignore')),
	vue.configs['flat/strongly-recommended'],
	vueTsConfigs.recommended,
	{
		rules: {
			"vue/html-indent": ['error', 'tab'],
		},
		languageOptions: {
			sourceType: 'module',
			globals: {
				...globals.browser,
			},
		},
	},
]);
