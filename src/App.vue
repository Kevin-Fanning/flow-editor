<script setup lang="ts">
import FlowEditor from '../lib/FlowEditor.vue'
</script>

<template>
  <div class="wrapper">
    <FlowEditor />
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
