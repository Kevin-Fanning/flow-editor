<template>
	<div
		class="flow-editor pico"
		@mouseup="dragEnd"
		@mouseleave="dragEnd"
		@mousemove="dragging"
		@click:right.prevent.stop="() => {}"
		@contextmenu.prevent.stop="() => {}"
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
					:width="gridSize"
					:height="gridSize"
					patternUnits="userSpaceOnUse"
				>
					<rect
						fill="#404040"
						x="0"
						y="0"
						:width="gridSize"
						:height="gridSize"
					/>
					<line
						x1="0"
						:y1="gridY"
						:x2="gridSize"
						:y2="gridY"
						stroke="#505050"
						stroke-width="2"
					/>
					<line
						:x1="gridX"
						y1="0"
						:x2="gridX"
						:y2="gridSize"
						stroke="#505050"
						stroke-width="2"
					/>
				</pattern>
			</defs>
			<g
				ref="scaleElement"
				:style="`transform: translate(${offset.x}px,${offset.y}px) scale(${scale})`"
			>
				<rect
					fill="url(#GridLayer)"
					:width="`${scale <= 1 ? (100 * (1 / scale)) : 100}%`"
					:height="`${scale <= 1 ? (100 * (1 / scale)) : 100}%`"
					draggable
					ref="gridElement"
					:style="`transform: translate(${-offset.x*(1/scale)}px,${-offset.y*(1/scale)}px)`"
					@mousedown="gridDragStart"
				/>
				<g
					:style="{
						transform: `translate(${scrollX}px, ${scrollY}px)`
					}"
				>
					<template
						v-for="node in sortedNodes"
						:key="node.nodeId"
					>
						<StartNode
							v-if="node.type === 'start'"
							v-bind="node"
							:width="nodeTypes.find(type => type.type === 'start')?.width"
							:fill="nodeTypes.find(type => type.type === 'start')?.fill"
							@mousedown:output="outputDragStart"
						/>
						<BaseNode
							v-else
							v-bind="node"
							:x="draggingNode?.nodeId === node.nodeId ? draggingNodePosition.x : node.x"
							:y="draggingNode?.nodeId === node.nodeId ? draggingNodePosition.y : node.y"
							:node-type="nodeTypes.find(type => type.type === node.type) ?? null"
							:selected="selectedId === node.nodeId"
							@select="selectNode"
							@mousedown="(evt: MouseEvent) => nodeDragStart(evt, node)"
							@mousedown:output="outputDragStart"
							@mouseenter:input="inputEnter"
							@mouseleave:input="inputLeave"
							@update="updateNode"
						/>
					</template>
					<g
						class="edge-line"
						v-for="edge in edges"
						:key="edge.idx"
						@contextmenu.prevent.stop="removeEdge(edge)"
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
					<g
						class="edge-line"
						v-if="draggingOutput"
					>
						<path
							class="visible"
							style="pointer-events: none;"
							:d="draggingOutputPath"
						/>
					</g>
				</g>
			</g>
		</svg>
		<NodeEditor
			v-show="selected"
			v-bind="selected"
			:node-type="nodeTypes.find(type => type.type === selected?.type) ?? null"
			@close="closeNode"
			@update="updateNode"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, useTemplateRef } from 'vue';

import BaseNode from './components/BaseNode.vue';
import NodeEditor from './components/NodeEditor.vue';
import StartNode from './components/StartNode.vue';
import type { Node, Output, NodeType } from './types';

import '@picocss/pico/scss/pico.conditional.scss';
import '@picocss/pico/scss/pico.colors.scss';

const $scaleElement = useTemplateRef<SVGGElement>('scaleElement');

const $props = withDefaults(defineProps<{
	gridSize?: number;
	nodes: Node[];
	nodeTypes: NodeType[];
}>(), {
	gridSize: 50,
	nodes: () => [],
	nodeTypes: () => [],
});

const $emit = defineEmits(['update:node', 'update:nodes']);

const selectedId = ref<number | null>(null);
const scrollX = ref(25);
const scrollY = ref(0);
const scale = ref(0.5);
const gridX = computed(() => scrollX.value >= 0 ? scrollX.value % $props.gridSize : ($props.gridSize + (scrollX.value % $props.gridSize)));
const gridY = computed(() => scrollY.value >= 0 ? scrollY.value % $props.gridSize : ($props.gridSize + (scrollY.value % $props.gridSize)));

