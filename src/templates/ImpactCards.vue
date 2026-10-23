<script setup lang="ts">
import { computed, getCurrentInstance, ref, toRaw, watch } from 'vue';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  FaBullhorn, FaChartBar, FaChild, FaComments, FaEye,
  FaFlag, FaGraduationCap, FaMicrophone, FaUsers, FaUserTie, FaVideo,
} from 'oh-vue-icons/icons';
import AnimatedNumber from '../components/AnimatedNumber.vue';
import type { ImpactCardsContent, ImpactMetric } from '../types';

addIcons(
  FaBullhorn, FaChartBar, FaChild, FaComments, FaEye,
  FaFlag, FaGraduationCap, FaMicrophone, FaUsers, FaUserTie, FaVideo,
);

const props = defineProps<{ content: ImpactCardsContent; edit: boolean }>();
const emit = defineEmits<{
  (event: 'modified', template: string, content: ImpactCardsContent): void;
}>();

const cloneContent = (content: ImpactCardsContent) => structuredClone(toRaw(content));
const draft = ref(cloneContent(props.content));
const selectedPeriodIndex = ref(Math.max(draft.value.periods.length - 1, 0));
const selectedPeriod = computed(() => draft.value.periods[selectedPeriodIndex.value]);
const instanceId = `impact-cards-${getCurrentInstance()!.uid}`;
const icons = [
  { value: 'fa-chart-bar', label: 'Chiffres' },
  { value: 'fa-comments', label: 'Ateliers et échanges' },
  { value: 'fa-child', label: 'Enfants' },
  { value: 'fa-users', label: 'Publics et familles' },
  { value: 'fa-bullhorn', label: 'Publications' },
  { value: 'fa-video', label: 'Films et contenus vidéo' },
  { value: 'fa-eye', label: 'Spectateurs' },
  { value: 'fa-flag', label: 'Projets et événements' },
  { value: 'fa-graduation-cap', label: 'Étudiants' },
  { value: 'fa-user-tie', label: 'Professionnels' },
  { value: 'fa-microphone', label: 'Invités' },
];

watch(() => props.content, content => {
  draft.value = cloneContent(content);
});

watch(() => draft.value.periods.length, length => {
  selectedPeriodIndex.value = Math.min(selectedPeriodIndex.value, Math.max(length - 1, 0));
});

watch(() => props.edit, (editing, wasEditing) => {
  if (!editing && wasEditing && JSON.stringify(draft.value) !== JSON.stringify(props.content)) {
    emit('modified', 'ImpactCards', cloneContent(draft.value));
  }
});

const newMetric = (): ImpactMetric => ({ value: 0, label: '', icon: 'fa-chart-bar' });

function addPeriod() {
  draft.value.periods.push({ label: '', items: [newMetric()] });
  selectedPeriodIndex.value = draft.value.periods.length - 1;
}

function removePeriod(index: number) {
  draft.value.periods.splice(index, 1);
  if (index < selectedPeriodIndex.value) selectedPeriodIndex.value--;
}

function addHighlight() {
  (draft.value.highlights ??= []).push({
    ...newMetric(), period: '', status: 'programmed',
  });
}

</script>

