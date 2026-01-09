<template>
  <UDropdownMenu
    v-slot="{ open }"
    :modal="false"
    :items="[{
      label: 'Lorem Ipsum Dolar Sit Amet',
      to: 'https://starter-template.nuxt.dev/',
      icon: 'i-lucide-layers'
    },{
      label: 'Editor',
      to: 'https://editor-template.nuxt.dev/',
      icon: 'i-lucide-layers',
      color: 'primary',
      checked: true,
      type: 'checkbox'
    }]"
    :content="{ align: 'start' }"
    :ui="{ content: 'min-w-fit' }"
    size="sm"
  >
    <UButton
      label="Lorem Ipsum Dolar Sit Amet"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      class="-mb-[6px] font-semibold rounded-full truncate"
      :class="[open && 'bg-primary/15']"
      :ui="{
        trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
      }"
    />
  </UDropdownMenu>
</template>
