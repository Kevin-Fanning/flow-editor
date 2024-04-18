<template>
	<div class="node-editor" v-if="nodeId && type">
		<form>
			<fieldset>
				<label>
					Title
					<input
						name="node_title"
						placeholder="Node Title"
						autocomplete="off"
						v-model="titleEdit"
					/>
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
				<fieldset role="group" v-for="(output, i) in outputsEdit" :key="i">
					<input
						name="output"
						placeholder="Output Name"
						autocomplete="off"
						v-model="output.name"
					/>
					<button class="pico-background-red-450" type="button" @click="outputsEdit.splice(i, 1)">X</button>
				</fieldset>
				<button class="pico-background-green-450" type="button" @click="outputsEdit.push({ name: '' })">Add Output</button>
			</template>
		</form>
		<div class="grid">
			<button class="secondary" @click="close" type="button">Cancel</button>
			<button @click="save" type="button">Save</button>
		</div>
	</div>
</template>

<script setup>
import { watch, ref } from 'vue';

const $props = defineProps({
	active: {
		type: Boolean,
		default: false,
	},
	nodeId: {
		type: Number,
	},
	type: {
		type: String,
	},
	x: {
		type: Number,
		default: 0,
	},
	y: {
		type: Number,
		default: 0,
	},
	width: {
		type: Number,
		default: 200,
	},
	title: {
		type: String,
		default: '',
	},
	prompt: {
		type: String,
		default: '',
	},
	fill: {
		type: String,
		default: '#222',
	},
	outputs: {
		type: Array,
		default: () => [],
	},
	selected: {
		type: Boolean,
		default: false,
	},
});

let titleEdit = ref('');
let promptEdit = ref('');
let outputsEdit = ref([]);

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