<script setup lang="ts">
import { ref, type PropType } from 'vue';
import type { Route } from '../types';

defineProps({
    routes: Array as PropType<Route[]>
});
const activeMenu = ref<number | null>(null);

const handleMouseEnter = (index: number) => {
  activeMenu.value = index;
};

const handleMouseLeave = () => {
  activeMenu.value = null;
};
</script>

<template>
    <div class="nav-item"
        v-for="(item, index) in routes"
        :key="index"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave">
        <template v-if="item.children">
            <slot name="folder" :item="item" :active="activeMenu == index"></slot>
            <div class="overlay" :class="{ active: activeMenu == index }">
                <div class="subitem"
                    v-for="(subItem, subIndex) in item.children"
                    :key="subIndex">
                    <slot name="subitem" :item="item" :subItem="subItem"></slot>
                </div>
            </div>
        </template>
        <slot v-else :item="item" :active="activeMenu == index"></slot>
    </div>
</template>

<style scoped>
.nav-item {
  position: relative;
  align-content: center;
}

.overlay {
    position: absolute;
    top: 100%;
    opacity: 0;
    visibility: hidden;
}

.overlay.active {
    opacity: 1;
    visibility: visible;
}
</style>