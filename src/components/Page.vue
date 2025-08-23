<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Base, default as templates } from "../templates";

const route = useRoute();
const { root, page, title } = route.meta;
const { template, content } = await import(`../pages/${root}/${page}.json`);
const edit = ref(false);
localStorage.setItem('origin', route.fullPath);
const login = localStorage.getItem('login');
const onModified = async (template: string, c: any) => {
	await fetch(
		window.location.origin + '/api/github/updateFile',
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				root,
				page,
				content: JSON.stringify({
					template,
					content: c
				})
			})
		}
	);
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
    <component v-if="template"
      :is="templates[template]"
      :content="content"
      :edit="edit"
      @modified="onModified"
    />
    <Base v-else
      :content="content"
      :edit="edit"
      @modified="onModified" />
  </div>
</template>

<style scoped>
.page {
  font-family: "NeuePlak-Light";
  width: 100%;
  flex-grow: 1;
  background-color: var(--page-bg);
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
}
</style>