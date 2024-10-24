import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { ADD_PRODUCT, DELETE_PRODUCT, GET_PRODUCTS } from '../graphql/queries'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

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

    watchEffect(() => {
      isLoading.value = loading.value
      if (result.value) {
        products.value = result.value.products
      }
      if (error.value) {
        console.error('Error fetching products:', error.value)
        toast('Error fetching products', {
          theme: 'auto',
          type: 'error',
          position: 'top-right'
        })
      }
    })
  }

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    const { mutate } = useMutation(ADD_PRODUCT)

    try {
      const response = await mutate({
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        stock: newProduct.stock,
        price: newProduct.price
      })

      if (response?.data?.insert_products?.returning?.length) {
        const addedProduct = response.data.insert_products.returning[0]
        products.value = [...products.value, addedProduct]
        products.value.push(addedProduct)

        toast('Product added successfully', {
          theme: 'auto',
          type: 'success',
          position: 'top-right'
        })

        // fetchProducts()
      } else {
        throw new Error('Failed to add product. No product returned.')
      }
      if (!response || !response.data || !response.data.insert_products) {
        throw new Error('Mutation response structure is unexpected.')
      }
    } catch (error) {
      toast('Error adding product', {
        theme: 'auto',
        type: 'error',
        position: 'top-right'
      })
      console.error('Error adding product:', error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const { mutate } = useMutation(DELETE_PRODUCT)

    try {
      const response = await mutate({ id })

      // console.log
      console.log('Delete product mutation response:', response)

      if (response?.data?.delete_products?.affected_rows) {
        products.value = products.value.filter((product) => product.id !== id)
        toast('Product deleted successfully', {
          theme: 'auto',
          type: 'success',
          position: 'top-right'
        })
      } else {
        throw new Error('Failed to delete product. No rows affected.')
      }
    } catch (error) {
      toast('Error deleting product', {
        theme: 'auto',
        type: 'error',
        position: 'top-right'
      })
      console.error('Error deleting product:', error)
    }
  }

  return {
    products,
    isLoading,
    filterProducts,
    fetchProducts,
    handleChangeInput,
    handleAddProduct,
    handleDeleteProduct
  }
})
