<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref, toRaw, watch } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  FaBriefcase, FaCheckDouble, FaChevronRight, FaCopyright, FaEye,
  FaHeart, FaLeaf, FaLock, FaFileAlt, FaUsers,
} from 'oh-vue-icons/icons';
import type { VerticalTabsContent, VerticalTabsItem } from '../types';

addIcons(
  FaBriefcase, FaCheckDouble, FaChevronRight, FaCopyright, FaEye,
  FaHeart, FaLeaf, FaLock, FaFileAlt, FaUsers,
);

const props = defineProps<{ content: VerticalTabsContent; edit: boolean }>();
const emit = defineEmits<{
  (event: 'modified', template: string, content: VerticalTabsContent): void;
}>();

const cloneContent = (content: VerticalTabsContent) => structuredClone(toRaw(content));
const draft = ref(cloneContent(props.content));
const selectedIndex = ref(0);
const selectedItem = computed(() => draft.value.items[selectedIndex.value]);
const tabButtons = ref<HTMLButtonElement[]>([]);
const compact = useMediaQuery('(max-width: 720px)');
const instanceId = `vertical-tabs-${getCurrentInstance()!.uid}`;
const tabId = (index: number) => `${instanceId}-tab-${index}`;
const panelId = `${instanceId}-panel`;

const legacyIcons: Record<string, string> = {
  '🔒': 'fa-lock', '👁️': 'fa-eye', '👁': 'fa-eye', '❤️': 'fa-heart',
  '❤': 'fa-heart', '👥': 'fa-users', '©️': 'fa-copyright', '©': 'fa-copyright',
  '💼': 'fa-briefcase', '🌱': 'fa-leaf',
};
const availableIcons = new Set([
  'fa-lock', 'fa-eye', 'fa-heart', 'fa-users', 'fa-copyright',
  'fa-briefcase', 'fa-leaf', 'fa-file-alt',
]);
function resolveIcon(icon?: string): string | undefined {
  if (!icon) return 'fa-file-alt';
  return availableIcons.has(icon) ? icon : legacyIcons[icon];
}

watch(() => props.content, content => {
  draft.value = cloneContent(content);
});

watch(() => draft.value.items.length, length => {
  selectedIndex.value = Math.min(selectedIndex.value, Math.max(length - 1, 0));
});

watch(() => props.edit, (editing, wasEditing) => {
  if (!editing && wasEditing && JSON.stringify(draft.value) !== JSON.stringify(props.content)) {
    emit('modified', 'VerticalTabs', cloneContent(draft.value));
  }
});

function onTabKeydown(event: KeyboardEvent) {
  const length = draft.value.items.length;
  if (!length) return;
  let index = selectedIndex.value;
  if (event.key === 'Home') index = 0;
  else if (event.key === 'End') index = length - 1;
  else if (event.key === (compact.value ? 'ArrowRight' : 'ArrowDown')) index = (index + 1) % length;
  else if (event.key === (compact.value ? 'ArrowLeft' : 'ArrowUp')) index = (index + length - 1) % length;
  else return;
  event.preventDefault();
  selectedIndex.value = index;
  nextTick(() => tabButtons.value[index]?.focus());
}

function addItem() {
  draft.value.items.push({ title: 'Nouveau thème', description: '', icon: 'fa-file-alt', tips: [] });
  selectedIndex.value = draft.value.items.length - 1;
}

function removeItem(index: number) {
  draft.value.items.splice(index, 1);
  if (index < selectedIndex.value) selectedIndex.value--;
}

function moveItem(index: number, direction: number) {
  const destination = index + direction;
  if (destination < 0 || destination >= draft.value.items.length) return;
  const items = draft.value.items;
  [items[index], items[destination]] = [items[destination], items[index]];
  if (selectedIndex.value === index) selectedIndex.value = destination;
  else if (selectedIndex.value === destination) selectedIndex.value = index;
}

function addTip(item: VerticalTabsItem) {
  (item.tips ??= []).push('');
}
</script>

