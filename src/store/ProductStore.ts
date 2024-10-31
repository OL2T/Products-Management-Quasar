import { defineStore } from 'pinia'
import { computed, onMounted, ref, watchEffect } from 'vue'
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCT_BY_ID,
  GET_PRODUCTS,
  GET_TOTAL_PRODUCTS,
  UPDATE_PRODUCT
} from '../graphql/productQueries'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useRoute, useRouter } from 'vue-router'

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
  const product = ref<Product>()
  const isLoading = ref(false)
  const querySearch = ref('')
  const isShowCreateModal = ref(false)
  const isPopoverConfirmOpen = ref(false)
  const currentPage = ref(1)
  const itemsPerPage = ref(10) // Set items per page
  const totalItems = ref(0)
  const routes = useRoute()
  const router = useRouter()

  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage.value)
  })

  const filterProducts = computed(() => {
    return products.value.filter((product) =>
      product.name.toLowerCase().includes(querySearch.value.toLowerCase())
    )
  })

  const detailProduct = computed(() => {
    return products.value.find((product) => product.id === routes.params.id)
  })

  // Fetch products

  const {
    result: totalProductsResult,
    loading: totalLoading,
    error: totalError,
    refetch: totalProductRefetch
  } = useQuery(GET_TOTAL_PRODUCTS, {
    searchQuery: `%${querySearch.value}%`
  })

  watchEffect(async () => {
    isLoading.value = totalLoading.value
    if (totalProductsResult.value) {
      totalItems.value =
        totalProductsResult.value.products_aggregate.aggregate.count
    }

    console.log('Total Item From GET TOTAL', totalItems.value)

    if (totalError.value) {
      console.error('Error fetching total products:', totalError.value)
    }
  })

  const { result, loading, error, fetchMore, refetch } = useQuery(
    GET_PRODUCTS,
    {
      limit: itemsPerPage.value,
      offset: (currentPage.value - 1) * itemsPerPage.value,
      searchQuery: `%${querySearch.value}%`
    }
  )

  watchEffect(async () => {
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
      return
    }
  })
  const handleChangeInput = async (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement
    querySearch.value = target.value

    if (e.key === 'Enter') {
      currentPage.value = 1 // Đặt lại trang hiện tại về 1 khi tìm kiếm mới
      await performSearch() // Gọi hàm tìm kiếm
    }
  }

  const performSearch = async () => {
    await refetch({
      limit: itemsPerPage.value,
      offset: 0,
      searchQuery: `%${querySearch.value}%`
    })

    // Refetch total items with the current search query
    const refetchResult = await totalProductRefetch({
      searchQuery: `%${querySearch.value}%`
    })
    if (
      refetchResult &&
      refetchResult.data &&
      refetchResult.data.products_aggregate
    ) {
      totalItems.value = refetchResult.data.products_aggregate.aggregate.count
      console.log('Total Items After Search:', totalItems.value)
    }
    router.replace({
      query: { ...routes.query, search: querySearch.value }
    })
  }

  watchEffect(() => {
    performSearch()
  })

  const searchQuery = routes.query.search as string
  onMounted(() => {
    if (searchQuery) {
      querySearch.value = searchQuery
      performSearch()
    }
  })

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return

    currentPage.value = page
    const newOffset = (currentPage.value - 1) * itemsPerPage.value

    fetchMore({
      variables: { offset: newOffset, limit: itemsPerPage.value },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult
        return {
          ...previousResult,
          products: fetchMoreResult.products // Cập nhật các sản phẩm mới cho trang hiện tại
        }
      }
    })
  }

  const fetchProductById = (id: string) => {
    const { result, loading, error } = useQuery(GET_PRODUCT_BY_ID, { id })

    watchEffect(() => {
      isLoading.value = loading.value
      if (result.value && result.value.products.length > 0) {
        product.value = result.value.products[0]
      }
      if (error.value) {
        console.error('Error fetching product details:', error.value)
        toast('Error fetching product details', {
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

        totalItems.value += 1
        await totalProductRefetch()

        if (products.value.length > itemsPerPage.value) {
          changePage(currentPage.value + 1)
        }
        isShowCreateModal.value = false
        toast('Product added successfully', {
          theme: 'auto',
          type: 'success',
          position: 'top-right'
        })
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
        await totalProductRefetch()

        totalItems.value -= 1
        console.log('handleDelete: ', totalItems.value)

        if (products.value.length === 0 && currentPage.value > 1) {
          changePage(currentPage.value - 1)
        }
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

  const handleUpdateProduct = async (updatedProduct: Product) => {
    const { mutate } = useMutation(UPDATE_PRODUCT)

    try {
      const response = await mutate({
        id: updatedProduct.id,
        name: updatedProduct.name,
        category: updatedProduct.category,
        description: updatedProduct.description,
        stock: updatedProduct.stock,
        price: updatedProduct.price
      })

      if (response?.data?.update_products?.affected_rows) {
        const updated = response.data.update_products.returning[0]
        const index = products.value.findIndex((p) => p.id === updated.id)
        // console.log('Updated product:', updated)
        // console.log(index)
        if (index !== -1) {
          console.log(products.value[index])
          products.value = [
            ...products.value.slice(0, index),
            updated,
            ...products.value.slice(index + 1)
          ]
        }

        toast('Product updated successfully', {
          theme: 'auto',
          type: 'success',
          position: 'top-right',
          onClose: () => router.push({ path: '/products' })
        })
      } else {
        throw new Error('Failed to update product. No rows affected.')
      }
    } catch (error) {
      toast('Error updating product', {
        theme: 'auto',
        type: 'error',
        position: 'top-right'
      })
      console.error('Error updating product:', error)
    }
  }

  return {
    result,
    loading,
    error,
    product,
    products,
    isLoading,
    filterProducts,
    isShowCreateModal,
    detailProduct,
    isPopoverConfirmOpen,
    currentPage,
    totalItems,
    itemsPerPage,
    handleChangeInput,
    handleAddProduct,
    handleDeleteProduct,
    fetchProductById,
    handleUpdateProduct,
    changePage,
    searchQuery
  }
})