<template>
  <section class="impact-cards" :aria-labelledby="`${instanceId}-title`">
    <template v-if="edit">
      <h2 :id="`${instanceId}-title`">Éditer les cartes d’impact</h2>
      <div class="impact-fields impact-general">
        <label>Titre<input v-model="draft.title" placeholder="Quelques chiffres" /></label>
        <label>Description<textarea v-model="draft.subtitle" rows="2" /></label>
      </div>

      <fieldset v-for="(period, periodIndex) in draft.periods" :key="periodIndex" class="impact-period-editor">
        <legend>Bilan {{ periodIndex + 1 }}</legend>
        <label>Période<input v-model="period.label" placeholder="2024/2025" /></label>
        <div v-for="(metric, metricIndex) in period.items" :key="metricIndex" class="impact-metric-editor">
          <div class="impact-fields">
            <label>Valeur<input v-model.number="metric.value" type="number" min="0" step="1" /></label>
            <label>Libellé<input v-model="metric.label" placeholder="enfants" /></label>
            <label>Pictogramme<select v-model="metric.icon">
              <option value="">Automatique</option>
              <option v-for="icon in icons" :key="icon.value" :value="icon.value">{{ icon.label }}</option>
            </select></label>
          </div>
          <button type="button" class="impact-remove" :aria-label="`Supprimer l’indicateur ${metricIndex + 1} du bilan ${periodIndex + 1}`" @click="period.items.splice(metricIndex, 1)">Supprimer l’indicateur</button>
        </div>
        <div class="impact-actions">
          <button type="button" @click="period.items.push(newMetric())">Ajouter un indicateur</button>
          <button type="button" class="impact-remove" @click="removePeriod(periodIndex)">Supprimer ce bilan</button>
        </div>
      </fieldset>
      <button type="button" @click="addPeriod">Ajouter un bilan</button>

      <h3>Actions programmées ou en cours</h3>
      <fieldset v-for="(highlight, index) in draft.highlights" :key="index" class="impact-period-editor">
        <legend>Action {{ index + 1 }}</legend>
        <div class="impact-fields">
          <label>Période<input v-model="highlight.period" placeholder="2025" /></label>
          <label>Statut<select v-model="highlight.status"><option value="programmed">Programmé</option><option value="ongoing">En cours</option></select></label>
          <label>Valeur<input v-model.number="highlight.value" type="number" min="0" step="1" /></label>
          <label>Libellé<input v-model="highlight.label" placeholder="modules programmés" /></label>
        </div>
        <button type="button" class="impact-remove" @click="draft.highlights?.splice(index, 1)">Supprimer cette action</button>
      </fieldset>
      <button type="button" @click="addHighlight">Ajouter une action</button>
    </template>

    <template v-else>
      <header class="impact-header">
        <div>
          <h2 :id="`${instanceId}-title`">{{ draft.title || 'Quelques chiffres' }}</h2>
          <p v-if="draft.subtitle" class="impact-subtitle">{{ draft.subtitle }}</p>
        </div>
        <label v-if="draft.periods.length > 1" class="impact-period-choice" :for="`${instanceId}-period`">
          Bilan de la période
          <select :id="`${instanceId}-period`" v-model.number="selectedPeriodIndex">
            <option v-for="(period, index) in draft.periods" :key="index" :value="index">{{ period.label }}</option>
          </select>
        </label>
        <p v-else-if="selectedPeriod" class="impact-single-period">Bilan {{ selectedPeriod.label }}</p>
      </header>

      <dl v-if="selectedPeriod?.items.length" class="impact-grid" aria-live="polite" aria-atomic="true">
        <div v-for="(metric, index) in selectedPeriod.items" :key="`${selectedPeriodIndex}-${index}`" class="impact-card">
          <dt>{{ metric.label }}</dt>
          <dd><AnimatedNumber :value="metric.value" /></dd>
          <OhVueIcon class="impact-icon" :name="metric.icon || 'fa-chart-bar'" :scale="1.1" aria-hidden="true" />
        </div>
      </dl>
      <p v-else class="impact-empty">Aucun chiffre renseigné pour cette période.</p>

      <div v-for="(highlight, index) in draft.highlights" :key="index" class="impact-highlight">
        <span class="impact-status">{{ highlight.status === 'ongoing' ? 'En cours' : 'Programmation' }} {{ highlight.period }}</span>
        <span><strong><AnimatedNumber :value="highlight.value" /></strong> {{ highlight.label }}</span>
      </div>
    </template>
  </section>
</template>

<style scoped>
.impact-cards {
  --impact-bg: var(--card-bg-alt);
  --impact-soft: var(--card-bg-alt);
  --impact-border: var(--card-bg);
  --impact-green: var(--valid-text);
  --impact-green-bg: var(--valid-bg);
  box-sizing: border-box;
  width: calc(100% - 2rem);
  padding: 0;
  color: var(--impact-text);
  text-align: left;
}

