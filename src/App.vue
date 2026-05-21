<template>
  <div class="min-h-svh bg-mono-50 text-mono-900 flex flex-col items-center justify-center px-5 py-12">
    <div class="w-full max-w-lg">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-up" style="animation-delay: 0.05s">
        <h1 class="text-4xl sm:text-5xl font-300 tracking-tight mb-3">
          Похвала
        </h1>
        <p class="text-mono-500 text-base sm:text-lg font-light">
          Введи имя и получи искренний комплимент
        </p>
      </div>

      <!-- Input + Button -->
      <div class="flex flex-col gap-4 animate-fade-up" style="animation-delay: 0.15s">
        <div class="relative">
          <input
            ref="nameInput"
            v-model="name"
            type="text"
            maxlength="100"
            placeholder="Введите ваше имя"
            :class="[
              'w-full bg-white border rounded-xl px-5 py-4 text-base sm:text-lg outline-none transition-all duration-200 placeholder:text-mono-400',
              errorType === 'validation'
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-mono-200 focus:border-mono-900 focus:ring-2 focus:ring-mono-200'
            ]"
            @keydown.enter="handlePraise"
            @input="onInput"
          />
          <span
            v-if="errorType === 'validation'"
            class="absolute -bottom-6 left-0 text-xs text-red-500"
          >
            Введите имя от 1 до 100 символов
          </span>
        </div>

        <button
          :disabled="!name.trim() || loading"
          class="group relative w-full bg-mono-900 text-white font-medium rounded-xl px-6 py-4 text-base sm:text-lg
                 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                 hover:bg-mono-800 active:scale-[0.98] cursor-pointer"
          @click="handlePraise"
        >
          <span :class="loading ? 'opacity-0' : 'opacity-100'">
            Получить похвалу
          </span>
          <span
            v-if="loading"
            class="absolute inset-0 flex items-center justify-center"
          >
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        </button>
      </div>

      <!-- Praise Result -->
      <Transition name="fade-up">
        <div v-if="praise" class="mt-10 animate-fade-up">
          <div class="bg-white border border-mono-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div class="flex items-start gap-3 mb-4">
              <span class="text-2xl">✨</span>
              <p class="text-mono-900 text-lg sm:text-xl leading-relaxed font-light">
                {{ praise }}
              </p>
            </div>

            <div class="flex flex-wrap gap-3 mt-6">
              <button
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-mono-200 text-sm text-mono-700
                       hover:bg-mono-50 hover:border-mono-300 transition-colors cursor-pointer"
                @click="copyPraise"
              >
                <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ copied ? 'Скопировано' : 'Скопировать' }}
              </button>

              <button
                v-if="canShare"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-mono-200 text-sm text-mono-700
                       hover:bg-mono-50 hover:border-mono-300 transition-colors cursor-pointer"
                @click="sharePraise"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Поделиться
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Error -->
      <Transition name="fade-up">
        <div v-if="errorType === 'network'" class="mt-8 text-center animate-fade-up">
          <p class="text-mono-500 text-sm">
            Что-то пошло не так. Попробуйте позже.
          </p>
        </div>
      </Transition>

      <!-- Footer -->
      <div class="mt-16 text-center animate-fade-up" style="animation-delay: 0.25s">
        <p class="text-mono-400 text-xs">
          Сделано с заботой · Монохром
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const API_URL = 'https://recycling-register-contacted-mirror.trycloudflare.com/praise'
const API_KEY = 'super-secret-key-123'

const name = ref('')
const praise = ref('')
const loading = ref(false)
const errorType = ref<'validation' | 'network' | null>(null)
const copied = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)

const canShare = typeof navigator !== 'undefined' && !!navigator.share

onMounted(() => {
  nameInput.value?.focus()
})

function onInput() {
  if (errorType.value === 'validation') {
    errorType.value = null
  }
}

async function handlePraise() {
  const trimmed = name.value.trim()

  if (!trimmed || trimmed.length > 100) {
    errorType.value = 'validation'
    return
  }

  if (loading.value) return

  loading.value = true
  errorType.value = null
  praise.value = ''

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({ name: trimmed }),
    })

    if (!res.ok) {
      if (res.status === 422) {
        errorType.value = 'validation'
      } else {
        errorType.value = 'network'
      }
      return
    }

    const data = await res.json()
    praise.value = data.praise || ''
  } catch (err) {
    errorType.value = 'network'
  } finally {
    loading.value = false
  }
}

async function copyPraise() {
  if (!praise.value) return
  try {
    await navigator.clipboard.writeText(praise.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // ignore
  }
}

async function sharePraise() {
  if (!praise.value) return
  try {
    await navigator.share({
      title: 'Моя похвала',
      text: praise.value,
    })
  } catch {
    // ignore
  }
}
</script>
