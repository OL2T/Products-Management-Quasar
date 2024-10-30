import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  watchEffect
} from 'vue'
import { useProductStore } from '../store/productStore'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import TableSkeleton from './TableSkeleton'
import Create from './Create'

export default defineComponent({
  setup() {
    const store = useProductStore()
    const router = useRouter()
    const activePopoverId = ref<number | null>(null)

    const handlePageChange = (newPage: number) => {
      store.changePage(newPage)
    }

    const handleShowPopover = (id: number) => {
      if (activePopoverId.value !== id) {
        activePopoverId.value = id

        // console.log('Active productId: ', activePopoverId.value)
      } else {
        activePopoverId.value = null
      }
    }

    const handleShowConfirmPopover = () => {
      store.isPopoverConfirmOpen = true
    }

    const handleDeleteProduct = (id: string) => {
      store.handleDeleteProduct(id)
      store.isPopoverConfirmOpen = false
    }

    const totalPages = computed(() => {
      return Math.ceil(store.totalItems / store.itemsPerPage)
    })

    return {
      store,
      activePopoverId,
      router,
      totalPages,
      handleShowPopover,
      handleDeleteProduct,
      handleShowConfirmPopover,
      handlePageChange
    }
  },

  render() {
    const {
      store,
      activePopoverId,
      router,
      totalPages,
      handleShowPopover,
      handleShowConfirmPopover,
      handleDeleteProduct,
      handlePageChange
    } = this

    return (
      <div class="relative">
        <div class="filter flex items-center mb-5 gap-x-4">
          <input
            type="text"
            class="flex-auto px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none  dark:bg-gray-800 dark:text-white"
            placeholder="Search products..."
            onInput={(e: any) => store.handleChangeInput(e)}
          />

          <div>
            <button
              id="dropdownActionButton"
              data-dropdown-toggle="dropdownAction"
              class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              <span class="sr-only">Sort By</span>
              Action
              <svg
                class="w-2.5 h-2.5 ms-2.5"
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
            </button>

            <div
              id="dropdownAction"
              class="z-10 hidden bg-[#fff] divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <ul
                class="py-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownActionButton"
              >
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Reward
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Promote
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Activate account
                  </a>
                </li>
              </ul>
              <div class="py-1">
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Delete User
                </a>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              onClick={() => (store.isShowCreateModal = true)}
              type="button"
              class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 px-5 py-2"
            >
              Create New
            </button>
            {store.isShowCreateModal && (
              <div class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div class="bg-[#fff] rounded-sm shadow-sm mx-4 dark:bg-gray-800">
                  <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Create New Product
                    </h3>
                    <button
                      type="button"
                      onClick={() => (store.isShowCreateModal = false)}
                      class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-toggle="crud-modal"
                    >
                      <svg
                        class="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span class="sr-only">Close modal</span>
                    </button>
                  </div>
                  <Create />
                </div>
              </div>
            )}
          </div>
        </div>
        <div class="flex flex-col">
          <div class="product-list w-full flex-1 max-h-[750px] overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-sm max-h-[750px] overflow-auto">
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

              {store.isLoading ? (
                <TableSkeleton />
              ) : (
                <tbody>
                  {store.products.map((product: any, index: number) => (
                    <tr
                      key={product.id}
                      // class={`${
                      //   index % 2 == 0 ? 'bg-gray-100' : 'bg-[#fff]'
                      // } border-b dark:bg-gray-800 dark:border-gray-700`}
                      class="bg-[#fff] dark:bg-gray-800 dark:border-gray-700 border-b"
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
                          class="hover:cursor-pointer text-[#fff]"
                        >
                          <svg
                            class={[
                              'w-6 h-6',
                              activePopoverId && activePopoverId === product.id
                                ? 'text-blue-500 dark:text-blue-300'
                                : 'text-gray-800 dark:text-gray-400'
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
                          <div class="absolute bg-gray-100 dark:bg-gray-700 min-w-[max-content] top-[55px] right-4 z-50 py-2 px-1 rounded-sm flex flex-col shadow-lg">
                            <div className="absolute top-0 right-[10px] border-x-transparent border-t-transparent border-b-[10px]">
                              <div class="w-0 h-0 absolute right-0 -translate-y-full border-x-transparent border-x-[11px] border-t-transparent border-t-[9px] border-b-[9px] border-b-gray-100 dark:border-b-gray-700"></div>
                            </div>
                            <button
                              onClick={(event: Event) => {
                                event.stopPropagation()
                                router.push({ path: `product/${product.id}` })
                              }}
                              class="flex items-center gap-x-2 px-3 py-2 dark:child:text-[#fff] hover:bg-[#fff] dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              <svg
                                class="w-4 h-4"
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
                            <button
                              onClick={(event: Event) => {
                                event.stopPropagation()
                                router.push({ path: `update/${product.id}` })
                              }}
                              class="flex items-center gap-x-2 px-3 py-2 dark:child:text-[#fff] hover:bg-[#fff] dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              <svg
                                class="w-4 h-4"
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
                            <button
                              onClick={handleShowConfirmPopover}
                              class="flex items-center gap-x-2 px-3 py-2  hover:bg-[#fff] dark:hover:bg-gray-600 dark:text-[#fff] hover:text-red-500 child-hover:text-red-500  dark:child-hover:text-red-500"
                            >
                              <svg
                                class="w-4 h-4"
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
                            {store.isPopoverConfirmOpen && (
                              <div class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full bg-[#000] bg-opacity-80">
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-md max-h-full">
                                  <div class="relative bg-[#fff] rounded-lg shadow dark:bg-gray-700">
                                    <button
                                      onClick={() =>
                                        (store.isPopoverConfirmOpen = false)
                                      }
                                      type="button"
                                      class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                      data-modal-hide="popup-modal"
                                    >
                                      <svg
                                        class="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                      >
                                        <path
                                          stroke="currentColor"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                      </svg>
                                      <span class="sr-only">Close modal</span>
                                    </button>
                                    <div class="p-4 md:p-5 text-center">
                                      <svg
                                        class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          stroke="currentColor"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                      </svg>
                                      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        Are you sure you want to delete this
                                        product?
                                      </h3>
                                      <button
                                        data-modal-hide="popup-modal"
                                        type="button"
                                        onClick={() =>
                                          handleDeleteProduct(product.id)
                                        }
                                        class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                      >
                                        Yes, I'm sure
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          (store.isPopoverConfirmOpen = false)
                                        }
                                        class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-[#fff] rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                      >
                                        No, cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <nav
            class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 mt-auto"
            aria-label="Table navigation"
          >
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing{' '}
              <span class="font-semibold text-gray-900 dark:text-white">
                {(store.currentPage - 1) * store.itemsPerPage + 1}-
                {Math.min(
                  store.currentPage * store.itemsPerPage,
                  store.totalItems
                )}
              </span>{' '}
              of{' '}
              <span class="font-semibold text-gray-900 dark:text-white">
                {store.totalItems}
              </span>
            </span>
            <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                <button
                  disabled={store.currentPage <= 1}
                  onClick={() => handlePageChange(store.currentPage - 1)}
                  class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-[#fff] border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1}>
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    class={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500  border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                      store.currentPage === index + 1
                        ? 'is-active bg-blue-50 text-gray-700 dark:bg-gray-700 dark:text-white'
                        : 'bg-[#fff] dark:bg-gray-800'
                    }`} // Đánh dấu trang hiện tại
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li>
                <button
                  disabled={store.currentPage >= totalPages}
                  onClick={() => handlePageChange(store.currentPage + 1)}
                  class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-[#fff] border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    )
  }
})
