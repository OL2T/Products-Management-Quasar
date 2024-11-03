import {
  defineComponent,
  onMounted,
  PropType,
  ref,
  Transition,
  watch
} from 'vue'
import { useAuthStore } from '../store/authStore'
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { RouterLink, useRoute } from 'vue-router'
export default defineComponent({
  name: 'Main Component',
  props: {
    toggleSidebar: {
      type: Function as PropType<() => void>,
      required: true
    },
    isOpen: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  setup() {
    const isShow = ref(false)
    const authStore = useAuthStore()
    const reference = ref(null)
    const floating = ref(null)
    const floatingArrow = ref(null)

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const currentTitle = ref('')

    const route = useRoute()

    const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

    const updateTitle = () => {
      switch (route.path) {
        case '/dashboard':
          currentTitle.value = 'Dashboard'
          break
        case '/products':
          currentTitle.value = 'Products'
          break
        case '/customers':
          currentTitle.value = 'Users'
          break
        case '/product/:id':
          currentTitle.value = 'Product detail'
          break
        case '/update/:id':
          currentTitle.value = 'Update product'
          break
        default:
          currentTitle.value = ''
      }
    }

    // Theo dõi thay đổi đường dẫn
    watch(route, updateTitle, { immediate: true })
    const handleMouseEnter = () => {
      isShow.value = true
    }

    const handleMouseLeave = () => {
      isShow.value = false
    }
    const { floatingStyles, placement, x, y, middlewareData, strategy } =
      useFloating(reference, floating, {
        // strategy: 'fixed',
        placement: 'bottom-end',
        middleware: [
          offset(),
          flip(),
          shift(),
          arrow({ element: floatingArrow, padding: 20 })
        ],
        transform: false
      })

    const floatingArrowStyles = {
      transform: placement.value.includes('bottom')
        ? 'rotate(45deg)'
        : placement.value.includes('top')
        ? 'rotate(-135deg)'
        : placement.value.includes('left')
        ? 'rotate(135deg)'
        : 'rotate(-45deg)'
    }

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value
      const theme = isDarkMode.value ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', isDarkMode.value)
      localStorage.setItem('theme', theme)
    }

    onMounted(() => {
      if (isDarkMode.value) document.documentElement.classList.add('dark')
    })
    return (props) => (
      <main
        class={[
          'flex-1 w-full ml-auto dark:bg-gray-500 h-[100vh] transition-transform transform',
          { 'sm:max-w-[calc(100%-256px)] ml-64': props.isOpen }
        ]}
      >
        <div class="header-main flex items-center justify-between w-full bg-[#fff] dark:bg-gray-800 dark:text-white p-3 shadow-sm">
          <div class="flex items-center gap-x-4">
            <button
              onClick={props.toggleSidebar}
              class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
            >
              <svg
                class="w-8 h-8 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M5 7h14M5 12h14M5 17h10"
                />
              </svg>
            </button>
            <h4 class="font-medium text-lg">{currentTitle.value}</h4>
          </div>
          <div class="flex items-center justify-end gap-x-2">
            <div
              onMouseenter={handleMouseEnter}
              onMouseleave={handleMouseLeave}
              class="relative"
            >
              <div
                ref={reference}
                class="flex items-center gap-x-2 hover:cursor-pointer"
              >
                <div class="font-medium order-1">
                  {user.username ? user.username : ''}
                </div>
                <svg
                  class="w-10 h-10 text-gray-800 dark:text-white order-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              {isShow.value === true && (
                <div
                  ref={floating}
                  style={{
                    ...floatingStyles.value,
                    width: 'max-content',
                    left: `${x.value}px`,
                    top: `${y.value}px`
                  }}
                  onMouseenter={handleMouseEnter}
                  onMouseleave={handleMouseLeave}
                  class="z-50 bg-[#fff] border min-w-44  divide-y divide-gray-100 rounded-lg shadow-md  dark:bg-gray-700 dark:divide-gray-600"
                >
                  <div
                    ref={floatingArrow}
                    style={{
                      ...floatingArrowStyles,
                      position: 'absolute',
                      left:
                        middlewareData.value.arrow?.x != null
                          ? `${middlewareData.value.arrow.x}px`
                          : '',
                      top:
                        middlewareData.value.arrow?.y != null
                          ? `${middlewareData.value.arrow.y}px`
                          : 'abc',
                      width: '12px',
                      height: '12px'
                    }}
                    class="bg-[#fff] dark:bg-gray-700 -mt-[7px] border-l border-t "
                  ></div>
                  <div class="px-4 py-3 text-sm text-gray-900 dark:text-white border-none">
                    <div>{user.username ? user.username : ''}</div>
                    <div class="font-medium truncate">
                      {user.email ? user.email : ''}
                    </div>
                  </div>
                  <ul
                    class="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="avatarButton"
                  >
                    <li>
                      <RouterLink
                        to="/dashboard"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink
                        to="/settings"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Settings
                      </RouterLink>
                    </li>
                  </ul>
                  <div class="py-1">
                    <button
                      onClick={authStore.logout}
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              id="theme-toggle"
              type="button"
              onClick={toggleTheme}
              class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
            >
              {isDarkMode.value ? (
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div class="p-4">
          <router-view />
        </div>
      </main>
    )
  }
})