<template>
  <section class="vertical-tabs"
    :aria-labelledby="edit || draft.title ? `${instanceId}-title` : undefined"
    :aria-label="!edit && !draft.title ? 'Exploration de thèmes' : undefined">
    <template v-if="edit">
      <h2 :id="`${instanceId}-title`" class="vertical-tabs-editor-heading">Éditer les thèmes</h2>
      <div class="vertical-tabs-fields">
        <label>Titre de la section<input v-model="draft.title" /></label>
        <label>Sous-titre<textarea v-model="draft.subtitle" rows="2" /></label>
      </div>
      <fieldset v-for="(item, index) in draft.items" :key="index" class="vertical-tabs-editor">
        <legend>Thème {{ index + 1 }}</legend>
        <div class="vertical-tabs-fields">
          <label>Titre du thème<input v-model="item.title" /></label>
          <label>Libellé du menu<input v-model="item.label" placeholder="Titre court (facultatif)" /></label>
          <label>Icône<input v-model="item.icon" placeholder="Emoji ou fa-lock, fa-eye, fa-heart…" /></label>
          <label>Image<input v-model="item.image" placeholder="URL de l’image (facultatif)" /><span class="vertical-tabs-field-hint">Active l’affichage avec image de fond et légende.</span></label>
        </div>
        <label>Description<textarea v-model="item.description" rows="4" /></label>
        <div class="vertical-tabs-tip-editor" v-for="(_, tipIndex) in item.tips" :key="tipIndex">
          <label>Conseil {{ tipIndex + 1 }}<textarea v-model="item.tips![tipIndex]" rows="2" /></label>
          <button type="button" class="vertical-tabs-remove" :aria-label="`Supprimer le conseil ${tipIndex + 1} du thème ${index + 1}`" @click="item.tips?.splice(tipIndex, 1)">Supprimer</button>
        </div>
        <div class="vertical-tabs-actions">
          <button type="button" @click="addTip(item)">Ajouter un conseil</button>
          <button type="button" :disabled="index === 0" :aria-label="`Monter le thème ${index + 1}`" @click="moveItem(index, -1)">Monter</button>
          <button type="button" :disabled="index === draft.items.length - 1" :aria-label="`Descendre le thème ${index + 1}`" @click="moveItem(index, 1)">Descendre</button>
          <button type="button" class="vertical-tabs-remove" @click="removeItem(index)">Supprimer ce thème</button>
        </div>
      </fieldset>
      <button type="button" @click="addItem">Ajouter un thème</button>
    </template>

    <template v-else>
      <header v-if="draft.title || draft.subtitle" class="vertical-tabs-header">
        <h2 v-if="draft.title" :id="`${instanceId}-title`">{{ draft.title }}</h2>
        <p v-if="draft.subtitle">{{ draft.subtitle }}</p>
      </header>
      <div v-if="selectedItem" class="vertical-tabs-layout">
        <div class="vertical-tabs-menu" role="tablist"
          :aria-label="draft.title || 'Choisir un thème'"
          :aria-orientation="compact ? 'horizontal' : 'vertical'"
          @keydown="onTabKeydown">
          <button v-for="(item, index) in draft.items" :key="index"
            :ref="el => { tabButtons[index] = el as HTMLButtonElement }"
            type="button" role="tab" class="vertical-tabs-tab"
            :id="tabId(index)" :aria-controls="panelId"
            :aria-selected="selectedIndex === index"
            :tabindex="selectedIndex === index ? 0 : -1"
            @click="selectedIndex = index">
            <OhVueIcon v-if="resolveIcon(item.icon)" :name="resolveIcon(item.icon)!" class="vertical-tabs-menu-icon" aria-hidden="true" />
            <span v-else class="vertical-tabs-menu-icon" aria-hidden="true">{{ item.icon }}</span>
            <span>{{ item.label || item.title || `Thème ${index + 1}` }}</span>
            <OhVueIcon name="fa-chevron-right" class="vertical-tabs-arrow" aria-hidden="true" />
          </button>
        </div>
        <article class="vertical-tabs-panel" :class="{ 'vertical-tabs-panel-with-image': selectedItem.image }" role="tabpanel" :id="panelId"
          :aria-labelledby="tabId(selectedIndex)" tabindex="0">
          <img v-if="selectedItem.image" :src="selectedItem.image" alt="" class="vertical-tabs-backdrop" />
          <h3 v-else>{{ selectedItem.title }}</h3>
          <div v-if="selectedItem.description || selectedItem.tips?.length" :class="{ 'vertical-tabs-caption': selectedItem.image }">
            <div v-if="selectedItem.description" class="vertical-tabs-description" v-html="selectedItem.description"></div>
            <div v-if="selectedItem.tips?.length" class="vertical-tabs-tips">
              <h4><OhVueIcon name="fa-check-double" aria-hidden="true" />Les bons réflexes</h4>
              <ul><li v-for="(tip, index) in selectedItem.tips" :key="index">{{ tip }}</li></ul>
            </div>
          </div>
        </article>
      </div>
      <p v-else class="vertical-tabs-empty">Aucun thème renseigné pour le moment.</p>
    </template>
  </section>
