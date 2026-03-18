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
		<g
			class="output-port"
			@mousedown.prevent.stop="$emit('mousedown:output', { event: $event, nodeId, output: outputs[0] })"
		>
			<circle
				:cx="width"
				:cy="28"
				r="10"
				stroke-width="3"
				fill="#444"
			/>
			<g
				v-if="!outputs[0]?.to"
				:transform="`translate(${(width || 200) - 9.5},${18})scale(0.8)`"
				fill="yellow"
			>
				<path :d="alertIcon" />
			</g>
		</g>
	</g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Output } from '../types';

const alertIcon = 'M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z';

defineEmits(['mousedown:output']);

const $props = withDefaults(defineProps<{
	nodeId: number;
	type: string;
	x?: number;
	y?: number;
	width?: number;
	fill?: string;
	outputs?: Output[];
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
