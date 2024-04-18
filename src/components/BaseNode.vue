<template>
	<g :style="{
		transform: `translate(${x}px, ${y}px)`
	}" class="node" :class="{ selected }" @click="$emit('select', nodeId)">
		<rect class="node-container" x="0" y="0" :width="width" :height="height" stroke="white" :fill="fill" rx="15" />
		<circle v-if="type !== 'start'" class="input-port" cx="0" cy="30" r="10" stroke-width="3" fill="#444" />
		<foreignObject class="node-title" x="20" y="10" :width="width - 20" height="35">
			<p :title="title">{{ title }}</p>
		</foreignObject>
		<g v-for="(output, i) in outputs" :key="i">
			<foreignObject class="node-output-name" x="5" :y="45 + (i * 35)" :width="width - 25" height="30">
				<p :title="output.name">{{ output.name }}</p>
			</foreignObject>
			<circle
				@click.prevent.stop="$emit('select-output', { nodeId, outputIndex: i })"
				class="output-port" :cx="width" :cy="63 + (i * 35)" r="10" stroke-width="3" fill="#444" />
		</g>
	</g>
</template>

<script setup>
import { computed } from 'vue';
defineEmits(['select', 'select-output']);

let $props = defineProps({
	nodeId: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		required: true,
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

let height = computed(() => $props.outputs.length * 35 + 60);
</script>
