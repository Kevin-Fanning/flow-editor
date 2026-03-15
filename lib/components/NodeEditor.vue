<template>
	<div
		class="node-editor"
		v-if="nodeId && type"
	>
		<form>
			<fieldset>
				<label>
					Title
					<input
						name="node_title"
						placeholder="Node Title"
						autocomplete="off"
						v-model="titleEdit"
					>
				</label>
			</fieldset>
			<component
				v-if="nodeType?.nodeEditComponent"
				:is="nodeType?.nodeEditComponent"
				:meta="metaEdit"
				@update:meta="updateMeta"
			/>
			<template v-if="!nodeType?.lockedOutputs || outputs.length > 0">
				<label>Outputs:</label>
				<template
					v-for="(output, i) in outputsEdit"
					:key="i"
				>
					<component
						v-if="nodeType?.outputEditComponent && output.value !== 'default'"
						:is="nodeType.outputEditComponent"
						:model-value="output"
						@update:model-value="outputsEdit[i] = $event"
						@delete="outputsEdit.splice(i, 1)"
					/>
					<fieldset
						role="group"
						v-else
					>
						<input
							name="output"
							placeholder="Output Name"
							autocomplete="off"
							v-model="output.name"
							:disabled="nodeType?.lockedOutputs || output.value === 'default'"
						>
						<button
							style="background-color: var(--pico-color-red-450)"
							type="button"
							@click="outputsEdit.splice(i, 1)"
							v-if="!nodeType?.lockedOutputs && output.value !== 'default'"
						>
							X
						</button>
					</fieldset>
				</template>
				<button
					style="background-color: var(--pico-color-green-450)"
					type="button"
					@click="outputsEdit.push({ name: '', value: 0 })"
					v-if="!nodeType?.lockedOutputs && !nodeType?.outputCreateComponent"
				>
					Add Output
				</button>
				<component
					v-else-if="nodeType?.outputCreateComponent"
					:is="nodeType?.outputCreateComponent"
					:existing="outputsEdit"
					@update:model-value="outputsEdit.push($event)"
				/>
			</template>
		</form>
		<div class="grid">
			<button
				class="secondary"
				@click="close"
				type="button"
			>
				Cancel
			</button>
			<button
				@click="save"
				type="button"
			>
				Save
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import type { NodeType } from '../types';

const $props = withDefaults(defineProps<{
	active?: boolean;
	nodeId?: number;
	type?: string;
	x?: number;
	y?: number;
	width?: number;
	name?: string;
	prompt?: string;
	fill?: string;
	outputs?: { name: string; value: string | number | boolean; to?: number }[];
	meta?: Record<string, unknown> | null;
	selected?: boolean;
	nodeType?: NodeType | null;
}>(), {
	active: false,
	nodeId: undefined,
	type: '',
	x: 0,
	y: 0,
	width: 200,
	name: '',
	prompt: '',
	fill: '#222',
	outputs: () => [],
	selected: false,
	nodeType: null,
	meta: () => ({}),
});

const titleEdit = ref('');
const promptEdit = ref('');
const outputsEdit = ref<{ name: string; value: string | number | boolean; to?: number }[]>([]);
const metaEdit = ref<Record<string, unknown>>({});

const $emit = defineEmits(['close', 'update']);

watch(() => $props.nodeId, () => {
	titleEdit.value = $props.name;
	promptEdit.value = $props.prompt;
	outputsEdit.value = $props.outputs.slice();
	metaEdit.value = $props.meta || {};
});

function updateMeta(meta: Record<string, unknown>) {
	metaEdit.value = meta;
}

function save() {
	$emit('update', {
		...$props,
		title: titleEdit.value,
		prompt: promptEdit.value,
		outputs: outputsEdit.value,
		meta: metaEdit.value,
	});
	$emit('close');
}

function close() {
	$emit('close');
}
</script>

<style scoped>
.node-editor {
	max-height: 100%;
	overflow: auto;
}
</style>
