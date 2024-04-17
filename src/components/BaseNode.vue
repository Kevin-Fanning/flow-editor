<template>
	<g :style="{
		transform: `translate(${x}px, ${y}px)`
	}" class="node" :class="{ selected }">
		<rect class="node-container" x="0" y="0" :width="width" :height="height" stroke="white" :fill="fill" rx="15" />
		<circle class="input-port" cx="0" cy="30" r="10" stroke-width="3" fill="#444" />
		<foreignObject class="node-title" x="20" y="15" :width="width - 20" height="30">
			<p :title="title">{{ title }}</p>
		</foreignObject>
		<g v-for="(output, i) in outputs" :key="i">
			<foreignObject class="node-output-name" x="5" :y="55 + (i * 35)" :width="width - 20" height="30">
				<p :title="output.name">{{ output.name }}</p>
			</foreignObject>
			<circle class="output-port" :cx="width" :cy="65 + (i * 35)" r="10" stroke-width="3" fill="#444" />
		</g>
	</g>
</template>

<script setup>
import { computed } from 'vue';

let $props = defineProps({
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

<style scoped lang="less">
.node {
	&.selected {
		.node-container {
			stroke-width: 5;
			stroke: #9090E0;
			fill: #202050;
		}
	}
	.output-port,.input-port {
		stroke-width: 3;
		stroke: #E5E5E5;
		cursor: pointer;
		&:hover {
			stroke: lightblue;
			stroke-width: 5;
		}
	}
	.node-title p {
		font-size: 1.2em;
		font-family: Arial, Helvetica, sans-serif;
		color: #E9E9E9;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
	}
	.node-output-name p {
		font-size: 1.1em;
		font-family: Arial, Helvetica, sans-serif;
		color: #E9E9E9;
		text-align: right;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
	}
}
</style>