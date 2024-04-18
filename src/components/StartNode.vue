<template>
	<g :style="{
		transform: `translate(${x}px, ${y}px)`
	}" class="node">
		<rect class="node-container" x="0" y="0" :width="width" :height="height" stroke="lightgreen" :fill="fill" rx="15" />
		<foreignObject class="node-title" x="20" y="10" :width="width - 20" height="35">
			<p>Start</p>
		</foreignObject>
		<circle
			@click.prevent.stop="$emit('select-output', { nodeId, outputIndex: 0 })"
			class="output-port" :cx="width" :cy="28" r="10" stroke-width="3" fill="#444" />
	</g>
</template>

<script setup>
import { computed } from 'vue';
defineEmits(['select-output']);

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

let height = computed(() => $props.outputs.length * 35 + 25);
</script>
