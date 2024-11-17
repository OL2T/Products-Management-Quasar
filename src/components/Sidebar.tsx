// Sidebar
import { defineComponent, Prop, PropType } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../store/authStore'

export default defineComponent({
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  setup(props) {
    const route = useRoute()
    const authStore = useAuthStore()

    const isActive = (path: string) => {
      return route.path === path ? 'bg-gray-300 dark:bg-gray-600' : ''
    }

    return () => (
      <aside
        id="default-sidebar"
        class={[
          'fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800 dark:text-gray-400 transition-transform transform duration-300',
          props.isOpen ? 'translate-x-0' : '-translate-x-full'
        ]}
        aria-label="Sidebar"
      >
        <div class="p-4">
          <div class="w-full text-center text-3xl font-bold mb-5">
            <RouterLink to="/">Logo</RouterLink>
          </div>
        </div>

        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul class="space-y-2 font-medium">
            <li>
              <RouterLink
                to="/dashboard"
                class={[
                  'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
                  isActive('/dashboard')
                ]}
              >
                <svg
                  class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span class="ms-3">Dashboard</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/profile"
                class={[
                  'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
                  isActive('/profile')
                ]}
              >
                <svg
                  class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Profile</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/products"
                class={[
                  'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
                  isActive('/products')
                ]}
              >
                <svg
                  class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Products</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </aside>
    )
  }
})
