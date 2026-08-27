<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { Base, default as templates } from "../templates";
import type { PageData, TemplateItem } from "../types";

const route = useRoute();
const { root, page, title } = route.meta;
const pageData = await import(`../pages/${root}/${page}.json`) as PageData;
const edit = ref(false);
localStorage.setItem('origin', route.fullPath);
const login = localStorage.getItem('login');

// Enhanced data handling for both single template and template arrays
const isTemplateArray = computed(() => {
	return pageData.templates && Array.isArray(pageData.templates) && pageData.templates.length > 0;
});

const templateItems = computed(() => {
	if (isTemplateArray.value) {
		return pageData.templates!;
	} else if (pageData.template || pageData.content) {
		// Backward compatibility: convert single template to array format
		return [{
			template: pageData.template || '',
			content: pageData.content,
			id: 'single-template'
		}] as TemplateItem[];
	}
	return [];
});

const hasValidTemplates = computed(() => {
	return templateItems.value.length > 0;
});

// Validation for template items
const validateTemplateItem = (item: TemplateItem): boolean => {
	if (!item) return false;

	// Check if template name is valid (either exists in templates or is empty for Base fallback)
	if (item.template && !templates[item.template]) {
		console.warn(`Template "${item.template}" not found. Falling back to Base template.`);
	}

	// Content can be any type, so we just check it's not undefined
	return item.content !== undefined;
};

const validatedTemplateItems = computed(() => {
	return templateItems.value.filter(validateTemplateItem);
});

const hasErrors = computed(() => {
	const totalItems = templateItems.value.length;
	const validItems = validatedTemplateItems.value.length;
	return totalItems > 0 && validItems === 0;
});

const onModified = async (templateName: string, c: any, templateId?: string) => {
	try {
		let updatedContent;

		if (isTemplateArray.value) {
			// Handle array template updates
			const updatedTemplates = templateItems.value.map(item => {
				if (item.id === templateId || (!templateId && item.template === templateName)) {
					return { ...item, template: templateName, content: c };
				}
				return item;
			});

			// Validate that we actually found and updated a template
			const wasUpdated = updatedTemplates.some((item, index) => {
				const originalItem = templateItems.value[index];
				return item.content !== originalItem.content || item.template !== originalItem.template;
			});

			if (!wasUpdated) {
				console.warn(`Template with ID "${templateId}" or name "${templateName}" not found for update`);
				return;
			}

			updatedContent = JSON.stringify({ templates: updatedTemplates });
		} else {
			// Handle single template updates (backward compatibility)
			updatedContent = JSON.stringify({
				template: templateName,
				content: c
			});
		}

		const response = await fetch(
			window.location.origin + '/api/github/updateFile',
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					root,
					page,
					content: updatedContent
				})
			}
		);

		if (!response.ok) {
			throw new Error(`Failed to update file: ${response.status} ${response.statusText}`);
		}

		console.log('Template updated successfully');
	} catch (error) {
		console.error('Error updating template:', error);
		// You could add user notification here
		alert('Erreur lors de la mise à jour du template. Veuillez réessayer.');
	}
};
</script>

<template>
  <div class="page">
    <div id="title">
      <h1>{{ title }}</h1>
      <button v-if="login"
        @click="edit = !edit">
        {{ edit ? "Mettre-à-jour" : "Editer" }}
      </button>
    </div>

    <!-- Error handling for empty or invalid template data -->
    <div v-if="hasErrors" class="error-message">
      <p>❌ Erreur: Aucun template valide trouvé pour cette page.</p>
      <p class="error-details">Vérifiez que les données de la page contiennent des templates valides.</p>
    </div>

    <!-- Warning for no templates -->
    <div v-else-if="!hasValidTemplates" class="warning-message">
      <p>⚠️ Aucun contenu à afficher pour cette page.</p>
    </div>

    <!-- Template array rendering -->
    <div v-else class="template-container">
      <div
        v-for="(templateItem, index) in validatedTemplateItems"
        :key="templateItem.id || `template-${index}`"
        class="template-item"
        :class="`template-${templateItem.template || 'base'}`"
      >
        <!-- Render specific template component if it exists -->
        <component
          v-if="templateItem.template && templates[templateItem.template]"
          :is="templates[templateItem.template]"
          :content="templateItem.content"
          :edit="edit"
          @modified="(template: string, content: any) => onModified(template, content, templateItem.id)"
        />

        <!-- Fallback to Base template if specific template not found -->
        <Base
          v-else
          :content="templateItem.content"
          :edit="edit"
          @modified="(template: string, content: any) => onModified(template, content, templateItem.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  font-family: "NeuePlak-Light";
  width: 100%;
  flex-grow: 1;
  background-color: var(--page-bg);
  color: var(--page-txt);
}

#title {
  padding: 0;
  color: var(--page-title);
  position: relative;
  display: inline-block;
  font-family: "NeuePlak-Bold";
  font-size: 1.6em;
  line-height: 1.1;
}

#title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 2rem;
  width: 100%;
  height: 3px;
  background-color: var(--page-title);
  box-shadow: 0 0 10px var(--page-title),
    0 0 10px var(--page-title),
    0 0 10px var(--page-title),
    0 0 10px var(--page-title);
}

/* Enhanced styles for template arrays */
.template-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.template-item {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.template-item:first-child {
  padding-top: 1rem;
}

.template-item:last-child {
  width: 100%;
  position: relative;
}

/* Alt background for even-numbered templates */
.template-item:nth-child(even) {
  background-color: var(--page-bg-alt);
}

.template-item > * {
  max-width: 1440px;
  margin: auto;
}

.template-item :deep(h2) {
  padding-bottom: 2rem;
}

/* Error and warning message styles */
.error-message {
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  color: #dc3545;
}

.warning-message {
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  color: #856404;
}

.error-details {
  font-size: 0.9em;
  margin-top: 0.5rem;
  opacity: 0.8;
}

/* Responsive design for template arrays */
@media (max-width: 768px) {
  #title {
    font-size: 1.3rem;
    text-align: left;
  }

  #title::after {
    bottom: 2.5rem;
    height: 2.5px;
  }

  .page {
    padding: 15px;
  }

  .error-message,
  .warning-message {
    padding: 0.75rem;
    margin: 0.75rem 0;
    font-size: 0.9rem;
  }
}
</style>