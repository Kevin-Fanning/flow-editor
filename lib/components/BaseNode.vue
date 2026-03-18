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
			:width="(nodeType?.width || 200)"
			:height="height"
			stroke="white"
			:fill="nodeType?.fill || fill"
			rx="15"
		/>
		<g
			v-if="nodeType?.svgIcon"
			transform="translate(16,16)"
		>
			<path
				:d="nodeType?.svgIcon"
				style="fill: var(--fe-color-text)"
			/>
		</g>
		<circle
			v-if="type !== 'start'"
			class="input-port"
			cx="0"
			cy="30"
			r="10"
			stroke-width="3"
			fill="#444"
			@mouseenter="$emit('mouseenter:input', nodeId)"
			@mouseleave="$emit('mouseleave:input', nodeId)"
		/>
		<foreignObject
			class="node-title"
			:x="nodeType?.svgIcon ? 46 : 20"
			y="10"
			:width="(nodeType?.width || 200) - (nodeType?.svgIcon ? 46 : 24)"
			height="35"
		>
			<p :title="name">
				{{ name }}
			</p>
		</foreignObject>
		<g
			v-for="(key, i) in metaKeys"
			:key="key"
		>
			<foreignObject
				class="node-meta-name"
				x="20"
				:y="45 + (i * 35)"
				:width="(nodeType?.width || 200) - 25"
				height="30"
			>
				<p :title="`${meta?.[key]}`">
					{{ key }}
				</p>
			</foreignObject>
		</g>
		<g
			v-for="(output, i) in outputs"
			:key="i"
		>
			<foreignObject
				class="node-output-name"
				x="5"
				:y="45 + (metaKeys.length * 35) + (i * 35)"
				:width="(nodeType?.width || 200) - 25"
				height="30"
			>
				<p :title="output.name">
					{{ output.name }}
				</p>
			</foreignObject>
			<g
				@mousedown.prevent.stop="$emit('mousedown:output', { event: $event, nodeId, output })"
				class="output-port"
			>
				<circle
					:cx="(nodeType?.width || 200)"
					:cy="63 + (metaKeys.length * 35) + (i * 35)"
					r="10"
					stroke-width="3"
					fill="#444"
				/>
				<g
					v-if="!output.to"
					:transform="`translate(${(nodeType?.width || 200) - 9.5},${52 + (metaKeys.length * 35) + (i * 35)})scale(0.8)`"
					fill="yellow"
				>
					<path :d="alertIcon" />
				</g>
			</g>
		</g>
	</g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { NodeType, Output } from '../types.ts';
defineEmits(['select', 'mousedown:output', 'mouseenter:input', 'mouseleave:input']);

const alertIcon = 'M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z';

const $props = withDefaults(defineProps<{
	nodeId: number;
	type: string;
	x?: number;
	y?: number;
	fill?: string;
	name?: string;
	meta?: Record<string, unknown> | null;
	outputs?: Output[];
	selected?: boolean;
	nodeType?: NodeType | null;
}>(), {
	x: 0,
	y: 0,
	name: '',
	fill: '#222',
	outputs: () => [],
	selected: false,
	nodeType: null,
	meta: null,
});

const metaKeys = computed(() => Object.keys($props.meta || {}));

const height = computed(() => ($props.outputs.length * 35) + (metaKeys.value.length * 35) + 60);
</script>

<style scoped>
.node-container {
	opacity: 0.8;
}
</style>
