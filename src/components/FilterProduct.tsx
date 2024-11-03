import { flip, offset, shift, useFloating } from '@floating-ui/vue'
import { defineComponent, ref } from 'vue'
import { useProductStore } from '../store/ProductStore'

export default defineComponent({
  name: 'FilterProduct',
  setup() {
    const dataCategory = ref([
      'All Products',
      'Electronics',
      'Computers',
      'Tablets',
      'Wearables',
      'Cameras',
      'Gaming',
      'Drones',
      'Smart Home',
      'Home Appliances',
      'Storage',
      'Accessories',
      'Beauty'
    ])
    const reference = ref(null)
    const floating = ref(null)
    const isShow = ref(false)
    const selectedCategoryTitle = ref('All Products')
    const store = useProductStore()

    const { floatingStyles, placement, x, y, middlewareData, strategy } =
      useFloating(reference, floating, {
        placement: 'bottom-end',
        middleware: [offset(10), flip(), shift()],
        transform: false
      })

    const handleShow = () => {
      isShow.value = !isShow.value
    }

    const handleCategoryClick = (category: string) => {
      if (category) {
        selectedCategoryTitle.value = category || ''
        store.handleCategorySelect(category === 'All Products' ? '' : category)
        isShow.value = false
      }
    }

    return () => (
      <div>
        <div>
          <button
            ref={reference}
            class="inline-flex items-center text-gray-500 bg-[#fff] border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
            onClick={handleShow}
            v-model={selectedCategoryTitle.value}
          >
            <span class="sr-only"></span>
            {store.selectedCategory || 'All Products'}
            {isShow.value ? (
              <svg
                class="w-2.5 h-2.5 ms-2.5  transform rotate-180 transition-transform duration-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            ) : (
              <svg
                class="w-2.5 h-2.5 ms-2.5 transition-transform duration-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            )}
          </button>
          {isShow.value && (
            <div
              ref={floating}
              style={{ ...floatingStyles.value }}
              class="z-10 bg-[#fff] divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <ul
                class="py-2 px-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownActionButton"
              >
                {dataCategory.value.map((item) => {
                  return (
                    <li>
                      <button
                        onclick={() => handleCategoryClick(item)}
                        type="button"
                        class="block w-full text-left px-4 py-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {item}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }
})
