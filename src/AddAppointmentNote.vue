<template>
	<fieldset class="appointment-note-meta">
		<label>Add appointment note</label>
		<textarea
			v-model="modelValue"
			@update:model-value="updateAppointmentNote"
		/>
	</fieldset>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const $props = defineProps<{
	meta: {
		appointmentNote?: string;
	};
}>();

const $emit = defineEmits(['update:meta']);

const modelValue = ref($props.meta?.appointmentNote || '');

watch(() => $props.meta?.appointmentNote, (val) => {
	modelValue.value = val || '';
});

function updateAppointmentNote(val: string) {
	$emit('update:meta', { ...$props.meta, appointmentNote: val });
}
</script>
