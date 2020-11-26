import Menu from '@/components/Menu.vue'
import MenuItem from '@/components/MenuItem.vue'
import { createWrapper } from './utils'

const testItem1 = () => ({
  title: 'test0',
  menuItems: [{
    title: 'test0.0',
    url: '/test',
  }],
})

const testItem2 = () => ({
  title: 'test1',
  menuItems: [{
    title: 'test1.0',
  }],
})

const propsData = () => ({
  multiple: true,
  dividerNext: false,
  defaultItem: '1',
  menuItems: [{ ...testItem1() }, { ...testItem2() }],
})

describe('Menu', () => {
  let errSpy
  let logSpy
  beforeAll(() => {
    errSpy = jest.spyOn(console, 'error')
    logSpy = jest.spyOn(console, 'log')
  })

  afterEach(() => {
    errSpy.mockClear()
    logSpy.mockClear()
  })

  it('render menu if index not 0', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(MenuItem).exists()).toBe(true)
  })
  it('does not render menu if index 0', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    await wrapper.setData({ index: 0 })
    expect(wrapper.findComponent(MenuItem).exists()).toBe(false)
  })
  it('render multiple menuItems', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(MenuItem).length).toBe(2)
  })
  it('show console error with switchOpened if id not found', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.switchOpened('12')
    expect(errSpy).toBeCalledWith('Id does not found')
  })
  it('add item and item parents in opened if it not it in with switchOpened', async () => {
    const { wrapper } = createWrapper(Menu, true, {
      propsData: { ...propsData(), defaultItem: null },
    })
    await wrapper.vm.$nextTick()
    wrapper.vm.switchOpened('0.0')
    expect(wrapper.vm.opened).toEqual(['0', '0.0'])
  })
  it('remove item in opened if it it in with switchOpened', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.switchOpened('1')
    expect(wrapper.vm.opened).toEqual([])
  })
  it('prepare data - set ID and indexes, set active item and open active item parent', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData(), defaultItem: null } }, '/test')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.menuItems).toEqual([
      {
        title: 'test0',
        id: '0',
        index: 0,
        menuItems: [{
          title: 'test0.0',
          id: '0.0',
          index: 1,
          url: '/test',
        }],
      },
      {
        title: 'test1',
        id: '1',
        index: 2,
        menuItems: [{
          id: '1.0',
          index: 3,
          title: 'test1.0',
        }],
      },
    ])
    expect(wrapper.vm.activeItem).toEqual({ id: '0.0', index: 1 })
    expect(wrapper.vm.opened).toEqual(['0', '0.0'])
  })
  it('change activeItem on select-by-id event', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'select-by-id', id: '0.0' })
    expect(wrapper.vm.activeItem).toEqual({ id: '0.0', index: 1 })
  })
  it('show console error on select-by-id event when id does not found', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'select-by-id', id: '0.0.1' })
    expect(errSpy).toBeCalledWith('Id does not found')
  })
  it('change activeItem on select-by-index event', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'select-by-index', index: 1 })
    expect(wrapper.vm.activeItem).toEqual({ id: '0.0', index: 1 })
  })
  it('show console error on select-by-index event when index does not found', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'select-by-index', index: 5 })
    expect(errSpy).toBeCalledWith('Index does not found')
  })
  it('add item and item parents in opened by id on switch-by-id event', () => {
    const { wrapper } = createWrapper(
      Menu,
      true,
      { propsData: { ...propsData(), defaultItem: null } },
    )
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'switch-by-id', id: '0.0' })
    expect(wrapper.vm.opened).toEqual(['0', '0.0'])
  })
  it('open all on switch-all event if opened empty', () => {
    const { wrapper } = createWrapper(
      Menu,
      true,
      { propsData: { ...propsData(), defaultItem: null } },
    )
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'switch-all' })
    expect(wrapper.vm.opened).toEqual(['0', '0.0', '1', '1.0'])
  })
  it('close all on switch-all event if opened not empty', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'switch-all' })
    expect(wrapper.vm.opened).toEqual([])
  })
  it('delete item by id, if it active item clear activeItem and reindexes menuItem on delete-by-id event', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    await wrapper.setData({ activeItem: { id: '0.0' } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'delete-by-id', id: '0.0' })
    expect(wrapper.vm.menuItems).toEqual([
      {
        title: 'test0',
        id: '0',
        index: 0,
        menuItems: [],
      },
      {
        title: 'test1',
        id: '1',
        index: 1,
        menuItems: [{
          id: '1.0',
          index: 2,
          title: 'test1.0',
        }],
      },
    ])
    expect(wrapper.vm.activeItem).toEqual({ id: '', index: '' })
  })
  it('show console error on delete-by-id event when id does not found', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'delete-by-id', id: '0.0.1' })
    expect(errSpy).toBeCalledWith('Id does not found')
  })
  it('delete item by index, if it active item clear activeItem and reindexes menuItem on delete-by-id event', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    await wrapper.setData({ activeItem: { id: '0.0', index: 1 } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'delete-by-index', index: 1 })
    expect(wrapper.vm.menuItems).toEqual([
      {
        title: 'test0',
        id: '0',
        index: 0,
        menuItems: [],
      },
      {
        title: 'test1',
        id: '1',
        index: 1,
        menuItems: [{
          id: '1.0',
          index: 2,
          title: 'test1.0',
        }],
      },
    ])
    expect(wrapper.vm.activeItem).toEqual({ id: '', index: '' })
  })
  it('show console error on delete-by-index event when index does not found', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'delete-by-index', index: 8 })
    expect(errSpy).toBeCalledWith('Index does not found')
  })
  it('show in console activeItem id on get-active-id event', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    await wrapper.setData({ activeItem: { id: '0.0' } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'get-active-id' })
    expect(logSpy).toBeCalledWith('0.0')
  })
  it('show in console null if not activeItem on get-active-id event', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'get-active-id' })
    expect(logSpy).toBeCalledWith(null)
  })
  it('show in console activeItem index and parent on get-active-index event', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    await wrapper.setData({ activeItem: { id: '0.0', index: 1 } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'get-active-index' })
    expect(logSpy.mock.calls[0][0]).toBe(1)
    expect(logSpy.mock.calls[1][0]).toEqual({
      title: 'test0',
      id: '0',
      index: 0,
      menuItems: [{
        title: 'test0.0',
        id: '0.0',
        index: 1,
        url: '/test',
      }],
    })
  })
  it('does not add item on add-item event without payload', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'add-item', payload: {} })
    expect(errSpy).toBeCalledWith('Item or position does not provided')
  })
  it('add item on add-item event without parent', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData(), menuItems: [{ title: 'test0' }] } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'add-item', payload: { item: { title: 'test1' }, position: 0 } })
    expect(wrapper.vm.menuItems).toEqual([
      { title: 'test1', id: '0', index: 0 },
      { title: 'test0', id: '1', index: 1 },
    ])
  })
  it('does not add item on add-item event if parent provided but not found', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'add-item', payload: { item: {}, position: 0, parentId: '0.0.0.0' } })
    expect(errSpy).toBeCalledWith('Parent does not found')
  })
  it('add item on add-item event with parent', async () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData(), menuItems: [{ title: 'test0' }] } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'add-item', payload: { item: { title: 'test1' }, position: 0, parentId: '0' } })
    expect(wrapper.vm.menuItems).toEqual([
      {
        title: 'test0',
        id: '0',
        index: 0,
        menuItems: [
          { title: 'test1', id: '0.0', index: 1 },
        ],
      },
    ])
  })
  it('show console error when incorrect event provided', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    wrapper.vm.$options.watch.event.call(wrapper.vm, { type: 'test' })
    expect(errSpy).toBeCalledWith('Incorrect event provided')
  })
  it('get item by id with getItemById method', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    const testData = [
      { id: '0', menuItems: [{ id: '0.0', menuItems: [{ id: '0.0.0' }] }] },
    ]
    expect(wrapper.vm.getItemById(testData, '0.0')).toEqual({ id: '0.0', menuItems: [{ id: '0.0.0' }] })
  })
  it('return empty array if menuItems does not provided', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { divider: false, multiple: true, defaultItem: '1' } })
    expect(wrapper.vm.menuItems).toEqual([])
  })
  it('define if item parent or not with isParent method', () => {
    const { wrapper } = createWrapper(Menu, true, { propsData: { ...propsData() } })
    expect(wrapper.vm.isParent('0.0', '0.0.0')).toBe(true)
    expect(wrapper.vm.isParent('0.0.0.0', '0.0.0')).toBe(false)
  })
})
