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
import { ref } from 'vue';

const $props = defineProps<{
	meta: Record<string, unknown>;
}>();

const $emit = defineEmits(['update:meta']);

const modelValue = ref(($props.meta?.appointmentNote as string) || '');

function updateAppointmentNote(val: string) {
	$emit('update:meta', { ...$props.meta, appointmentNote: val });
}
</script>
