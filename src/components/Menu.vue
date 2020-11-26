<template>
  <div v-if="index !== 0" class="elevation-1">
    <menu-item
      v-for="(menuItem, i) in menuItems"
      @change-active-item="changeActiveItem"
      @switch-opened="switchOpened"
      :key="i"
      v-bind="{
        ...menuItem,
        dividerNext: menuItems[i+1] && menuItems[i+1].divider ? true : false,
        activeItem,
        opened,
        multiple
      }"
    />
  </div>
  <div v-else />
</template>

<script>
/* eslint-disable no-param-reassign */

import MenuItem from '@/components/MenuItem.vue'

export default {
  name: 'Menu',
  components: {
    MenuItem,
  },
  props: {
    multiple: { type: Boolean, required: false, default: true },
    menuItems: { type: Array, required: false, default: () => [] },
    defaultItem: { type: String, required: false, default: null },
    event: { type: Object, required: false, default: null },
  },
  data: () => ({
    activeItem: { id: '', index: '' },
    opened: [],
    index: 0,
    map: {},
  }),
  mounted() {
    this.prepareData(this.menuItems)
    if (!this.opened.includes(this.defaultItem) && this.defaultItem !== null) {
      this.switchOpened(this.defaultItem)
    }
  },
  watch: {
    event(newVal) {
      switch (newVal.type) {
        case 'select-by-id':
          this.selectById(newVal.id)
          break
        case 'select-by-index':
          this.selectByIndex(newVal.index)
          break
        case 'switch-by-id':
          this.switchOpened(newVal.id)
          break
        case 'switch-all':
          this.switchAll()
          break
        case 'delete-by-id':
          this.deleteById(newVal.id)
          break
        case 'delete-by-index':
          this.deleteByIndex(newVal.index)
          break
        case 'get-active-id':
          this.getActiveId()
          break
        case 'get-active-index':
          this.getActiveIndex()
          break
        case 'add-item':
          this.addItem(newVal.payload)
          break
        default:
          console.error('Incorrect event provided')
          break
      }
    },
  },
  methods: {
    changeActiveItem(activeItem) {
      this.activeItem = { id: activeItem.id, index: parseInt(activeItem.index, 10) }
    },
    switchOpened(id) {
      if (!Object.values(this.map).includes(id)) {
        console.error('Id does not found')
        return
      }
      const index = this.opened.indexOf(id)
      if (index > -1) {
        this.opened.splice(index, 1)
      } else {
        const splittedId = id.split('.')
        let prevId = ''
        splittedId.forEach((i, ind) => {
          prevId += `${ind === 0 ? '' : '.'}${i}`
          if (this.opened.indexOf(prevId) === -1) {
            this.opened.push(prevId)
          }
        })
      }
    },
    prepareData(menuItems, parentId = null) {
      menuItems.forEach((item, i) => {
        item.id = parentId !== null ? `${parentId}.${i}` : `${i}`
        item.index = this.index
        this.map[item.index] = item.id
        this.index += 1
        if (item.url && item.url === this.$route.path) {
          this.activeItem = { id: item.id, index: item.index }
          this.switchOpened(item.id)
        }
        if (item.menuItems) {
          this.prepareData(item.menuItems, item.id)
        }
      })
    },
    selectById(id) {
      if (Object.values(this.map).includes(id)) {
        const index = Object.keys(this.map).find((k) => this.map[k] === id)
        this.changeActiveItem({ id, index })
      } else {
        console.error('Id does not found')
      }
    },
    selectByIndex(index) {
      if (Object.keys(this.map).includes(`${index}`)) {
        this.changeActiveItem({ id: this.map[index], index })
      } else {
        console.error('Index does not found')
      }
    },
    switchAll() {
      if (this.opened.length !== 0) {
        this.opened = []
      } else {
        Object.keys(this.map).forEach((key) => {
          this.opened.push(this.map[key])
        })
      }
    },
    deleteById(id) {
      if (Object.values(this.map).includes(id)) {
        this.deleteItem(this.menuItems, id)
        this.index = 0
        if (id === this.activeItem.id || this.isParent(id, this.activeItem.id)) {
          this.activeItem = { id: '', index: '' }
        }
        this.prepareData(this.menuItems)
      } else {
        console.error('Id does not found')
      }
    },
    deleteByIndex(index) {
      if (Object.keys(this.map).includes(`${index}`)) {
        this.deleteItem(this.menuItems, null, index)
        this.index = 0
        if (index === this.activeItem.index || this.isParent(this.map[index], this.activeItem.id)) {
          this.activeItem = { id: '', index: '' }
        }
        this.prepareData(this.menuItems)
      } else {
        console.error('Index does not found')
      }
    },
    deleteItem(menuItems, id = null, index = null) {
      menuItems.forEach((item, i, object) => {
        if ((id && item.id === id) || (index && item.index === index)) {
          object.splice(i, 1)
        }
        if (item.menuItems) {
          this.deleteItem(item.menuItems, id, index)
        }
      })
    },
    getActiveId() {
      console.log(this.activeItem.id || null)
    },
    getActiveIndex() {
      console.log(this.activeItem.index || null)
      console.log(this.getItemById(this.menuItems, this.activeItem.id.split('.').slice(0, -1).join('.')))
    },
    addItem(payload) {
      const { item, position, parentId } = payload
      if (!item || position === undefined) {
        console.error('Item or position does not provided')
        return
      }
      if (parentId && !Object.values(this.map).includes(parentId)) {
        console.error('Parent does not found')
        return
      }
      if (!parentId) {
        this.menuItems.splice(position, 0, item)
      } else {
        const parentItem = this.getItemById(this.menuItems, parentId)
        if (!Array.isArray(parentItem.menuItems)) parentItem.menuItems = []
        parentItem.menuItems.splice(position, 0, item)
      }
      this.index = 0
      this.prepareData(this.menuItems)
    },
    isParent(parentId, childId) {
      return childId.substring(0, parentId.length) === parentId
    },
    getItemById(menuItems, id) {
      let item = null
      // eslint-disable-next-line no-restricted-syntax
      for (const menuItem of menuItems) {
        if (menuItem.id === id) item = menuItem
        if (item) break
        if (!item && menuItem.menuItems) item = this.getItemById(menuItem.menuItems, id)
      }
      return item
    },
  },
}
</script>
