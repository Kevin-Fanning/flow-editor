<template>
	<div class="delete-dialog-container">
		<div class="delete-dialog-shade" />
		<div class="delete-dialog">
			<h3>Delete Node?</h3>
			<p>Really delete node "{{ $props.name }}"?</p>
			<div style="display: flex">
				<button
					style="flex: 1 1 auto;"
					@click="$emit('cancel')"
				>
					Cancel
				</button>
				<button
					class="primary"
					style="flex: 1 1 auto;"
					@click="$emit('delete')"
				>
					Delete
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

defineProps<{
	nodeId: number;
	name: string;
}>();

defineEmits(['cancel', 'delete']);
</script>

<style scoped lang="less">
.delete-dialog-container {
	width: 100%;
	height: 100vh;
	position: absolute;
	left: 0;
	top: 0;
	margin: 0;
	padding: 0;

	.delete-dialog-shade {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.delete-dialog {
		background-color: var(--fe-color-primary-dark);
		width: 400px;
		min-height: 50px;
		position: absolute;
		left: 50%;
		top: 50%;
		border: 1px solid var(--fe-color-text);
		border-radius: 8px;
		transform: translate(-50%, -50%);
		padding: 0 24px 0 24px;
	}
}
</style>
