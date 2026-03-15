<script setup lang="ts">
import { ref } from 'vue';
import FlowEditor, { type Node, type NodeType } from '../lib/main';
import CreateClinicalTermsOutput from './ClinicalTermsNode/CreateClinicalTermsOutput.vue';
import EditClinicalTermsOutput from './ClinicalTermsNode/EditClinicalTermsOutput.vue';
import AddAppointmentNote from './AddAppointmentNote.vue';

const nodes = ref<Node[]>([{
	nodeId: 0,
	name: 'Start',
	type: 'start',
	x: 10,
	y: 10,
	width: 100,
	outputs: [{
		name: 'Start',
		value: 'start',
		to: 1,
	}],
}, {
	nodeId: 1,
	name: 'Clinical Terms',
	type: 'clinical_terms',
	x: 200,
	y: 100,
	width: 300,
	outputs: [{
		name: 'Default',
		value: 'default',
		to: 2,
	}, {
		name: 'Knee Pain',
		value: 1,
	}, {
		name: 'Arm Pain',
		value: 2,
	}, {
		name: 'Foot Pain',
		value: 3,
	}],
}, {
	nodeId: 2,
	type: 'direct_referral',
	name: 'Direct Referral',
	prompt: 'Does the patient have a direct referral?',
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
	name: 'DNP (Direct New Patient)',
	x: 1000,
	y: 300,
	width: 300,
	outputs: [],
}, {
	nodeId: 4,
	type: 'quit',
	name: 'NP (New Patient)',
	x: 1000,
	y: 400,
	width: 300,
	outputs: [],
}, {
	nodeId: 5,
	type: 'clinical_terms',
	name: 'Clinical Terms 2',
	x: 1000,
	y: 600,
	width: 300,
	outputs: [],
	meta: {
		appointmentNote: 'asdf',
	},
}]);

const nodeTypes: NodeType[] = [{
	name: 'Start',
	type: 'start',
	lockedOutputs: true,
	outputs: [{
		name: 'Start',
		value: 'start',
	}],
}, {
	name: 'Quit',
	type: 'quit',
	lockedOutputs: true,
	outputs: [],
}, {
	name: 'Direct Referral',
	type: 'direct_referral',
	lockedOutputs: true,
	outputs: [{
		name: 'Yes',
		value: 'yes',
	}, {
		name: 'No',
		value: 'no',
	}],
}, {
	name: 'Clinical Terms',
	type: 'clinical_terms',
	outputs: [{
		name: 'Default',
		value: 'default',
	}],
	nodeEditComponent: AddAppointmentNote,
	outputCreateComponent: CreateClinicalTermsOutput,
	outputEditComponent: EditClinicalTermsOutput,
}];

function updateNode(node: Node) {
	const idx = nodes.value.findIndex(other => other.nodeId === node.nodeId);
	if (idx !== -1) {
		nodes.value.splice(idx, 1, node);
	}
}
</script>

<template>
	<div class="wrapper">
		<FlowEditor
			v-model:nodes="nodes"
			:node-types="nodeTypes"
			@update:node="updateNode"
		/>
	</div>
</template>

<style>
.wrapper {
  width: 100%;
  height: 100%;
}

html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
