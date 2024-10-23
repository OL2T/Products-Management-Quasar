// Layout
import { defineComponent } from 'vue'
import Sidebar from '../components/Sidebar'
import { TextComponent } from './textComponent'
import Main from '../components/Main'

export default defineComponent({
  setup() {
    return () => (
      <div class="flex h-full w-full">
        <Sidebar />
        <Main />
      </div>
    )
  }
})
