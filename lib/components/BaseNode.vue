<template>
	<g
		:style="{
			transform: `translate(${x}px, ${y}px)`
		}"
		class="node"
		:class="{ selected }"
		@click="$emit('select', nodeId)"
	>
		<rect
			class="node-container"
			x="0"
			y="0"
			:width="width"
			:height="height"
			stroke="white"
			:fill="fill"
			rx="15"
		/>
		<circle
			v-if="type !== 'start'"
			class="input-port"
			cx="0"
			cy="30"
			r="10"
			stroke-width="3"
			fill="#444"
		/>
		<foreignObject
			class="node-title"
			x="20"
			y="10"
			:width="width - 20"
			height="35"
		>
			<p :title="title">
				{{ title }}
			</p>
		</foreignObject>
		<g
			v-for="(output, i) in outputs"
			:key="i"
		>
			<foreignObject
				class="node-output-name"
				x="5"
				:y="45 + (i * 35)"
				:width="width - 25"
				height="30"
			>
				<p :title="output.name">
					{{ output.name }}
				</p>
			</foreignObject>
			<circle
				@click.prevent.stop="$emit('select-output', { nodeId, outputIndex: i })"
				class="output-port"
				:cx="width"
				:cy="63 + (i * 35)"
				r="10"
				stroke-width="3"
				fill="#444"
			/>
		</g>
	</g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
defineEmits(['select', 'select-output']);

const $props = withDefaults(defineProps<{
	nodeId: number;
	type: string;
	x?: number;
	y?: number;
	width?: number;
	title?: string;
	fill?: string;
	outputs?: { name: string }[];
	selected?: boolean;
}>(), {
	x: 0,
	y: 0,
	width: 200,
	title: '',
	fill: '#222',
	outputs: () => [],
	selected: false,
});

const height = computed(() => $props.outputs.length * 35 + 60);
</script>
