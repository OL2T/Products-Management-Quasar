import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from '../store/piniaStore'

export default defineComponent({
  setup() {
    const store = useStore()
    const activePopoverId = ref<number | null>(null)

    onMounted(() => {
      store.fetchProducts()
    })

    const handleShowPopover = (id: number) => {
      if (activePopoverId.value !== id) {
        activePopoverId.value = id

        console.log('Active productId: ', activePopoverId.value)
      } else {
        activePopoverId.value = null
      }
    }

    return {
      store,
      activePopoverId,

      handleShowPopover
    }
  },

  render() {
    const { store, activePopoverId, handleShowPopover } = this

    return (
      <div class="relative">
        <div class="filter flex items-center mb-5 gap-x-4">
          <input
            type="text"
            class="flex-auto px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none  dark:bg-gray-800 dark:text-white"
            placeholder="Search products..."
            onInput={(e: any) => store.handleChangeInput(e)}
          />

          <form class="max-w-sm mx-auto">
            <select
              id="products"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Sort</option>
              <option value="color">Color</option>
              <option value="category">Category</option>
              <option value="price">Price</option>
            </select>
          </form>
          <div class="flex justify-end">
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Create New
            </button>
          </div>
        </div>
        <div class="">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-sm overflow-x-auto">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  S/N
                </th>
                <th scope="col" class="px-6 py-3">
                  Product name
                </th>
                <th scope="col" class="px-6 py-3">
                  Description
                </th>
                <th scope="col" class="px-6 py-3">
                  Category
                </th>
                <th scope="col" class="px-6 py-3">
                  Price
                </th>
                <th scope="col" class="px-6 py-3">
                  Stock
                </th>
                <th scope="col" class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {store.filterProducts.map((product: any, index: number) => (
                <tr
                  key={product.id}
                  class={`${
                    index % 2 == 0 ? 'bg-gray-100' : 'bg-[#fff]'
                  } border-b dark:bg-gray-800 dark:border-gray-700`}
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th>
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {product.name}
                  </th>
                  <td class="px-6 py-4">{product.description}</td>
                  <td class="px-6 py-4">{product.category}</td>
                  <td class="px-6 py-4">${product.price}</td>
                  <td class="px-6 py-4">{product.stock}</td>
                  <td class="px-6 py-4 flex items-center justify-end relative">
                    <button
                      onClick={() => handleShowPopover(product.id)}
                      class="hover:cursor-pointer"
                    >
                      <svg
                        class={[
                          'w-6 h-6 dark:text-white',
                          activePopoverId && activePopoverId === product.id
                            ? 'text-blue-500'
                            : 'text-gray-800'
                        ]}
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
                          stroke-width="3"
                          d="M12 6h.01M12 12h.01M12 18h.01"
                        />
                      </svg>
                    </button>

                    {activePopoverId === product.id && (
                      <div
                        // ref={floating}
                        // style={{
                        //   ...floatingStyles,
                        //   position: strategy,
                        //   // top: `${y}px`,
                        //   // left: `${x}px`,
                        //   width: 'max-content'
                        // }}
                        class="absolute bg-[#fff] min-w-[max-content] top-[50px] right-0 z-50 p-2 rounded-sm flex flex-col gap-y-3 shadow-sm border"
                      >
                        <button class="items-center  font-medium hover:text-gray-500 flex gap-x-4">
                          <svg
                            class="w-4 h-4 text-gray-500 dark:text-white hover:text-gray-800 dark:hover:text-gray-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              stroke-width="2"
                              d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                            />
                            <path
                              stroke="currentColor"
                              stroke-width="2"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                          <div>View Detail</div>
                        </button>
                        <button class="items-center font-medium hover:text-gray-500 flex gap-x-4">
                          <svg
                            class="w-4 h-4 text-gray-500 dark:text-white hover:text-gray-800"
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
                              stroke-width="2"
                              d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                            />
                          </svg>
                          <div>Edit</div>
                        </button>
                        <button class="items-center text-red-500 font-medium hover:text-gray-500 flex gap-x-4">
                          <svg
                            class="w-4 h-4 text-red-500 dark:text-white hover:text-red-700 dark:hover:text-gray-300"
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
                              stroke-width="2"
                              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                            />
                          </svg>
                          <div>Delete</div>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
})
