// Layout
import { defineComponent, ref } from 'vue'
import Sidebar from '../components/Sidebar'
import Main from '../components/Main'

export default defineComponent({
  name: 'Layout',
  setup() {
    const isSidebarOpen = ref(true)

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value
    }

    return () => (
      <div class="flex h-full w-full">
        <Sidebar isOpen={isSidebarOpen.value} />
        <Main isOpen={isSidebarOpen.value} toggleSidebar={toggleSidebar} />
      </div>
    )
  }
})
