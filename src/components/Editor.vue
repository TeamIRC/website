<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

const emits = defineEmits(['update:modelValue']);

const editor = new Editor({
    extensions: [
        StarterKit,
    ],
    content: props.modelValue,
    onUpdate: () => {
        emits('update:modelValue', editor.getHTML())
        //emits('update:modelValue', editor.getJSON())
    },
})

watch(() => props.modelValue, (value) => {
    const isSame = editor.getHTML() === value
    //const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(value)

    if (isSame) {
        return
    }

    editor.commands.setContent(value, false)
});

onBeforeUnmount(() => editor.destroy())
</script>

<template>
    <editor-content :editor="editor" />
</template>