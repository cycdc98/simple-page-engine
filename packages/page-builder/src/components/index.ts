import type { App } from 'vue'
import FlowLayout from './FlowLayout.vue'

export default {
  install(app: App) {
    app.component('FlowLayout', FlowLayout)
  }
}
