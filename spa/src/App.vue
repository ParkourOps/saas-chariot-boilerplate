<script setup lang="ts">
import TheTopBar from './components/TheTopBar.vue';
const route = useRoute();
</script>

<template>
    <TheTopBar v-show="route.meta.showTopBar" />
    
    <RouterView />
</template>

