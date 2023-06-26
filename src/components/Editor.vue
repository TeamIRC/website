<style src="../editor.css" scoped></style>
<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit';
import { BubbleMenu, FloatingMenu, Editor, EditorContent } from '@tiptap/vue-3';
import { Image } from '@tiptap/extension-image'; // Import the Image extension
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';


const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

const emits = defineEmits(['update:modelValue']);

const editor = ref<Editor>()

const setLevel = (v: Event) => { 
    if (!editor.value) return;
    const value = (v.target as HTMLSelectElement).value;
    switch (value) {
        case "p":
            editor.value.chain().focus().setParagraph().run();
            break;
        case "u":
            editor.value.chain().focus().toggleBulletList().run()
            break;
        case "o":
            editor.value.chain().focus().toggleOrderedList().run()
            break;
        default:
            editor.value.chain().focus().toggleHeading({ 
                level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6 
            }).run();
            break;
    }
}

watch(() => props.modelValue, (value) => {
    const isSame = editor.value?.getHTML() === value
    //const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(value)

    if (isSame) {
        return
    }

    editor.value?.commands.setContent(value, false)
});

const insertImage = () => {
  const imageUrl = prompt('Enter the URL of the image:');
  if (imageUrl) {
    editor.value?.chain().focus().setImage({ src: imageUrl }).run();
  }
};

onMounted(() => editor.value = new Editor({
    extensions: [
        StarterKit,
        Image.configure({
        inline: true, // Set to 'true' if you want the images to be inserted inline
      }),
    ],
    content: props.modelValue,
    onUpdate: () => {
        emits('update:modelValue', editor.value?.getHTML())
        //emits('update:modelValue', editor.getJSON())
    },
}))

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
    <div v-if="editor">
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()" style="--clr:#FF44CC"><span>undo</span><i></i>       
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()" style="--clr:#39FF14"><span>redo</span><i></i>    
        </button>
        <BubbleMenu :editor="editor" :tippyOptions="{ duration: 100 }"
        >
            <button
                :disabled="!(editor.isActive('bold') || editor.isActive('italic') || editor.isActive('italic'))"
                @click="editor.chain().focus().unsetAllMarks().run()" style="--clr:#0FF0FC"><span>clear marks</span><i></i>               
            </button>
            <button
                :class="{ 'is-active': editor.isActive('bold') }"
                @click="editor.chain().focus().toggleBold().run()" style="--clr:#8A2BE2"><span>bold</span><i></i>      
            </button>
            <button
                :class="{ 'is-active': editor.isActive('italic') }"
                @click="editor.chain().focus().toggleItalic().run()" style="--clr:#39FF14"><span>italic</span><i></i>               
            </button>
            <select @change="setLevel">
                <option value="p">paragraph</option>
                <option value="u">bullet list</option>
                <option value="o">ordered list</option>
                <option value="1">header 1</option>
                <option value="2">header 2</option>
                <option value="3">header 3</option>
                <option value="4">header 4</option>
                <option value="5">header 5</option>
                <option value="6">header 6</option>
            </select>
            <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" style="--clr:#0FF0FC"><span>blockquote</span><i></i>                
            </button>
        </BubbleMenu>
        <FloatingMenu :editor="editor" :tippy-options="{ duration: 100 }">
            <button
                :disabled="!(editor.isActive('bold') || editor.isActive('italic') || editor.isActive('italic'))"
                @click="editor.chain().focus().unsetAllMarks().run()"
                style="--clr:#8A2BE2"><span>clear marks</span><i></i>
            </button>
            <button :class="{ 'is-active': editor.isActive('insertImage') }" @click="insertImage" style="--clr:#FF44CC"><span>Insert Image</span><i></i>               
            </button>
            <button
                :class="{ 'is-active': editor.isActive('bold') }"
                @click="editor.chain().focus().toggleBold().run()" style="--clr:#39FF14"><span>bold</span><i></i>
            </button>
            <button
                :class="{ 'is-active': editor.isActive('italic') }"
                @click="editor.chain().focus().toggleItalic().run()" style="--clr:#0FF0FC"><span>italic</span><i></i>    
            </button>
            <select @change="setLevel">
                <option value="p">paragraph</option>
                <option value="u">bullet list</option>
                <option value="o">ordered list</option>
                <option value="1">header 1</option>
                <option value="2">header 2</option>
                <option value="3">header 3</option>
                <option value="4">header 4</option>
                <option value="5">header 5</option>
                <option value="6">header 6</option>
            </select>
            <button
                :class="{ 'is-active': editor.isActive('blockquote') }"
                @click="editor.chain().focus().toggleBlockquote().run()" style="--clr:#8A2BE2"><span>blockquote</span><i></i>   
            </button>
            <button @click="editor.chain().focus().setHorizontalRule().run()" style="--clr:#FF44CC"><span>horizontal rule</span><i></i>                
            </button>
            <button @click="editor.chain().focus().setHardBreak().run()" style="--clr:#39FF14"><span>hard break</span><i></i>           
            </button>
        </FloatingMenu>
    </div>
    <editor-content :editor="editor" />
</template>

<style scoped>
.is-active {
    background: var(--secondary-dk-5);
    color: var(--secondary-lt-5);
}
</style>