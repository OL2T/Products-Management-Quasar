import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { GET_PRODUCTS } from '../graphql/queries'
import { useQuery } from '@vue/apollo-composable'

interface Product {
  id: string
  name: string
  description: string
  category: string
  stock: number
  price: number
}

export const useStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const querySearch = ref('')

  const handleChangeInput = (e: any) => {
    querySearch.value = e.target.value
  }

  const filterProducts = computed(() => {
    return products.value.filter((product) =>
      product.name.toLowerCase().includes(querySearch.value.toLowerCase())
    )
  })

  const fetchProducts = () => {
    const { result, loading, error } = useQuery(GET_PRODUCTS)

    isLoading.value = loading.value

    // Watch for changes in `data` and update `products`
    watchEffect(() => {
      if (result.value) {
        products.value = result.value.products
      }
      if (error.value) {
        console.error('Error fetching products:', error.value)
      }
    })
  }

  return { products, filterProducts, fetchProducts, handleChangeInput }
})
