import type { App } from 'vue'
import FlowLayout from './FlowLayout.vue'
import FlexLayout from './FlexLayout.vue'

export default {
  install(app: App) {
    app.component('FlowLayout', FlowLayout)
    app.component('FlexLayout', FlexLayout)
  }
}
