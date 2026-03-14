<template>
	<g
		:style="{
			transform: `translate(${x}px, ${y}px)`
		}"
		class="node"
	>
		<rect
			class="node-container"
			x="0"
			y="0"
			:width="width"
			:height="height"
			stroke="lightgreen"
			:fill="fill"
			rx="15"
		/>
		<foreignObject
			class="node-title"
			x="20"
			y="10"
			:width="width - 20"
			height="35"
		>
			<p>Start</p>
		</foreignObject>
		<circle
			@click.prevent.stop="$emit('select-output', { nodeId, outputIndex: 0 })"
			class="output-port"
			:cx="width"
			:cy="28"
			r="10"
			stroke-width="3"
			fill="#444"
		/>
	</g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
defineEmits(['select-output']);

const $props = withDefaults(defineProps<{
	nodeId: number;
	type: string;
	x?: number;
	y?: number;
	width?: number;
	fill?: string;
	outputs?: { name: string }[];
	selected?: boolean;
}>(), {
	x: 0,
	y: 0,
	width: 200,
	name: '',
	fill: '#222',
	outputs: () => [],
	selected: false,
});

const height = computed(() => $props.outputs.length * 35 + 25);
</script>
