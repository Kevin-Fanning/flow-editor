<template>
	<fieldset class="appointment-note-meta">
		<label>Add Note to this node:</label>
		<textarea
			v-model="modelValue"
			@update:model-value="updateNodeNote"
			style="resize: vertical;"
		/>
	</fieldset>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const $props = defineProps<{
	meta: {
		notes?: string;
	};
}>();

const $emit = defineEmits(['update:meta']);

const modelValue = ref($props.meta?.notes || '');

watch(() => $props.meta?.notes, (val) => {
	modelValue.value = val || '';
});

function updateNodeNote(val: string) {
	$emit('update:meta', { ...$props.meta, notes: val });
}
</script>
