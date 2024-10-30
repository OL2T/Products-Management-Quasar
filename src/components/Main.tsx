import { defineComponent, ref } from 'vue'
import { useAuthStore } from '../store/authStore'
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/vue'
export default defineComponent({
  setup() {
    const isShow = ref(false)
    const authStore = useAuthStore()
    const reference = ref(null)
    const floating = ref(null)
    const floatingArrow = ref(null)

    const user = JSON.parse(localStorage.getItem('user') || '{}')

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
      // left: middlewareData.value.arrow?.x
      //   ? `${middlewareData.value.arrow.x}px`
      //   : '',
      // top: middlewareData.value.arrow?.y
      //   ? `${middlewareData.value.arrow.y}px`
      //   : '',
      transform: placement.value.includes('bottom')
        ? 'rotate(45deg)'
        : placement.value.includes('top')
        ? 'rotate(-135deg)'
        : placement.value.includes('left')
        ? 'rotate(135deg)'
        : 'rotate(-45deg)'
    }
    return () => (
      <main class="flex-1 sm:max-w-[calc(100%-280px)] ml-auto dark:bg-gray-500 h-[100vh]">
        <div class="header-main flex items-center justify-between w-full bg-[#fff] dark:bg-gray-800 dark:text-white p-3 shadow-sm">
          <h4 class="font-medium text-lg">Title</h4>
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
              <div>
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
                  class="z-50 bg-[#fff] border  divide-y divide-gray-100 rounded-lg shadow-md  dark:bg-gray-700 dark:divide-gray-600"
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
                      <a
                        href="#"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Earnings
                      </a>
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
              </div>
            )}
          </div>
        </div>
        <div class="p-4">
          <router-view />
        </div>
      </main>
    )
  }
})
