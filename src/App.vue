<script setup>
import { ref, computed, watch, nextTick } from "vue";

// 定数

const KEY_NOTES = "notes";
const MAX_NOTE_COUNT = 100;

// リアクティブ変数

const isListShow = ref(false);
const notes = ref(JSON.parse(localStorage.getItem(KEY_NOTES)) || []);
const selected = ref([]);
const textarea = ref(null);

// 算出プロパティ

const text = computed({
  get() {
    const id = selected.value[0];
    const note = notes.value.find((x) => x.id === id);
    return note.text;
  },
  set(newValue) {
    const id = selected.value[0];
    const index = notes.value.findIndex((x) => x.id === id);
    const newNote = { id, text: newValue, noteName: newValue.trim() ? newValue : "Empty" };
    notes.value = [
      newNote,
      ...notes.value.slice(0, index),
      ...notes.value.slice(index + 1),
    ];
    localStorage.setItem(KEY_NOTES, JSON.stringify(notes.value));
  },
});

// ウォッチャー

watch([isListShow, selected], async () => {
  await nextTick();
  textarea.value.focus();
});

// メソッド ハンドラー

const addNote = () => {
  const id = Math.random().toString(36).slice(2);
  const newNote = { id, text: "", noteName: "Empty"};
  notes.value = [newNote, ...notes.value].slice(0, MAX_NOTE_COUNT);
  selected.value = [id];
};

const toggleList = () => (isListShow.value = !isListShow.value);

// ライフサイクル フック

addNote();
</script>

<template>
  <v-app>
    <v-main>
      <div class="d-flex h-100">
        <!-- ナビゲーション メニュー -->
        <div class="d-flex h-100">
          <v-list class="d-flex flex-column h-100">
            <v-list-item @click="toggleList">
              <v-list-item-icon icon="mdi-note-multiple-outline" />
            </v-list-item>
            <v-list-item @click="addNote">
              <v-list-item-icon icon="mdi-creation" />
            </v-list-item>
            <v-list-item
              class="mt-auto"
              href="https://github.com/AsaiToshiya/n" target="_blank"
            >
              <v-list-item-icon icon="mdi-github" />
            </v-list-item>
          </v-list>
          <v-divider class="mx-0" vertical />
        </div>

        <!-- メモ リスト -->
        <div v-if="isListShow" class="d-flex h-100">
          <v-list
            v-model:selected="selected"
            :items="notes"
            class="d-flex flex-column list"
            density="compact"
            item-title="noteName"
            item-value="id"
            :mandatory="true"
          />
          <v-divider class="mx-0" vertical />
        </div>

        <!-- テキスト エリア -->
        <textarea ref="textarea" v-model="text" class="px-2 text w-100" />
      </div>
    </v-main>
  </v-app>
</template>

<style>
.list {
  max-width: 300px;
  width: 300px;
}

.text {
  resize: none;
}

.text:focus {
  outline: none;
}
</style>
