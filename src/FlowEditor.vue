<template>
	<div class="flow-editor">
		<svg width="100%" height="100%" @mouseup="dragEnd" @mousemove="dragging" @wheel="magnify">
			<defs>
				<pattern id="GridLayer" x="0" y="0" :width="GRID_SIZE" :height="GRID_SIZE" patternUnits="userSpaceOnUse">
					<rect fill="#404040" x="0" y="0" :width="GRID_SIZE" :height="GRID_SIZE" />
					<line x1="0" :y1="gridY" :x2="GRID_SIZE" :y2="gridY" stroke="#505050" stroke-width="2" />
					<line :x1="gridX" y1="0" :x2="gridX" :y2="GRID_SIZE" stroke="#505050" stroke-width="2" />
				</pattern>
			</defs>
			<g :style="`transform: scale(${scale})`">
				<rect
					fill="url(#GridLayer)" :width="`${100 * (1 / scale)}%`" :height="`${100 * (1 / scale)}%`" draggable ref="gridElement" @mousedown="gridDragStart" />
				<g :style="{
					transform: `translate(${scrollX}px, ${scrollY}px)`
				}">
					<BaseNode
						v-for="node in nodes"
						:key="node.nodeId"
						v-bind="node"
					/>
					<g class="edge-line" v-for="edge in edges" :key="edge.idx">
						<path
							class="hover-target"
							:d="edge.d"
						/>
						<path
							class="visible"
							:d="edge.d"
						/>
					</g>
				</g>
			</g>
		</svg>
	</div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

import BaseNode from '@/components/BaseNode.vue';

const GRID_SIZE = 50;

let gridElement = ref(null);
let scrollX = ref(25);
let scrollY = ref(0);
let scale = ref(1);
let gridX = computed(() => scrollX.value >= 0 ? scrollX.value % GRID_SIZE : (GRID_SIZE + (scrollX.value % GRID_SIZE)));
let gridY = computed(() => scrollY.value >= 0 ? scrollY.value % GRID_SIZE : (GRID_SIZE + (scrollY.value % GRID_SIZE)));

let isDraggingGrid = false;
let dragXStart = 0;
let dragYStart = 0;
let startScrollX = 0;
let startScrollY = 0;

let nodes = [{
	nodeId: 1,
	title: 'Provider Splitter',
	x: 100,
	y: 100,
	outputs: [{
		name: 'Default',
		to: 2,
	},{
		name: 'Dr. Jones'
	}, {
		name: 'Fred Savage',
	}, {
		name: 'Robert Windham'
	}]
}, {
	nodeId: 2,
	selected: true,
	title: 'Direct Referral',
	x: 600,
	y: 300,
	outputs: [{
		name: 'Yes',
		to: 3,
	}, {
		name: 'No'
	}],
}, {
	nodeId: 3,
	title: 'DNP (Direct New Patient)',
	x: 1000,
	y: 300,
	outputs: [],
}];

let edges = computed(() => {
	const total = [];
	nodes.forEach((node) => {
		node.outputs.forEach((output, i) => {
			if (output.to) {
				const other = nodes.find(n => n.nodeId === output.to);
				if (other) {
					const edge = {
						idx: i,
						x1: node.x + (node.width || 200),
						y1: node.y + 65 + (i * 35),
						x2: other.x,
						y2: other.y + 30,
					};
					const distance = Math.max((edge.x2 - edge.x1) / 2, 50);
					edge.d = `M${edge.x1} ${edge.y1} C ${edge.x1 + distance} ${edge.y1}, ${edge.x2 - distance} ${edge.y2}, ${edge.x2} ${edge.y2}`;
					total.push(edge);
				}
			}
		});
	});
	return total;
});

onMounted(() => {
});

function gridDragStart(evt) {
	dragXStart = evt.clientX;
	dragYStart = evt.clientY;
	startScrollX = scrollX.value;
	startScrollY = scrollY.value;
	isDraggingGrid = true;
}

function dragging(evt) {
	if (isDraggingGrid) {
		scrollX.value = startScrollX + ((1 / scale.value) * (evt.clientX - dragXStart));
		scrollY.value = startScrollY + ((1 / scale.value) * (evt.clientY - dragYStart));
	}
}

function dragEnd() {
	isDraggingGrid = false;
}

function magnify(evt) {
	scale.value += Math.sign(evt.deltaY) * -0.25;
	scale.value = Math.min(Math.max(0.5, scale.value), 2);
}
</script>

<style lang="less">
.flow-editor {
	width: 100%;
	height: 100%;

	.edge-line {
		cursor: pointer;
		.hover-target {
			stroke: transparent;
			fill: none;
			stroke-width: 20;
		}
		.visible {
			stroke: #999;
			fill: none;
			stroke-width: 3;
			stroke-linecap: round;
		}
		&:hover .visible {
			stroke: lightblue;
			stroke-width: 6;
		}
	}
}
</style>