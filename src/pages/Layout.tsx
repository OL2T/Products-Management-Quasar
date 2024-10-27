// Layout
import { defineComponent } from 'vue'
import Sidebar from '../components/Sidebar'
import Main from '../components/Main'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'vue-router'

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
