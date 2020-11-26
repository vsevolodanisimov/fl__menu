import MenuItem from '@/components/MenuItem.vue'
import { createWrapper } from './utils'

const testItem = {
  id: '0.0',
  index: 1,
  dividerNext: false,
  activeItem: { id: '0.0', index: 1 },
  opened: [],
  title: 'Новости',
  icon: 'mdi-account-box-multiple-outline',
  uppercase: true,
  color: 'secondary',
}

describe('MenuItem', () => {
  it('render menuItem if not divider', () => {
    const { wrapper } = createWrapper(MenuItem, true, { propsData: { ...testItem } })
    expect(wrapper.findComponent({ name: 'v-list-item' }).exists()).toBe(true)
  })
  it('render divider if divider', () => {
    const { wrapper } = createWrapper(MenuItem, true, { propsData: { ...testItem, divider: true } })
    expect(wrapper.findComponent({ name: 'v-divider' }).exists()).toBe(true)
  })
  it('render multiple childs', () => {
    const { wrapper } = createWrapper(MenuItem, true, { propsData: { ...testItem, menuItems: [testItem, testItem], url: '/test' } })
    expect(wrapper.findAllComponents(MenuItem).length).toBe(3)
  })
  it('emits switch-opened and change-active-item events if click on menuItem', async () => {
    const { wrapper } = createWrapper(MenuItem, false, { propsData: { ...testItem, menuItems: [testItem], url: '/test' } })
    await wrapper.findComponent({ name: 'v-list-item' }).trigger('click')
    expect(wrapper.emitted('switch-opened')[0][0]).toBe(testItem.id)
    expect(wrapper.emitted('change-active-item')[0][0]).toEqual(testItem.activeItem)
  })
  it('doest not emits switch-opened and change-active-item events if click on menuItem and have not menuItems and url', async () => {
    const { wrapper } = createWrapper(MenuItem, false, { propsData: { ...testItem } })
    await wrapper.findComponent({ name: 'v-list-item' }).trigger('click')
    expect(wrapper.emitted('switch-opened')).toBeUndefined()
    expect(wrapper.emitted('change-active-item')).toBeUndefined()
  })
  it('correct compute level property', () => {
    const localThis = { id: '0.0' }
    expect(MenuItem.computed.level.call(localThis)).toEqual(['0', '0'])
  })
  it('correct compute isParent property', () => {
    const trueThis = { id: '0.0', activeItem: { id: '0.0.1' } }
    expect(MenuItem.computed.isParent.call(trueThis)).toBe(true)
    const falseThis = { id: '0.0', activeItem: { id: '0' } }
    expect(MenuItem.computed.isParent.call(falseThis)).toBe(false)
  })
  it('correct compute isOpened property', () => {
    const trueThis = { id: '0.0', opened: ['0.0'] }
    expect(MenuItem.computed.isOpened.call(trueThis)).toBe(true)
    const falseThis = { id: '0.0', opened: [] }
    expect(MenuItem.computed.isOpened.call(falseThis)).toBe(false)
  })
  it('correct compute cssVars property', () => {
    const localThis = {
      $vuetify: {
        theme: {
          themes: {
            light: {
              primary: 'test',
            },
          },
        },
      },
      color: 'primary',
    }
    expect(MenuItem.computed.cssVars.call(localThis)).toEqual({
      '--border-left': '2px solid test',
      '--color': 'test',
    })
  })
  it('emits switch-opened event when isParent changes from false to true and isOpened false', () => {
    const { wrapper } = createWrapper(MenuItem, true, { propsData: { ...testItem, opened: [] } })
    wrapper.vm.$options.watch.isParent.call(wrapper.vm, true, false)
    expect(wrapper.emitted('switch-opened')[0][0]).toBe(testItem.id)
  })
  it('does not emits switch-opened event when isParent changes from true to false', () => {
    const { wrapper } = createWrapper(MenuItem, true, { propsData: { ...testItem, opened: [] } })
    wrapper.vm.$options.watch.isParent.call(wrapper.vm, false, true)
    expect(wrapper.emitted('switch-opened')).toBeUndefined()
  })
  it('emits change-active-item event with oldValue when become activeItem and !this.url', () => {
    const spy = jest.spyOn(console, 'error')
    const { wrapper } = createWrapper(MenuItem, true, { propsData: { ...testItem } })
    wrapper.vm.$options.watch.activeItem.call(wrapper.vm, testItem.activeItem, { id: '0', index: 1 })
    expect(wrapper.emitted('change-active-item')[0][0]).toEqual({ id: '0', index: 1 })
    expect(spy).toBeCalledWith('Item can\'t be selected')
  })
  it('emits change-active-item event with oldValue when become activeItem and this.disable', () => {
    const spy = jest.spyOn(console, 'error')
    const { wrapper } = createWrapper(MenuItem, true, { propsData: { ...testItem, url: 'test', disable: true } })
    wrapper.vm.$options.watch.activeItem.call(wrapper.vm, testItem.activeItem, { id: '0', index: 1 })
    expect(wrapper.emitted('change-active-item')[0][0]).toEqual({ id: '0', index: 1 })
    expect(spy).toBeCalledWith('Item can\'t be selected')
  })
  it('push this.url to router when become activeItem and this.url !== this.$route.path', () => {
    const { wrapper, router } = createWrapper(MenuItem, true, { propsData: { ...testItem, url: '/test' } }, '/')
    wrapper.vm.$options.watch.activeItem.call(wrapper.vm, testItem.activeItem, { id: '0', index: 1 })
    expect(router.currentRoute.path).toBe('/test')
  })
  it('does not push this.url to router when become activeItem and this.url === this.$route.path', () => {
    const { wrapper, router } = createWrapper(MenuItem, true, { propsData: { ...testItem, url: '/test' } }, '/test')
    wrapper.vm.$options.watch.activeItem.call(wrapper.vm, testItem.activeItem, { id: '0', index: 1 })
    expect(router.currentRoute.path).toBe('/test')
  })
  it('emits switch-opened event when activeItem change and item not parent new activeItem, isOpened, have menuItems and multiple flag false', () => {
    const { wrapper } = createWrapper(
      MenuItem,
      true,
      {
        propsData: {
          ...testItem,
          multiple: false,
          opened: ['0.0'],
          menuItems: [{
            id: '0.0',
            index: 1,
            activeItem: { id: '0.0', index: 1 },
            opened: [],
            title: 'Новости',
          }],
        },
      },
    )
    wrapper.vm.$options.watch.activeItem.call(wrapper.vm, { id: '0.1.0', index: 1 })
    expect(wrapper.emitted('switch-opened')[0][0]).toBe(testItem.id)
  })
  it('does not emits switch-opened event when activeItem change and !isOpened', () => {
    const { wrapper } = createWrapper(
      MenuItem,
      true,
      { propsData: { ...testItem, multiple: false } },
    )
    wrapper.vm.$options.watch.activeItem.call(wrapper.vm, { id: '0.1.0', index: 1 })
    expect(wrapper.emitted('switch-opened')).toBeUndefined()
  })
  it('does not emits switch-opened event when item not parent', () => {
    const { wrapper } = createWrapper(
      MenuItem,
      true,
      { propsData: { ...testItem, multiple: false } },
    )
    wrapper.vm.$options.watch.activeItem.call(wrapper.vm, { id: '0', index: 1 })
    expect(wrapper.emitted('switch-opened')).toBeUndefined()
  })
})
