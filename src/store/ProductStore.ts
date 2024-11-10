import { defineStore } from 'pinia'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  GET_FILTERED_PRODUCT,
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
  const selectedCategory = ref('')

  const {
    result: dataFiltered,
    error: errorFiltered,
    refetch: refetchDataFiltered,
    fetchMore: fetchMoreDataFiltered
  } = useQuery(GET_FILTERED_PRODUCT, {
    limit: itemsPerPage.value,
    offset: (currentPage.value - 1) * itemsPerPage.value,
    category: selectedCategory.value
  })

  // Fetch products
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
      totalItems.value = result.value.products_aggregate.aggregate.count
    }
    if (dataFiltered.value && dataFiltered.value.products.length > 0) {
      products.value = dataFiltered.value.products
      totalItems.value = dataFiltered.value.products_aggregate.aggregate.count
    }

    if (error.value || errorFiltered.value) {
      console.error('Error fetching products:', error.value)
    }
  })

  const handleChangeInput = async (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement
    querySearch.value = target.value

    if (e.key === 'Enter') {
      currentPage.value = 1
      await performSearch()
    }
  }

  const performSearch = async () => {
    const refetchResult = await refetch({
      limit: itemsPerPage.value,
      offset: 0,
      searchQuery: `%${querySearch.value}%`
    })
    if (refetchResult?.data && refetchResult.data.products_aggregate) {
      totalItems.value = refetchResult.data.products_aggregate.aggregate.count // Update total based on filter
      products.value = refetchResult.data.products
    }

    if (selectedCategory.value) {
      products.value = products.value.filter(
        (product) => product.category === selectedCategory.value
      )
      // await refetchDataFiltered({
      //   limit: itemsPerPage.value,
      //   offset: 0,
      //   category: selectedCategory.value
      // })
      // products.value = dataFiltered.value.products
      totalItems.value = products.value.length // Cập nhật tổng số sản phẩm sau khi lọc
    }

    router.replace({
      query: {
        ...routes.query,
        search: querySearch.value,
        category: selectedCategory.value
      }
    })
  }

  watch([querySearch], async () => {
    currentPage.value = 1 // Reset to page 1 on new filter or search
    await performSearch()
  })

  const searchQuery = routes.query.search as string

  onMounted(() => {
    if (searchQuery) {
      querySearch.value = searchQuery
      performSearch()
    }
  })

  const handleCategorySelect = async (category: string) => {
    selectedCategory.value = category
    currentPage.value = 1

    const refetchResult = await refetchDataFiltered({
      limit: itemsPerPage.value,
      offset: 0,
      category: selectedCategory.value
    })

    if (refetchResult?.data?.products) {
      products.value = refetchResult.data.products
      totalItems.value = refetchResult.data.products_aggregate.aggregate.count
    }

    if (selectedCategory.value === '') {
      await refetch()
    }

    router.replace({
      query: {
        ...routes.query,
        search: querySearch.value,
        category: selectedCategory.value
      }
    })
  }

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return

    currentPage.value = page
    const newOffset = (currentPage.value - 1) * itemsPerPage.value

    if (selectedCategory.value) {
      refetchDataFiltered({
        limit: itemsPerPage.value,
        offset: newOffset,
        category: selectedCategory.value
      })
    } else {
      refetch({
        limit: itemsPerPage.value,
        offset: newOffset,
        searchQuery: `%${querySearch.value}%`
      })
    }
  }

  onMounted(() => {
    if (routes.query.search) querySearch.value = routes.query.search as string
    if (routes.query.category) {
      selectedCategory.value = routes.query.category as string
      refetchDataFiltered({
        limit: itemsPerPage.value,
        offset: 0,
        category: selectedCategory.value
      })
    } else {
      performSearch()
    }
  })

  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage.value)
  })

  const detailProduct = computed(() => {
    return products.value.find((product) => product.id === routes.params.id)
  })

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
        await refetch()
        totalItems.value += 1

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

      if (response?.data?.delete_products?.affected_rows) {
        products.value = products.value.filter((product) => product.id !== id)
        await refetch()
        totalItems.value -= 1

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

        if (index !== -1) {
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
    product,
    products,
    isLoading,
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
    handleCategorySelect,
    searchQuery,
    selectedCategory,
    refetch,
    refetchDataFiltered,
    dataFiltered
  }
})
