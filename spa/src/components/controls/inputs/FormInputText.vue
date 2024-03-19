<script setup lang="ts">
import Validator from '@/_common_/libraries/data-validator';
import { computed, watch } from 'vue';
import type { ZodString } from 'zod';
    defineOptions({
        inheritAttrs: false
    });

    const props = defineProps<{
        name: string,

        label: string,
        icon?: string
        help?: string,
        required?: boolean
        

        align: "left" | "right" | "center",
        size: "small" | "normal" | "large",

        schema: ZodString
    }>();

    const alignmentClassesLabel = computed(()=>{
        switch (props.align) {
            case 'left':
                return "self-start";
            case 'right':
                return "self-end";
            case 'center':
                return "self-center";
        }
    });

    const alignmentClassesInput = computed(()=>{
        switch (props.align) {
            case 'left':
                return "text-left";
            case 'right':
                return "text-right";
            case 'center':
                return "text-center";
        }
    });

    const model = defineModel<string>();

    const validator = new Validator(props.schema);
    const valid = defineModel<boolean>("valid");
    watch(model, (val)=>{
        valid.value = validator.checkValidity(val);
    });
</script>

<template>
    <div class="flex flex-col gap-2">
        <label :for="name" class="flex flex-row items-center" :class="[alignmentClassesLabel]">
            <Vector :name="icon" class="size-4 mr-1" v-if="icon && (props.align === 'left' || props.align === 'center')" />
            {{ label }}
            <Vector :name="icon" class="size-4 ml-1" v-if="icon && (props.align === 'right')" />
        </label>
        <InputText :id="name" :aria-describedby="help ? `${name}-help` : undefined" :size="(size !== 'normal') ? size : undefined" :class="[alignmentClassesInput]" v-model="model" :invalid="!!model && !valid" />
        <small :id="`${name}-help`" v-if="help" :class="[alignmentClassesLabel]">{{ help }}</small>
    </div>
</template>
