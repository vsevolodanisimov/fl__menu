<template>
  <div v-if="!divider">
    <v-list-item
      :style="cssVars"
      exact-active-class="exact-active"
      :disabled="disable"
      :to="url ? { path: url } : ''"
      @click="click"
    >
      <v-list-item-icon :class="level.length > 5 ? `ml-5` : `ml-${level.length}`">
        <v-icon :color="isParent ? color : ''" v-if="icon" v-text="icon"/>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title :class="
          level.length > 5
            ? `ml-5 ${isParent ? `${color}--text` : ''}`
            : `ml-${level.length} ${isParent ? `${color}--text` : ''}`
          "
        >
          {{ uppercase ? title.toUpperCase() : title }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-icon v-for="(badge, i) in menuBadges" :key="i" >
        <menu-badge v-bind="badge" />
      </v-list-item-icon>
      <v-list-item-icon v-if="menuItems.length !== 0 && !this.disable">
        <v-icon>
          {{isOpened ? 'mdi-arrow-down' : 'mdi-arrow-left'}}
        </v-icon>
      </v-list-item-icon>
    </v-list-item>
    <v-divider v-if="!dividerNext"/>
    <v-slide-y-transition>
      <div v-show="isOpened" v-if="menuItems.length !== 0">
        <menu-item
          v-for="(menuItem, i) in menuItems"
          :key="i"
          @change-active-item="changeActiveItem"
          @switch-opened="switchOpened"
          v-bind="{
            ...menuItem,
            dividerNext: menuItems[i+1] && menuItems[i+1].divider ? true : false,
            activeItem,
            opened,
            multiple
          }"
        />
      </div>
    </v-slide-y-transition>
  </div>
  <v-divider class="mt-4 mb-4 divider" v-else/>
</template>

<script>
import MenuBadge from '@/components/MenuBadge.vue'

export default {
  name: 'MenuItem',
  components: {
    MenuBadge,
  },
  props: {
    title: { type: String, required: false, default: null },
    id: { type: String, required: true },
    index: { type: Number, required: true },
    activeItem: { type: Object, required: true },
    opened: { type: Array, required: true },
    dividerNext: { type: Boolean, required: true },
    icon: { type: String, required: false, default: null },
    uppercase: { type: Boolean, required: false, default: false },
    divider: { type: Boolean, required: false, default: false },
    url: { type: String, required: false, default: null },
    disable: { type: Boolean, required: false, default: false },
    color: { type: String, required: false, default: 'primary' },
    menuBadges: { type: Array, required: false, default: null },
    menuItems: { type: Array, required: false, default: () => [] },
    multiple: { type: Boolean, required: false, default: true },
  },
  computed: {
    level() { return this.id.split('.') },
    isParent() { return this.activeItem.id.substring(0, this.id.length) === this.id },
    isOpened() { return this.opened.includes(this.id) },
    cssVars() {
      return {
        '--border-left': `2px solid ${this.$vuetify.theme.themes.light[this.color]}`,
        '--color': this.$vuetify.theme.themes.light[this.color],
      }
    },
  },
  watch: {
    isParent(newVal, oldVal) {
      if (newVal === true && oldVal === false && !this.isOpened) {
        this.switchOpened(this.id)
      }
    },
    activeItem(newVal, oldVal) {
      if (newVal.id === this.id) {
        if (!this.url || this.disable) {
          this.changeActiveItem(oldVal)
          console.error('Item can\'t be selected')
          return
        }
        if (this.url && this.url !== this.$route.path) {
          this.$router.push({ path: this.url })
        }
      }
      if (!this.multiple) {
        if (newVal.id.length >= this.id.length && newVal.id.split('.')[this.level.length - 1] !== this.level[this.level.length - 1]) {
          if (this.menuItems.length !== 0 && this.isOpened) {
            this.switchOpened(this.id)
          }
        }
      }
    },
  },
  methods: {
    click() {
      if (this.menuItems.length !== 0) this.switchOpened(this.id)
      if (this.url) this.changeActiveItem({ id: this.id, index: this.index })
    },
    switchOpened(id) {
      this.$emit('switch-opened', id)
    },
    changeActiveItem(activeItem) {
      this.$emit('change-active-item', activeItem)
    },
  },
}
</script>

<style scoped>
  .exact-active {
    color: var(--color)!important;
    border-left: var(--border-left)!important;
  }
  .divider {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
  }
</style>
