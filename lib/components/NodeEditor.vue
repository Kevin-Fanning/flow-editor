<template>
	<div
		class="node-editor"
		v-if="nodeId"
	>
		<form>
			<fieldset v-if="nodeId === -1">
				<label>Select Node Type</label>
				<select
					v-model="selectedType"
				>
					<option
						v-for="typeOption in nodeTypes"
						:key="typeOption.type"
						:value="typeOption.type"
					>
						{{ typeOption.name }}
					</option>
				</select>
			</fieldset>
			<div v-show="selectedType">
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
							class="grouped"
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
								style="background-color: var(--fe-color-error)"
								type="button"
								@click="outputsEdit.splice(i, 1)"
								v-if="!nodeType?.lockedOutputs && output.value !== 'default'"
							>
								X
							</button>
						</fieldset>
					</template>
					<button
						style="background-color: var(--fe-color-success)"
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
			</div>
		</form>
		<hr>
		<div style="display: flex;">
			<button
				class="secondary"
				style="flex: 1 1 auto;"
				@click="close"
				type="button"
			>
				Cancel
			</button>
			<button
				@click="save"
				style="flex: 1 1 auto;"
				type="button"
				class="primary"
			>
				Save
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import type { NodeType, Output } from '../types';

const $props = withDefaults(defineProps<{
	nodeId?: number;
	type?: string;
	x?: number;
	y?: number;
	width?: number;
	name?: string;
	prompt?: string;
	fill?: string;
	outputs?: Output[];
	meta?: Record<string, unknown> | null;
	selected?: boolean;
	nodeTypes: NodeType[];
}>(), {
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
const outputsEdit = ref<Output[]>([]);
const metaEdit = ref<Record<string, unknown>>({});

const selectedType = ref<string>($props.type);
const nodeType = computed(() => $props.nodeTypes.find(type => type.type === selectedType.value) || null);

const $emit = defineEmits(['close', 'update']);

watch(() => $props.nodeId, () => {
	titleEdit.value = $props.name;
	promptEdit.value = $props.prompt;
	outputsEdit.value = $props.outputs.slice();
	metaEdit.value = $props.meta || {};
	selectedType.value = $props.type;
});

watch(selectedType, () => {
	// Reset node when changing types
	titleEdit.value = $props.name;
	if ($props.nodeId === -1) {
		outputsEdit.value = nodeType.value?.outputs?.slice() || [];
	} else {
		outputsEdit.value = $props.outputs?.slice() || [];
	}
	metaEdit.value = $props.meta || {};
});

function updateMeta(meta: Record<string, unknown>) {
	metaEdit.value = meta;
}

function save() {
	$emit('update', {
		...$props,
		type: selectedType.value,
		name: titleEdit.value,
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
	background-color: var(--fe-color-background);
}
</style>
