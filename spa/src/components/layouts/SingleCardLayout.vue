<script setup lang="ts">
</script>

<template>
    <section>
        <Card class="max-w-md mx-auto sm:mt-12 overflow-hidden">
            <template #header>
                <slot name="header" />
            </template>
            <template #content>
                <slot />
            </template>
            <template #footer>
                <slot name="footer" />
            </template>
        </Card>
    </section>
</template>
