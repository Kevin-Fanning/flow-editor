import path from 'node:path';

import vue from 'eslint-plugin-vue';
import globals from 'globals';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfigWithVueTs([
	includeIgnoreFile(path.resolve(__dirname, '.gitignore')),
	vue.configs['flat/strongly-recommended'],
	vueTsConfigs.recommended,
	stylistic.configs.customize({
		indent: 'tab',
		quotes: 'single',
		semi: true,
		commaDangle: 'always-multiline',
		arrowParens: false,
		braceStyle: '1tbs',
	}),
	{
		rules: {
			'vue/html-indent': ['error', 'tab'],
		},
		languageOptions: {
			sourceType: 'module',
			globals: {
				...globals.browser,
			},
		},
	},
]);
