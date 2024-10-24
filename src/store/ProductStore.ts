import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { ADD_PRODUCT, GET_PRODUCTS } from '../graphql/queries'
import { useMutation, useQuery } from '@vue/apollo-composable'

interface Product {
  id: string
  name: string
  description: string
  category: string
  stock: number
  price: number
}

export const useProductStore = defineStore('products', () => {
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

    // Watch for changes in `data` and update `products`
    watchEffect(() => {
      if (loading.value) {
        isLoading.value = true
      } else {
        isLoading.value = false
      }
      if (result.value) {
        products.value = result.value.products
      }
      if (error.value) {
        console.error('Error fetching products:', error.value)
      }
    })
  }

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    const { mutate } = useMutation(ADD_PRODUCT)

    try {
      const response = await mutate({
        category: newProduct.category,
        description: newProduct.description,
        name: newProduct.name,
        stock: newProduct.stock,
        price: newProduct.price
      })

      if (response?.data?.insert_products?.returning) {
        const addedProduct = response.data.insert_products.returning[0]
        products.value.push(addedProduct) // Add the new product to the store
        console.log('Product added:', addedProduct)
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return {
    products,
    isLoading,
    filterProducts,
    fetchProducts,
    handleChangeInput,
    addProduct
  }
})
