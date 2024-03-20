<script setup lang="ts">
    import Toast from 'primevue/toast';
    import DynamicDialog from 'primevue/dynamicdialog';
    import useBusyStatus from '@/framework/libraries/busy-status';
    import { storeToRefs } from 'pinia';

    const {busy} = storeToRefs(useBusyStatus());
</script>

<template>
    <Toast />
    <DynamicDialog />
    <BlockUI :blocked="busy" full-screen/>
</template>
