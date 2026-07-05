<template>
  <div class="tagCombobox" @focusout="onFocusout">
    <div class="tagCombobox__control" @click="focusInput">
      <!-- 選択済みタグのチップ表示 -->
      <span v-for="tag in modelValue" :key="tag" class="tagCombobox__chip">
        {{ tag }}
        <button
          type="button"
          class="tagCombobox__chipRemove"
          :aria-label="`${tag}を削除`"
          @click.stop="removeTag(tag)"
        >
          ×
        </button>
      </span>
      <input
        ref="inputRef"
        v-model="inputText"
        class="tagCombobox__input"
        type="text"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="isOpen"
        @focus="isOpen = true"
        @keydown="onKeydown"
      />
    </div>

    <!-- 候補のドロップダウン -->
    <ul v-if="isOpen && showDropdown" class="tagCombobox__list" role="listbox">
      <li
        v-for="(tag, index) in filteredSuggestions"
        :key="tag"
        class="tagCombobox__option"
        :class="{ 'tagCombobox__option--active': index === activeIndex }"
        role="option"
        :aria-selected="index === activeIndex"
        @mousedown.prevent="addTag(tag)"
        @mouseover="activeIndex = index"
      >
        {{ tag }}
      </li>
      <!-- 入力値が既存候補に無い場合は新規追加の選択肢を表示 -->
      <li
        v-if="canAddNewTag"
        class="tagCombobox__option"
        :class="{ 'tagCombobox__option--active': activeIndex === filteredSuggestions.length }"
        role="option"
        :aria-selected="activeIndex === filteredSuggestions.length"
        @mousedown.prevent="addTag(trimmedInput)"
        @mouseover="activeIndex = filteredSuggestions.length"
      >
        「{{ trimmedInput }}」を追加
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  // 選択済みタグ
  modelValue: string[]
  // 選択候補となる既存タグ
  suggestions?: readonly string[]
  placeholder?: string
}

const {
  modelValue,
  suggestions = [],
  placeholder = 'タグを選択、または入力して追加',
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [string[]]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputText = ref('')
const isOpen = ref(false)
const activeIndex = ref(-1)

const trimmedInput = computed(() => inputText.value.trim())

// 入力値で絞り込んだ、まだ選択されていない既存タグ候補
const filteredSuggestions = computed(() => {
  const keyword = trimmedInput.value.toLowerCase()
  return suggestions.filter((tag) => {
    if (modelValue.includes(tag)) return false
    if (keyword === '') return true
    return tag.toLowerCase().includes(keyword)
  })
})

// 入力値が既存候補（大文字小文字無視の完全一致）や選択済みに無ければ新規追加できる
const canAddNewTag = computed(() => {
  if (trimmedInput.value === '') return false
  const lower = trimmedInput.value.toLowerCase()
  if (modelValue.some((tag) => tag.toLowerCase() === lower)) return false
  if (suggestions.some((tag) => tag.toLowerCase() === lower)) return false
  return true
})

const showDropdown = computed(() => filteredSuggestions.value.length > 0 || canAddNewTag.value)

function focusInput() {
  inputRef.value?.focus()
}

function addTag(tag: string) {
  const value = tag.trim()
  if (value === '') return
  if (modelValue.includes(value)) return
  emit('update:modelValue', [...modelValue, value])
  inputText.value = ''
  activeIndex.value = -1
}

function removeTag(tag: string) {
  emit(
    'update:modelValue',
    modelValue.filter((t) => t !== tag),
  )
}

function onKeydown(e: KeyboardEvent) {
  const optionCount = filteredSuggestions.value.length + (canAddNewTag.value ? 1 : 0)

  switch (e.key) {
    case 'ArrowDown':
      if (optionCount === 0) return
      e.preventDefault()
      isOpen.value = true
      activeIndex.value = (activeIndex.value + 1) % optionCount
      break
    case 'ArrowUp':
      if (optionCount === 0) return
      e.preventDefault()
      isOpen.value = true
      activeIndex.value = (activeIndex.value - 1 + optionCount) % optionCount
      break
    case 'Enter':
    case ',': {
      // コンマでもタグを確定できるようにする
      if (trimmedInput.value === '' && activeIndex.value < 0) return
      e.preventDefault()
      if (activeIndex.value >= 0 && activeIndex.value < filteredSuggestions.value.length) {
        addTag(filteredSuggestions.value[activeIndex.value])
      } else if (trimmedInput.value !== '') {
        addTag(trimmedInput.value)
      }
      break
    }
    case 'Backspace':
      // 入力が空のときはBackspaceで末尾のタグを削除
      if (inputText.value === '' && modelValue.length > 0) {
        removeTag(modelValue[modelValue.length - 1])
      }
      break
    case 'Escape':
      isOpen.value = false
      break
  }
}

function onFocusout(e: FocusEvent) {
  // フォーカスがコンポーネント外に移ったらドロップダウンを閉じる
  const next = e.relatedTarget as Node | null
  if (next && e.currentTarget instanceof Node && e.currentTarget.contains(next)) {
    return
  }
  isOpen.value = false
  activeIndex.value = -1
}
</script>

<style lang="scss" scoped>
.tagCombobox {
  position: relative;
}

.tagCombobox__control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  min-height: 40px;
  padding: 4px 8px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #cbcbcb;
  background-color: #fbfcff;
  cursor: text;
}

.tagCombobox__chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 100px;
  background-color: var(--lightYellow);
  font-size: 0.85rem;
  line-height: 1.6;
}

.tagCombobox__chipRemove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  border-radius: 100px;
  background-color: transparent;
  color: var(--darkYellow);
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
  &:hover {
    background-color: var(--yellow);
  }
}

.tagCombobox__input {
  flex: 1 1 80px;
  min-width: 80px;
  height: 28px;
  border: 0;
  outline: 0;
  background-color: transparent;
  font-size: 1rem;
}

.tagCombobox__list {
  position: absolute;
  z-index: 10;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  border-radius: 4px;
  border: 1px solid #cbcbcb;
  background-color: var(--white);
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
}

.tagCombobox__option {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.95rem;
  &--active {
    background-color: var(--brightGray);
  }
}
</style>
