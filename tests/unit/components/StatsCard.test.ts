import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsCard from '~/components/features/dashboard/StatsCard.vue'
import { FileText } from 'lucide-vue-next'

describe('StatsCard', () => {
  it('should render with required props', () => {
    const wrapper = mount(StatsCard, {
      props: {
        title: 'Total Posts',
        value: 42,
        icon: FileText
      }
    })

    expect(wrapper.text()).toContain('Total Posts')
    expect(wrapper.text()).toContain('42')
  })

  it('should display description when provided', () => {
    const wrapper = mount(StatsCard, {
      props: {
        title: 'Total Posts',
        value: 42,
        icon: FileText,
        description: 'Published blog posts'
      }
    })

    expect(wrapper.text()).toContain('Published blog posts')
  })

  it('should display positive trend indicator', () => {
    const wrapper = mount(StatsCard, {
      props: {
        title: 'Total Posts',
        value: 42,
        icon: FileText,
        trend: {
          value: 12,
          isPositive: true
        }
      }
    })

    expect(wrapper.text()).toContain('12%')
    expect(wrapper.html()).toContain('text-green-500')
  })

  it('should display negative trend indicator', () => {
    const wrapper = mount(StatsCard, {
      props: {
        title: 'Total Posts',
        value: 42,
        icon: FileText,
        trend: {
          value: 5,
          isPositive: false
        }
      }
    })

    expect(wrapper.text()).toContain('5%')
    expect(wrapper.html()).toContain('text-red-500')
  })

  it('should not display trend when not provided', () => {
    const wrapper = mount(StatsCard, {
      props: {
        title: 'Total Posts',
        value: 42,
        icon: FileText
      }
    })

    expect(wrapper.html()).not.toContain('text-green-500')
    expect(wrapper.html()).not.toContain('text-red-500')
  })
})
