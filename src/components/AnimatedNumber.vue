<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTransition } from '@vueuse/core';

const props = defineProps<{ value: number }>();
const source = ref(0);
const animatedValue = useTransition(source, { duration: 1500 });
const numberFormat = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

watch(() => props.value, value => {
  source.value = value;
}, { immediate: true });
</script>

<template>{{ numberFormat.format(animatedValue) }}</template>
