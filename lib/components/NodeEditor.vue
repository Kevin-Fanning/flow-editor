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
			<template v-if="type === 'prompt'">
				<fieldset>
					<label>
						Prompt
						<textarea
							name="prompt"
							placeholder="Prompt"
							autocomplete="off"
							v-model="promptEdit"
						/>
					</label>
				</fieldset>
			</template>
			<template v-if="type === 'custom_outputs'">
				<label>Outputs:</label>
				<fieldset
					role="group"
					v-for="(output, i) in outputsEdit"
					:key="i"
				>
					<input
						name="output"
						placeholder="Output Name"
						autocomplete="off"
						v-model="output.name"
					>
					<button
						class="pico-background-red-450"
						type="button"
						@click="outputsEdit.splice(i, 1)"
					>
						X
					</button>
				</fieldset>
				<button
					class="pico-background-green-450"
					type="button"
					@click="outputsEdit.push({ name: '' })"
				>
					Add Output
				</button>
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

const $props = withDefaults(defineProps<{
	active?: boolean;
	nodeId?: number;
	type?: string;
	x?: number;
	y?: number;
	width?: number;
	title?: string;
	prompt?: string;
	fill?: string;
	outputs?: { name: string }[];
	selected?: boolean;
}>(), {
	active: false,
	nodeId: undefined,
	type: '',
	x: 0,
	y: 0,
	width: 200,
	title: '',
	prompt: '',
	fill: '#222',
	outputs: () => [],
	selected: false,
});

const titleEdit = ref('');
const promptEdit = ref('');
const outputsEdit = ref<{ name: string; to?: number }[]>([]);

const $emit = defineEmits(['close', 'update']);

watch(() => $props.nodeId, () => {
	titleEdit.value = $props.title;
	promptEdit.value = $props.prompt;
	outputsEdit.value = $props.outputs.slice();
});

function save() {
	$emit('update', {
		...$props,
		title: titleEdit.value,
		prompt: promptEdit.value,
		outputs: outputsEdit.value,
	});
	$emit('close');
}

function close() {
	$emit('close');
}
</script>
