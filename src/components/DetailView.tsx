import { defineComponent, onMounted } from 'vue'
import { useProductStore } from '../store/productStore'
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
      console.log(productId)
      store.fetchProductById(
        Array.isArray(productId) ? productId[0] : productId
      )
    })

    console.log(route.params.id)
    return () => (
      <div>
        {store.isLoading ? (
          <div>Loading...</div>
        ) : (
          store.product && (
            <div class="bg-[#fff] dark:bg-gray-800 text-white p-4">
              <div>
                <h2 class="leading-normal font-bold text-2xl mb-4">
                  Detail Product:
                </h2>
                <div>Product id: {store.product.id}</div>
                <div>Product name: {store.product.name}</div>
                <div>Product description: {store.product.description}</div>
                <div>Product category: {store.product.category}</div>
                <div>Product stock: {store.product.stock}</div>
                <div>Product price: {store.product.price}</div>
              </div>
              <button
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
