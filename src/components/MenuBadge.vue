<template>
  <v-chip class="menu-badge" v-if="!isIcon && value" :color="color" small label text-color="white">
    {{value}}
  </v-chip>
  <v-icon class="menu-badge" :color="color" v-else-if="isIcon">
    {{value}}
  </v-icon>
  <div v-else >
    <v-icon />
    <div :class="`dot menu-badge ${color}`" />
  </div>
</template>

<script>
export default {
  name: 'MenuBadge',
  props: {
    color: { type: String, required: false, default: 'primary' },
    value: { type: String, required: false, default: null },
  },
  computed: {
    isIcon() {
      return this.value ? this.value.startsWith('mdi-') : false
    },
  },
}
</script>

<style lang="scss" scoped>
  .dot {
    border-radius: 50%;
    width: 10px;
    height: 10px;
    display: inline-block;
  }
</style>
