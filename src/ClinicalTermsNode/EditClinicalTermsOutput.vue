<template>
	<div class="edit-clinical-terms-output">
		<fieldset role="group">
			<input
				:value="modelValue.name"
				disabled
			>
			<button
				style="background-color: var(--pico-color-red-450) !important"
				type="button"
				@click="$emit('delete')"
			>
				X
			</button>
		</fieldset>
		<fieldset style="padding-left: 48px">
			<label>
				Extra Data
				<input
					v-model="extraData"
					@update:model-value="updateMeta"
				>
			</label>
		</fieldset>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const $props = defineProps<{
	modelValue: {
		name: string;
		value: number;
		meta?: { extraData: string };
	};
}>();

const $emit = defineEmits(['delete', 'update:model-value']);

const extraData = ref<string>($props.modelValue.meta?.extraData || '');

function updateMeta(val: string) {
	$emit('update:model-value', {
		name: $props.modelValue.name,
		value: $props.modelValue.value,
		meta: {
			...($props.modelValue.meta || {}),
			extraData: val,
		},
	});
}

</script>

<style scoped>
.edit-clinical-terms-output {
	padding: 12px;
	border: 1px solid #777;
	border-radius: 4px;
	margin-bottom: 8px;
	background-color: #2f2f2f
}
</style>
