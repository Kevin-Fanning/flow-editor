<script setup lang="ts">
import { ref } from 'vue';
import FlowEditor, { type Node } from '../lib/FlowEditor.vue';

const nodes = ref<Node[]>([{
	nodeId: 0,
	name: 'Start',
	type: 'start',
	x: 10,
	y: 10,
	width: 100,
	outputs: [{
		name: 'Begin',
		to: 1,
	}],
}, {
	nodeId: 1,
	name: 'Provider Splitter',
	type: 'custom_outputs',
	x: 200,
	y: 100,
	width: 300,
	outputs: [{
		name: 'Default',
		to: 2,
	}, {
		name: 'Dr. Jones',
	}, {
		name: 'Fred Savage',
	}, {
		name: 'Robert Windham',
	}],
}, {
	nodeId: 2,
	type: 'prompt',
	name: 'Direct Referral',
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
	name: 'DNP (Direct New Patient)',
	x: 1000,
	y: 300,
	width: 300,
	outputs: [],
}, {
	nodeId: 4,
	type: 'exit',
	name: 'NP (New Patient)',
	x: 1000,
	y: 400,
	width: 300,
	outputs: [],
}]);
</script>

<template>
	<div class="wrapper">
		<FlowEditor v-model:nodes="nodes" />
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
