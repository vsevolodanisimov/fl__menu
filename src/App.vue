<template>
  <v-app>
    <v-main>
      <v-row>
        <v-col lg="2">
          <v-text-field label="Ключ" v-model="id" />
          <v-text-field label="Индекс" v-model="index" />
          <v-btn @click="() => generateEvent({ type: 'select-by-id', id: this.id })">
            Выбрать пункт по ключу
          </v-btn>
          <v-btn @click="() => generateEvent({
            type: 'select-by-index', index: parseInt(this.index)
          })">
            Выбрать пункт по индексу
          </v-btn>
          <v-btn @click="() => generateEvent({ type: 'switch-by-id', id: this.id })">
            Свернуть/развернуть по ключу
          </v-btn>
          <v-btn @click="() => generateEvent({ type: 'switch-all' })">
            Свернуть/развернуть всё
          </v-btn>
          <v-btn @click="() => generateEvent({ type: 'delete-by-id', id: this.id })">
            Удалить по ключу
          </v-btn>
          <v-btn @click="() => generateEvent({
            type: 'delete-by-index', index: parseInt(this.index)
          })">
            Удалить по индексу
          </v-btn>
          <v-btn @click="() => generateEvent( { type: 'get-active-id' })">
            Получить ключ
          </v-btn>
          <v-btn @click="() => generateEvent({ type: 'get-active-index' })">
            Получить индеск и родителя
          </v-btn>
          <v-btn @click="() => generateEvent(
            { type: 'add-item', payload: { item: testAddItem, position: 2, parentId: '0.0' } }
          )">
            Добавить пункт с родителем
          </v-btn>
          <v-btn @click="() => generateEvent(
            { type: 'add-item', payload: { item: testAddItem1, position: 0 } }
          )">
            Добавить пункт без родителя
          </v-btn>
        </v-col>
        <v-spacer />
        <v-col sm="12" md="12" lg="6">
          <Menu
            :multiple="true"
            :menuItems="menuItems"
            :event="event"
          />
        </v-col>
        <v-spacer />
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import { testData } from '@/utils'
import Menu from '@/components/Menu.vue'

export default {
  name: 'App',
  components: {
    Menu,
  },
  data: () => ({
    menuItems: testData.menuItems,
    id: '',
    index: '',
    event: null,
    testAddItem: {
      title: 'test',
      color: 'primary',
      url: '/test4',
      menuBadges: [{
        color: 'accent',
      }],
    },
    testAddItem1: {
      title: 'test',
      color: 'primary',
      menuItems: [{
        title: 'test1',
        color: 'secondary',
        url: '/test5',
      }],
    },
  }),
  methods: {
    generateEvent(payload) {
      this.event = { ...payload }
    },
  },
}
</script>
