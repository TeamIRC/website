<template>
    <div ref="target">
        <slot name="selector">
            <button @click="toggle()">
                {{ label }}
            </button>
        </slot>
        <div class="overlay" v-show="show">
            <slot></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue';

defineProps({
    label: { type: String }
});

const target = ref();
const show = ref(false);
onClickOutside(target, () => { show.value = false; });

const toggle = () => show.value = !show.value;

defineExpose({ toggle });
</script>

<style scoped>
.overlay {
    position: absolute;
    width: 100%;
    z-index: 1;
    padding: 16px 0;
}

button {
    width: 100%;
    height: 64px;
    font-size: 1.66em;
    font-variant: small-caps;
}
</style>