const sortedNodes = computed(() => {
	const list = $props.nodes.slice();
	list.sort((a, b) => {
		if (a.nodeId === draggingNode.value?.nodeId) {
			return 1;
		}
		if (b.nodeId === draggingNode.value?.nodeId) {
			return -1;
		}
		if (a.nodeId === selectedId.value) {
			return 1;
		}
		if (b.nodeId === selectedId.value) {
			return -1;
		}
		return 0;
	});
	return list;
});

let isDraggingGrid = false;
const draggingNode = ref<null | Node>(null);
const draggingNodePosition = ref({ x: 0, y: 0 });
const draggingOutput = ref<null | (Output & { nodeId: number })>(null);
const dragOutputEnd = ref({ x: 0, y: 0 });
const hoveredInput = ref<null | number>(null);
let didNodeDrag = false;
let dragXStart = 0;
let dragYStart = 0;
let startScrollX = 0;
let startScrollY = 0;

const selected = computed(() => {
	return $props.nodes.find(node => node.nodeId === selectedId.value);
});

function selectNode(nodeId: number) {
	if (didNodeDrag) {
		didNodeDrag = false;
		return;
	}
	selectedId.value = nodeId;
}

function updateNode(props: Partial<Node>) {
	if (selected.value) {
		$emit('update:node', { ...selected.value, ...props });
	}
}

function closeNode() {
	selectedId.value = null;
}

interface Edge {
	idx: number;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	d?: string;
	nodeId: number;
	from: Output;
	to: Node;
}

