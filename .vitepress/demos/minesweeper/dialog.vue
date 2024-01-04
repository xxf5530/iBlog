<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    appendToBody?: boolean
    maskClosable?: boolean
    buttonOkText?: string
    buttonCancelText?: string
  }>(),
  {
    appendToBody: true,
    maskClosable: true,
    buttonOkText: '确认',
    buttonCancelText: '取消',
  }
)

defineEmits(['update:modelValue', 'onOk', 'onCancel'])
</script>

<template>
  <Teleport to="body" :disabled="!appendToBody">
    <Transition>
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex justify-center items-center bg-black/30"
        @click="maskClosable && $emit('onCancel')"
      >
        <div
          class="relative mx-4 max-w-md w-full rounded bg-[#f8fafc] dark:bg-[#232323] p-6 shadow md:mx-auto"
        >
          <template v-if="title || $slots.header">
            <slot name="header">
              <div class="mb-2 text-lg">
                {{ title }}
              </div>
            </slot>
          </template>
          <slot />
          <slot name="footer">
            <div class="flex flex-col items-center gap-2 pt-3 md:flex-row md:justify-end">
              <button
                class="w-full px-4 py-1 rounded text-sm transition border border-solid border-gray/20 md:w-20"
                hover="bg-black/5 dark:bg-white/10"
                @click.stop="$emit('onCancel')"
              >
                {{ buttonCancelText }}
              </button>
              <button
                class="w-full px-4 py-1 rounded text-sm transition border border-solid border-gray/20 md:w-20 text-[#e7e9ea] dark:text-[#09090b] bg-black/90 dark:bg-white/90"
                hover="bg-black/80 dark:bg-white/80"
                @click.stop="$emit('onOk')"
              >
                {{ buttonOkText }}
              </button>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
