/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */

import VueRouter from 'vue-router'
import vuetify from '@/plugins/vuetify'
import createRouter from '@/router'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'

export const createWrapper = (component, shallow = true, options = {}, defaultRouterUri = null) => {
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  const router = createRouter()
  if (defaultRouterUri) {
    router.replace(defaultRouterUri)
  } else {
    router.replace('/')
  }
  const mountOptions = {
    router, vuetify, localVue, ...options,
  }
  return {
    router,
    wrapper: shallow ? shallowMount(component, mountOptions) : mount(component, mountOptions),
  }
}
