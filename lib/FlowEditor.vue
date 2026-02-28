<template>
  <div
    class="flow-editor"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
    @mousemove="dragging"
  >
    <svg
      :width="selected ? 'calc(100% - 500px)' : '100%'"
      height="100%"
      @wheel="magnify"
    >
      <defs>
        <pattern
          id="GridLayer"
          x="0"
          y="0"
          :width="GRID_SIZE"
          :height="GRID_SIZE"
          patternUnits="userSpaceOnUse"
        >
          <rect
            fill="#404040"
            x="0"
            y="0"
            :width="GRID_SIZE"
            :height="GRID_SIZE"
          />
          <line
            x1="0"
            :y1="gridY"
            :x2="GRID_SIZE"
            :y2="gridY"
            stroke="#505050"
            stroke-width="2"
          />
          <line
            :x1="gridX"
            y1="0"
            :x2="gridX"
            :y2="GRID_SIZE"
            stroke="#505050"
            stroke-width="2"
          />
        </pattern>
      </defs>
      <g :style="`transform: scale(${scale})`">
        <rect
          fill="url(#GridLayer)"
          :width="`${100 * (1 / scale)}%`"
          :height="`${100 * (1 / scale)}%`"
          draggable
          ref="gridElement"
          @mousedown="gridDragStart"
        />
        <g
          :style="{
            transform: `translate(${scrollX}px, ${scrollY}px)`
          }"
        >
          <template
            v-for="node in nodes"
            :key="node.nodeId"
          >
            <StartNode
              v-if="node.type === 'start'"
              v-bind="node"
            />
            <BaseNode
              v-else
              v-bind="node"
              @select="selectNode"
              @mousedown="(evt: MouseEvent) => nodeDragStart(evt, node)"
            />
          </template>
          <g
            class="edge-line"
            v-for="edge in edges"
            :key="edge.idx"
          >
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
    <div
      v-show="selected"
      class="node-editor"
    >
      <NodeEditor
        v-bind="selected"
        @close="closeNode"
        @update="updateNode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue';

import BaseNode from './components/BaseNode.vue';
import NodeEditor from './components/NodeEditor.vue';
import StartNode from './components/StartNode.vue';

const GRID_SIZE = 50;

const gridElement = ref(null);
const scrollX = ref(25);
const scrollY = ref(0);
const scale = ref(1);
const gridX = computed(() => scrollX.value >= 0 ? scrollX.value % GRID_SIZE : (GRID_SIZE + (scrollX.value % GRID_SIZE)));
const gridY = computed(() => scrollY.value >= 0 ? scrollY.value % GRID_SIZE : (GRID_SIZE + (scrollY.value % GRID_SIZE)));

let isDraggingGrid = false;
let draggingNode: null|Node = null;
let didNodeDrag = false;
let dragXStart = 0;
let dragYStart = 0;
let startScrollX = 0;
let startScrollY = 0;

interface Node {
	nodeId: number;
	title: string;
	type: string;
	x: number;
	y: number;
	width?: number;
	outputs: { name: string, to?: number }[];
	selected?: boolean;
	prompt?: string;
}

const nodes = reactive<Node[]>([{
	nodeId: 0,
	title: 'Start',
	type: 'start',
	x: 10,
	y: 10,
	width: 100,
	outputs: [{
		name: "Begin",
		to: 1,
	}],
}, {
	nodeId: 1,
	title: 'Provider Splitter',
	type: 'custom_outputs',
	x: 200,
	y: 100,
	width: 300,
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
	type: 'prompt',
	title: 'Direct Referral',
	prompt: 'Does the patient have a direct referral?',
	x: 600,
	y: 300,
	outputs: [{
		name: 'Yes',
		to: 3,
	}, {
		name: 'No',
		to: 4,
	}],
}, {
	nodeId: 3,
	type: 'exit',
	title: 'DNP (Direct New Patient)',
	x: 1000,
	y: 300,
	width: 300,
	outputs: [],
}, {
	nodeId: 4,
	type: 'exit',
	title: 'NP (New Patient)',
	x: 1000,
	y: 400,
	width: 300,
	outputs: [],
}]);

