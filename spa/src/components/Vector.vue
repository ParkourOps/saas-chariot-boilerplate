<script setup lang="ts" generic="T extends string">
  import { defineAsyncComponent } from 'vue';

  defineOptions({
    inheritAttrs: false,
  });

    const props = defineProps<{
        name: T,
    }>();

    const component = defineAsyncComponent(() => import(`@/assets/images/svg/${props.name}.svg`));
  </script>

<template>
    <div class="max-h-full max-w-full inline-block leading-none">
        <component :is="component" :class="$attrs.class"/>
    </div>
</template>