.impact-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem; margin-bottom: 1.5rem; }
.impact-cards h2 { margin: 0; padding: 0 !important; color: var(--impact-blue); font-family: 'NeuePlak-Bold', sans-serif; font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.2; }
.impact-subtitle { margin: .5rem 0 0; color: var(--impact-secondary); }
.impact-period-choice { display: flex; align-items: center; gap: .75rem; color: var(--impact-secondary); font-size: .875rem; }
.impact-period-choice select { min-height: 44px; padding: .5rem .75rem; border: 1px solid var(--impact-border); border-radius: 10px; background: var(--impact-bg); color: var(--impact-blue); font: inherit; font-size: 1rem; }
.impact-single-period { margin: 0; color: var(--impact-secondary); }
.impact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr)); gap: .75rem; margin: 0; }
.impact-card { position: relative; display: flex; flex-direction: column; padding: 1.25rem 1rem; border-radius: 13px; border: 1px solid var(--impact-border); background: var(--impact-soft); min-width: 0; }
.impact-card dt { order: 2; font-size: 1rem; color: var(--impact-secondary); overflow-wrap: anywhere; }
.impact-card dd { margin: .5rem 0 0; color: var(--impact-blue); font-family: 'NeuePlak-Bold', sans-serif; font-size: clamp(2.25rem, 5vw, 3.5rem); line-height: 1.15; overflow-wrap: anywhere; }
.impact-icon { order: -1; color: var(--impact-blue); flex-shrink: 0; }
.impact-highlight { display: flex; align-items: center; flex-wrap: wrap; gap: .75rem; padding: .875rem 1rem; margin-top: 1.25rem; border-radius: 12px; background: var(--impact-green-bg); color: var(--impact-green); }
.impact-highlight strong { font-size: 1.25rem; font-family: 'NeuePlak-Bold', sans-serif; }
.impact-status { padding: .15rem .4rem; border: 1px solid currentColor; border-radius: 6px; font-size: .875rem; }
.impact-empty { color: var(--impact-secondary); }
.impact-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: .875rem; }
.impact-general { margin-top: 1.25rem; }
.impact-cards label { min-width: 0; }
.impact-fields label, .impact-period-editor > label { display: flex; flex-direction: column; gap: .375rem; }
.impact-fields input, .impact-fields select, .impact-fields textarea, .impact-period-editor > label input { box-sizing: border-box; width: 100%; min-height: 44px; padding: .625rem .75rem; font: inherit; font-size: 1rem; color: var(--impact-text); background: var(--impact-bg); border: 1px solid var(--impact-border); border-radius: 8px; }
.impact-fields textarea { resize: vertical; }
.impact-period-editor { min-width: 0; margin: 1.25rem 0; padding: 1rem; border: 1px solid var(--impact-border); border-radius: 12px; }
.impact-period-editor legend { padding: 0 .375rem; font-family: 'NeuePlak-Bold', sans-serif; }
.impact-metric-editor { padding: 1rem 0; border-bottom: 1px solid var(--impact-border); }
.impact-metric-editor button, .impact-period-editor > button { margin-top: .75rem; }
.impact-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 1rem; }
.impact-cards button { padding: .625rem .875rem; min-height: 44px; border: 1px solid var(--impact-border); border-radius: 8px; color: var(--impact-blue); background: var(--impact-soft); font: inherit; cursor: pointer; }
.impact-cards button:hover { background: var(--impact-border); }
.impact-cards .impact-remove { color: var(--impact-secondary); background: var(--impact-bg); }

@media (max-width: 520px) {
  .impact-grid { grid-template-columns: 1fr; }
  .impact-card { padding: 1rem 1rem 1rem 3.5rem; }
  .impact-card dd { margin-top: 0; font-size: 2.25rem; }
  .impact-icon { position: absolute; left: 1rem; top: 1.75rem; }
  .impact-header { align-items: start; }
}
</style>