const edges = computed(() => {
	const total: Edge[] = [];
	$props.nodes.forEach((node) => {
		node.outputs.forEach((output, i) => {
			if (output.to) {
				const other = $props.nodes.find(n => n.nodeId === output.to);
				if (other) {
					let outputStart = 63;
					if (node.type === 'start') {
						outputStart = 28;
					}
					let otherPosition: { x: number; y: number } = other;
					if (other.nodeId === draggingNode.value?.nodeId) {
						otherPosition = draggingNodePosition.value;
					}
					const metaHeight = Object.keys(node?.meta || {}).length * 35;
					const outputHeight = 35;
					const inputStart = 30;
					const position: { x: number; y: number } = (node.nodeId === draggingNode.value?.nodeId) ? draggingNodePosition.value : node;
					const nodeType = $props.nodeTypes.find(type => type.type === node.type);
					const edge: Edge = {
						idx: i,
						x1: position.x + (nodeType?.width || 200) + 12,
						y1: position.y + metaHeight + outputStart + (i * outputHeight),
						x2: otherPosition.x - 12,
						y2: otherPosition.y + inputStart,
						nodeId: node.nodeId,
						from: output,
						to: other,
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

function removeEdge(edge: Edge) {
	const owner = $props.nodes.find(n => n.nodeId === edge.nodeId);
	if (!owner) {
		return;
	}
	$emit('update:node', {
		...owner,
		outputs: owner.outputs.map(out => ({
			...out,
			to: out.name === edge.from.name ? null : out.to,
		})),
	});
}

const draggingOutputPath = computed(() => {
	if (!draggingOutput.value) {
		return '';
	}
	const node = $props.nodes.find(n => n.nodeId === draggingOutput.value!.nodeId);
	if (!node) {
		return '';
	}
	const edge = {
		idx: 0,
		x1: dragXStart,
		y1: dragYStart,
		x2: dragOutputEnd.value.x,
		y2: dragOutputEnd.value.y,
	};
	const distance = (edge.x2 - edge.x1) / 2;
	return `M${edge.x1} ${edge.y1} C ${edge.x1 + distance} ${edge.y1}, ${edge.x2 - distance} ${edge.y2}, ${edge.x2} ${edge.y2}`;
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
	draggingNode.value = node;
	didNodeDrag = false;
	dragXStart = evt.clientX;
	dragYStart = evt.clientY;
	startScrollX = node.x;
	startScrollY = node.y;
	draggingNodePosition.value.x = node.x;
	draggingNodePosition.value.y = node.y;
	$emit('update:node', $props.nodes.slice().sort((a, b) => {
		if (a.nodeId === node.nodeId) {
			return 1;
		}
		if (b.nodeId === node.nodeId) {
			return -1;
		}
		return 0;
	}));
}

function outputDragStart({ event, nodeId, output }: { event: MouseEvent; nodeId: number; output: Output }) {
	draggingOutput.value = { ...output, nodeId };
	dragXStart = (event.clientX - offset.value.x) * (1 / scale.value) - scrollX.value;
	dragYStart = (event.clientY - offset.value.y) * (1 / scale.value) - scrollY.value;
	dragOutputEnd.value.x = dragXStart;
	dragOutputEnd.value.y = dragYStart;
}

function inputEnter(nodeId: number) {
	hoveredInput.value = nodeId;
}

function inputLeave(nodeId: number) {
	if (hoveredInput.value === nodeId) {
		hoveredInput.value = null;
	}
}

function dragging(evt: MouseEvent) {
	if (isDraggingGrid) {
		scrollX.value = startScrollX + ((1 / scale.value) * (evt.clientX - dragXStart));
		scrollY.value = startScrollY + ((1 / scale.value) * (evt.clientY - dragYStart));
	}
	if (draggingNode.value) {
		draggingNodePosition.value.x = startScrollX + ((1 / scale.value) * (evt.clientX - dragXStart));
		draggingNodePosition.value.y = startScrollY + ((1 / scale.value) * (evt.clientY - dragYStart));
	}
	if (draggingOutput.value) {
		dragOutputEnd.value.x = (evt.clientX - offset.value.x) * (1 / scale.value) - scrollX.value;
		dragOutputEnd.value.y = (evt.clientY - offset.value.y) * (1 / scale.value) - scrollY.value;
	}
}

function dragEnd() {
	isDraggingGrid = false;
	if (draggingNode.value) {
		const xDist = Math.abs(startScrollX - draggingNodePosition.value.x);
		const yDist = Math.abs(startScrollY - draggingNodePosition.value.y);
		if (xDist <= 5 && yDist <= 5) {
			// Don't count this, user meant to click
			draggingNode.value.x = startScrollX;
			draggingNode.value.y = startScrollY;
			draggingNode.value = null;
			didNodeDrag = false;
			return;
		}
		didNodeDrag = startScrollX !== draggingNodePosition.value.x || startScrollY !== draggingNodePosition.value.y;
		$emit('update:node', { ...draggingNode.value, x: draggingNodePosition.value.x, y: draggingNodePosition.value.y });
		draggingNodePosition.value = { x: 0, y: 0 };
		draggingNode.value = null;
	}
	if (draggingOutput.value) {
		if (hoveredInput.value) {
			const node = $props.nodes.find(n => n.nodeId === draggingOutput.value!.nodeId);
			if (!node) {
				draggingOutput.value = null;
				return;
			}
			$emit('update:node', {
				...node,
				outputs: node.outputs.map(output => ({
					...output,
					to: output.name === draggingOutput.value!.name ? hoveredInput.value : output.to,
				})),
			});
		}
		draggingOutput.value = null;
	}
}

const offset = ref({
	x: 0,
	y: 0,
});

function magnify(evt: WheelEvent) {
	const mouseX = evt.clientX - ($scaleElement.value?.getBoundingClientRect().left || 0);
	const mouseY = evt.clientY - ($scaleElement.value?.getBoundingClientRect().top || 0);

	const worldXBefore = (mouseX - offset.value.x) / scale.value;
	const worldYBefore = (mouseY - offset.value.y) / scale.value;

	scale.value += Math.sign(evt.deltaY) * -0.25;
	scale.value = Math.min(Math.max(0.5, scale.value), 2);

	const worldXAfter = worldXBefore * scale.value;
	const worldYAfter = worldYBefore * scale.value;

	offset.value = { x: mouseX - worldXAfter, y: mouseY - worldYAfter };
}
</script>

<style lang="less">
.flow-editor {
	width: 100%;
	height: 100%;
	// font-family: Verdana, Helvetica, sans-serif;
	// font-size: 20px;

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
		.node-title p, .node-meta-name p {
			user-select: none;
			font-size: 1.1em;
			color: #E9E9E9;
			margin: 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin: 0;
		}
		.node-meta-name p {
			font-style: italic;
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
		overflow: auto;
	}
}
</style>