const selected = computed(() => {
	return nodes.find(node => node.selected);
});

function selectNode(nodeId: number) {
	if (didNodeDrag) {
		didNodeDrag = false;
		return;
	}
	nodes.forEach((node) => {
		if (node.nodeId === nodeId) {
			node.selected = true;
		} else {
			node.selected = false;
		}
	});
	nodes.sort((a, b) => {
		if (a.selected) { return 1; }
		if (b.selected) { return -1; }
		return 0;
	});
}

function updateNode(props: Partial<Node>) {
	if (selected.value) {
		Object.assign(selected.value, props);
	}
}

function closeNode() {
	const selected = nodes.find(node => node.selected);
	if (selected) {
		selected.selected = false;
	}
}

interface Edge {
	idx: number;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	d?: string;
}

const edges = computed(() => {
	const total: Edge[] = [];
	nodes.forEach((node) => {
		node.outputs.forEach((output, i) => {
			if (output.to) {
				const other = nodes.find(n => n.nodeId === output.to);
				if (other) {
					let outputStart = 63;
					if (node.type === 'start') {
						outputStart = 28;
					}
					const outputHeight = 35;
					const inputStart = 30;
					const edge: Edge = {
						idx: i,
						x1: node.x + (node.width || 200),
						y1: node.y + outputStart + (i * outputHeight),
						x2: other.x,
						y2: other.y + inputStart,
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

function gridDragStart(evt: MouseEvent) {
	dragXStart = evt.clientX;
	dragYStart = evt.clientY;
	startScrollX = scrollX.value;
	startScrollY = scrollY.value;
	isDraggingGrid = true;
}

function nodeDragStart(evt: MouseEvent, node: Node) {
	draggingNode = node;
	didNodeDrag = false;
	dragXStart = evt.clientX;
	dragYStart = evt.clientY;
	startScrollX = node.x;
	startScrollY = node.y;
	nodes.sort((a, b) => {
		if (a.nodeId === node.nodeId) { return 1; }
		if (b.nodeId === node.nodeId) { return -1; }
		return 0;
	});
}

function dragging(evt: MouseEvent) {
	if (isDraggingGrid) {
		scrollX.value = startScrollX + ((1 / scale.value) * (evt.clientX - dragXStart));
		scrollY.value = startScrollY + ((1 / scale.value) * (evt.clientY - dragYStart));
	}
	if (draggingNode) {
		draggingNode.x = startScrollX + ((1 / scale.value) * (evt.clientX - dragXStart));
		draggingNode.y = startScrollY + ((1 / scale.value) * (evt.clientY - dragYStart));
	}
}

function dragEnd() {
	isDraggingGrid = false;
	if (draggingNode) {
		const xDist = Math.abs(startScrollX - draggingNode.x);
		const yDist = Math.abs(startScrollY - draggingNode.y);
		if (xDist <= 5 && yDist <= 5) {
			// Don't count this, user meant to click
			draggingNode = null;
			didNodeDrag = false;
			draggingNode!.x = startScrollX;
			draggingNode!.y = startScrollY;
			return;
		}
		didNodeDrag = startScrollX !== draggingNode.x || startScrollY !== draggingNode.y;
		draggingNode = null;
	}
}

function magnify(evt: WheelEvent) {
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
			user-select: none;
			font-size: 1.1em;
			color: #E9E9E9;
			margin: 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin: 0;
		}
		.node-output-name p {
			user-select: none;
			color: #E9E9E9;
			text-align: right;
			margin: 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin: 0;
		}
	}
	.node-editor {
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		width: 500px;
		padding: 20px;
	}
}
</style>