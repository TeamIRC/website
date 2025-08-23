<script setup lang="ts">
import Footer2 from "./components/Footer2.vue";
import Navigation from "./components/Navigation.vue";
</script>

<template>
  <Navigation />
  <router-view v-slot="{ Component }">
    <template v-if="Component">
        <KeepAlive>
            <Suspense>
                <component :is="Component" :key="$route.path" />
                <template #fallback>
                    Chargement...
                </template>
            </Suspense>
        </KeepAlive>
    </template>
  </router-view>
  <Footer2 />
</template>