<script setup lang="ts">
withDefaults(
  defineProps<{
    center?: boolean
    client?: boolean
  }>(),
  {
    center: true,
    client: true,
  },
)
</script>

<template>
  <div
    class="-ml-6 mt-8 flex w-screen sm:ml-0 sm:w-full"
    :class="center && 'justify-center'"
  >
    <div
      class="flex flex-col mx-2 max-w-full border rounded-lg p-2 sm:mx-0 sm:p-4"
    >
      <slot name="header" />
      <div v-if="client">
        <ClientOnly>
          <slot />
        </ClientOnly>
      </div>
      <div v-else>
        <slot />
      </div>
    </div>
  </div>
</template>
