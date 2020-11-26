import MenuBadge from '@/components/MenuBadge.vue'
import { createWrapper } from './utils'

describe('MenuBadge', () => {
  it('render chip and pass correct data to it if icon value does not provided', () => {
    const value = 'test'
    const color = 'test'
    const { wrapper } = createWrapper(MenuBadge, true, { propsData: { value, color } })
    const vChip = wrapper.findComponent({ name: 'v-chip' })
    expect(vChip.exists()).toBe(true)
    expect(vChip.text()).toBe(value)
    expect(vChip.attributes('color')).toBe(color)
  })
  it('render icon and pass correct data to it if icon value provided', () => {
    const value = 'mdi-arrow-down'
    const color = 'test'
    const { wrapper } = createWrapper(MenuBadge, false, { propsData: { value, color } })
    const vIcon = wrapper.findComponent({ name: 'v-icon' })
    const classList = vIcon.attributes('class').split(' ')
    expect(vIcon.exists()).toBe(true)
    expect(classList.includes(value)).toBe(true)
    expect(classList.includes(`${color}--text`)).toBe(true)
  })
  it('render dot and pass correct data to it if value does not provided', () => {
    const color = 'test'
    const { wrapper } = createWrapper(MenuBadge, true, { propsData: { color } })
    const dot = wrapper.find('.dot')
    const classList = dot.attributes('class').split(' ')
    expect(dot.exists()).toBe(true)
    expect(classList.includes(color)).toBe(true)
  })
})
