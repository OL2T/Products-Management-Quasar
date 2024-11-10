import { defineComponent, onMounted } from 'vue'
import { useProductStore } from '../store/ProductStore'
import { useRoute, useRouter } from 'vue-router'
import path from 'path'
export default defineComponent({
  name: 'DetailView',
  setup() {
    const store = useProductStore()
    // const product = store.detailProduct
    const route = useRoute()
    const router = useRouter()
    onMounted(() => {
      const productId = route.params.id

      store.fetchProductById(
        Array.isArray(productId) ? productId[0] : productId
      )
    })


    return () => (
      <div>
        {store.isLoading ? (
          <div role="status" class="max-w-sm animate-pulse">
            <div class="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
            <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
            <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
            <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            <span class="sr-only">Loading...</span>
          </div>
        ) : (
          store.product && (
            <div class="bg-[#fff] dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-md">
              <div class="mb-4">
                <h2 class="leading-normal font-bold text-2xl mb-4">
                  Detail Product:
                </h2>
                <div class="text-lg font-medium mb-4">
                  Product name:
                  <span class="font-normal"> {store.product.name}</span>
                </div>
                <div class=" font-medium mb-4">
                  Category:
                  <span class="font-normal"> {store.product.category}</span>
                </div>
                <div class=" font-medium mb-4">
                  Description:
                  <span class="font-normal"> {store.product.description}</span>
                </div>
                <div class=" font-medium mb-4">
                  Stock:
                  <span class="font-normal"> {store.product.stock}</span>
                </div>
                <div class=" font-medium mb-4">
                  Price:
                  <span class="font-normal"> ${store.product.price}</span>
                </div>
              </div>
              <button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={(event: Event) => {
                  event.stopPropagation()
                  router.push({ path: `/update/${route.params.id}` })
                }}
              >
                Edit
              </button>
            </div>
          )
        )}
      </div>
    )
  }
})
