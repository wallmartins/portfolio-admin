import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityFeed from '~/components/features/dashboard/ActivityFeed.vue'

describe('ActivityFeed', () => {
  it('should render empty state when no activities', () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        activities: []
      }
    })

    expect(wrapper.text()).toContain('No recent activity')
    expect(wrapper.text()).toContain('Start by creating content')
  })

  it('should render activities list', () => {
    const activities = [
      {
        id: '1',
        type: 'post' as const,
        action: 'created' as const,
        title: 'Test Post',
        timestamp: new Date('2024-01-01')
      },
      {
        id: '2',
        type: 'project' as const,
        action: 'updated' as const,
        title: 'Test Project',
        timestamp: new Date('2024-01-02')
      }
    ]

    const wrapper = mount(ActivityFeed, {
      props: {
        activities
      }
    })

    expect(wrapper.text()).toContain('Test Post')
    expect(wrapper.text()).toContain('Test Project')
    expect(wrapper.text()).toContain('created')
    expect(wrapper.text()).toContain('updated')
  })

  it('should limit activities to maxItems', () => {
    const activities = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      type: 'post' as const,
      action: 'created' as const,
      title: `Post ${i}`,
      timestamp: new Date()
    }))

    const wrapper = mount(ActivityFeed, {
      props: {
        activities,
        maxItems: 3
      }
    })

    expect(wrapper.text()).toContain('Post 0')
    expect(wrapper.text()).toContain('Post 1')
    expect(wrapper.text()).toContain('Post 2')
    expect(wrapper.text()).not.toContain('Post 3')
  })

  it('should display correct color for action types', () => {
    const activities = [
      {
        id: '1',
        type: 'post' as const,
        action: 'created' as const,
        title: 'Created Post',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'post' as const,
        action: 'updated' as const,
        title: 'Updated Post',
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'post' as const,
        action: 'deleted' as const,
        title: 'Deleted Post',
        timestamp: new Date()
      }
    ]

    const wrapper = mount(ActivityFeed, {
      props: {
        activities
      }
    })

    const html = wrapper.html()
    expect(html).toContain('text-green-500') // created
    expect(html).toContain('text-blue-500')  // updated
    expect(html).toContain('text-red-500')   // deleted
  })
})
