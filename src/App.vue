<template>
	<div class="sample-flow-editor">
		<h2>Sample Editor</h2>
		<div class="wrapper">
			<FlowEditor
				v-model:nodes="nodes"
				:node-types="nodeTypes"
				@update:node="updateNode"
				@create:node="createNode"
				@delete:node="deleteNode"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiArrowTopRightThinCircleOutline } from '@mdi/js';
import FlowEditor, { type Node, type NodeType } from '../lib/main';
import CreateOptionOutput from './MultipleOptionsNode/CreateOptionOutput.vue';
import EditOptionOutput from './MultipleOptionsNode/EditOptionOutput.vue';
import AddNoteToNode from './AddNoteToNode.vue';

const nodes = ref<Node[]>([{
	nodeId: 0,
	name: 'Start',
	type: 'start',
	x: 10,
	y: 10,
	outputs: [{
		name: 'Start',
		value: 'start',
		to: 1,
	}],
}, {
	nodeId: 1,
	name: 'Multiple Options',
	type: 'multiple_outputs',
	x: 200,
	y: 100,
	outputs: [{
		name: 'Default',
		value: 'default',
		to: 2,
	}, {
		name: 'Option 1',
		value: 1,
	}, {
		name: 'Option 2',
		value: 2,
	}, {
		name: 'Option 3',
		value: 3,
	}],
}, {
	nodeId: 2,
	type: 'yes_no',
	name: 'Yes or No?',
	x: 600,
	y: 300,
	outputs: [{
		name: 'Yes',
		value: 'yes',
		to: 3,
	}, {
		name: 'No',
		value: 'no',
		to: 4,
	}],
}, {
	nodeId: 3,
	type: 'quit',
	name: 'Terminal Node A',
	x: 1000,
	y: 300,
	outputs: [],
}, {
	nodeId: 4,
	type: 'quit',
	name: 'Terminal Node B',
	x: 1000,
	y: 400,
	outputs: [],
}, {
	nodeId: 5,
	type: 'multiple_outputs',
	name: 'With an extra metadata field',
	x: 1000,
	y: 600,
	outputs: [],
	meta: {
		notes: 'This is a sample note.',
	},
}]);

const nodeTypes: NodeType[] = [{
	name: 'Start',
	type: 'start',
	fill: '#388E3C',
	width: 100,
	lockedOutputs: true,
	outputs: [{
		name: 'Start',
		value: 'start',
	}],
}, {
	name: 'Quit',
	type: 'quit',
	width: 300,
	fill: '#E64A19',
	lockedOutputs: true,
	outputs: [],
}, {
	name: 'Yes/No Node',
	type: 'yes_no',
	width: 220,
	fill: '#1976D2',
	svgIcon: mdiArrowTopRightThinCircleOutline,
	lockedOutputs: true,
	outputs: [{
		name: 'Yes',
		value: 'yes',
	}, {
		name: 'No',
		value: 'no',
	}],
}, {
	name: 'Multiple Outputs',
	description: 'A node type that allows you to define your own output paths.',
	type: 'multiple_outputs',
	fill: '#512DA8',
	width: 300,
	outputs: [{
		name: 'Default',
		value: 'default',
	}],
	nodeEditComponent: AddNoteToNode,
	outputCreateComponent: CreateOptionOutput,
	outputEditComponent: EditOptionOutput,
}];

function updateNode(node: Node) {
	const idx = nodes.value.findIndex(other => other.nodeId === node.nodeId);
	if (idx !== -1) {
		nodes.value.splice(idx, 1, node);
	}
}
let newNodeCount = 1;
function createNode(node: Node) {
	newNodeCount += 1;
	node.nodeId = -1 * newNodeCount;
	nodes.value.push(node);
}

function deleteNode(node: Node) {
	nodes.value = nodes.value.filter(other => other.nodeId !== node.nodeId);
}
</script>

<style>
.sample-flow-editor {
	width: 90%;
	margin: 0 auto;
}
.wrapper {
	width: 100%;
	height: 1080px;
}

html, body, #app {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	overflow: hidden;
}
</style>