</template>

<style scoped>
.vertical-tabs {
  --tabs-bg: var(--card-bg-alt);
  --tabs-border: var(--card-bg);
  --tabs-hovered: var(--card-bg);
  --tabs-hovered-text: var(--card-bg-alt);
  --tabs-selected: var(--card-bg-alt);
  --tabs-selected-text: var(--card-bg);
  --tabs-green: var(--valid-bg);
  width: calc(100% - 2rem);
  padding: 0;
  color: var(--tabs-text);
  text-align: left;
  overflow-wrap: anywhere;
}

.vertical-tabs-header { margin-bottom: 1.5rem; }
.vertical-tabs .vertical-tabs-editor-heading,
.vertical-tabs .vertical-tabs-header h2 { padding-bottom: 0; font-size: clamp(1.4rem, 3vw, 1.8rem); line-height: 1.25; }
.vertical-tabs-header p { margin-top: .75rem; max-width: 65ch; color: var(--tabs-text); line-height: 1.65; }
.vertical-tabs-layout { display: grid; grid-template-columns: 210px minmax(0, 1fr); align-items: start; }
.vertical-tabs-menu { display: grid; min-width: 0; }
.vertical-tabs-menu :first-child { border-radius: 16px 0 0 0; }
.vertical-tabs-menu :last-child { border-radius: 0 0 0 16px; }
.vertical-tabs-tab { display: flex; align-items: center; gap: .7rem; width: 100%; min-height: 56px; padding: .8rem .9rem; outline: 1px solid var(--tabs-border); border: none; background: transparent; color: var(--tabs-text); text-align: left; font: inherit; font-size: .95rem; line-height: 1.35; cursor: pointer; }
.vertical-tabs-menu-icon { width: 19px; height: 19px; flex-shrink: 0; text-align: center; }
.vertical-tabs-arrow { width: 12px; height: 12px; margin-left: auto; flex-shrink: 0; opacity: 0; }
.vertical-tabs-tab[aria-selected="true"] { background: var(--tabs-selected); color: var(--tabs-selected-text); }
.vertical-tabs-tab[aria-selected="true"] .vertical-tabs-arrow { opacity: 1; }
.vertical-tabs-tab:hover:not([aria-selected="true"]) { background: var(--tabs-hovered); color: var(--tabs-hovered-text); }
.vertical-tabs-panel { min-width: 0; min-height: 440px; padding: clamp(1.25rem, 3vw, 2rem); outline: 1px solid var(--tabs-border); border-radius: 0 16px 16px 16px; background: var(--tabs-bg); }
.vertical-tabs-panel-heading { display: flex; align-items: center; gap: .8rem; margin-bottom: 1.2rem; }
.vertical-tabs-detail-icon { display: grid; place-items: center; flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px; background: var(--tabs-blue-soft); color: var(--tabs-blue); font-size: 1.4rem; }
.vertical-tabs-counter { color: var(--tabs-secondary); font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; }
.vertical-tabs-panel h3 { font-size: clamp(1.2rem, 2.5vw, 1.5rem); line-height: 1.3; }
.vertical-tabs-description { margin-top: 1rem; max-width: 75ch; color: var(--tabs-secondary); line-height: 1.7; }
.vertical-tabs-description :deep(ul), .vertical-tabs-description :deep(ol) { padding-left: 1.4rem; }
.vertical-tabs-description :deep(a) { color: var(--tabs-blue); }
.vertical-tabs-panel-with-image { position: relative; isolation: isolate; display: flex; align-items: flex-end; justify-content: flex-end; width: 100%; aspect-ratio: 16 / 10; overflow: hidden; padding: 1.5rem; }
.vertical-tabs-backdrop { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; object-fit: cover; }
.vertical-tabs-caption { max-width: min(32rem, 100%); padding: 1rem 1.25rem; border: 1px solid rgb(255 255 255 / 20%); border-radius: 12px; background: rgb(12 28 42 / 90%); color: #fff; }
.vertical-tabs-caption .vertical-tabs-description { margin-top: 0; max-width: none; color: inherit; }
.vertical-tabs-caption .vertical-tabs-description :deep(a) { color: inherit; text-decoration: underline; }
.vertical-tabs-caption .vertical-tabs-tips { border-color: rgb(255 255 255 / 25%); }
.vertical-tabs-caption .vertical-tabs-tips h4 { color: inherit; }
.vertical-tabs-caption .vertical-tabs-tips li::marker { color: inherit; }
.vertical-tabs-tips { margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--tabs-border); }
.vertical-tabs-tips h4 { display: flex; align-items: center; gap: .6rem; margin-bottom: .8rem; color: var(--tabs-green); }
.vertical-tabs-tips ul { display: grid; gap: .7rem; padding-left: 1.2rem; max-width: 75ch; line-height: 1.6; }
.vertical-tabs-tips li::marker { color: var(--tabs-green); }
.vertical-tabs-empty { padding: 1rem 0; color: var(--tabs-secondary); }
.vertical-tabs-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin: 1rem 0; }
.vertical-tabs label { display: flex; flex-direction: column; gap: .4rem; min-width: 0; line-height: 1.5; }
.vertical-tabs-field-hint { font-size: .85rem; color: var(--tabs-secondary); }
.vertical-tabs input, .vertical-tabs textarea { width: 100%; min-width: 0; padding: .7rem; border: 1px solid var(--tabs-border); border-radius: 8px; background: var(--tabs-bg); color: var(--tabs-text); font: inherit; font-size: 1rem; }
.vertical-tabs textarea { resize: vertical; }
.vertical-tabs-editor { min-width: 0; padding: 1.25rem; margin: 1.5rem 0; border: 1px solid var(--tabs-border); border-radius: 12px; }
.vertical-tabs-editor legend { padding: 0 .5rem; font-family: NeuePlak-Bold, sans-serif; }
.vertical-tabs-tip-editor { display: flex; gap: .8rem; align-items: end; margin-top: 1rem; }
.vertical-tabs-tip-editor label { flex: 1; }
.vertical-tabs-actions { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: 1rem; }
.vertical-tabs button:not(.vertical-tabs-tab) { padding: .65rem .8rem; min-height: 44px; border: 1px solid var(--tabs-border); border-radius: 8px; background: var(--tabs-bg); color: var(--tabs-blue); font: inherit; cursor: pointer; }
.vertical-tabs button.vertical-tabs-remove { color: var(--red-dk-2); }
:global(html.dark .vertical-tabs button.vertical-tabs-remove) { color: var(--red-lt-3); }
.vertical-tabs button:disabled { opacity: .4; cursor: default; }
.vertical-tabs button:focus-visible, .vertical-tabs-panel:focus-visible { outline: 3px solid var(--tabs-blue); outline-offset: 3px; }

@media (max-width: 720px) {
  .vertical-tabs { width: calc(100% - 1rem); }
  .vertical-tabs-layout { grid-template-columns: minmax(0, 1fr); gap: 1rem; }
  .vertical-tabs-menu { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; }
  .vertical-tabs-tab { min-height: 48px; gap: .5rem; padding: .6rem; font-size: .85rem; border-color: var(--tabs-border); background: var(--tabs-bg); }
  .vertical-tabs-arrow { display: none; }
  .vertical-tabs-panel { min-height: 0; padding: 1.1rem; }
  .vertical-tabs-panel-with-image { min-height: 320px; aspect-ratio: 4 / 3; padding: 1rem; }
  .vertical-tabs-caption { padding: .85rem 1rem; }
  .vertical-tabs-fields { grid-template-columns: minmax(0, 1fr); }
  .vertical-tabs-tip-editor { flex-direction: column; align-items: stretch; }
}
</style>
