<template>
	<div class="clinical-terms-create-output">
		<h4>Add Clinical Term</h4>
		<select v-model="selected">
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value"
			>
				{{ option.name }}
			</option>
		</select>
		<button
			@click="add"
			type="button"
		>
			Add
		</button>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const $props = defineProps<{
	existing: {
		name: string;
		value: string | boolean | number;
	}[];
}>();

const $emit = defineEmits(['update:model-value']);

const options = [{
	name: 'Knee Pain',
	value: 1,
}, {
	name: 'Arm Pain',
	value: 2,
}, {
	name: 'Leg Pain',
	value: 3,
}];

const selected = ref<number | null>(null);

function add() {
	const item = options.find(option => option.value === selected.value);
	if ($props.existing.find(other => other.value === selected.value)) {
		return;
	}
	$emit('update:model-value', item);
}

</script>
