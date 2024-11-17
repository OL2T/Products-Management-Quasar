import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { GET_USERS_BY_ID, GET_USERS, UPDATE_USER } from '../graphql/userQueries'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

interface User {
  id: string
  email: string | null
  first_name: string
  last_name: string
  username: string
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const { result, loading, error } = useQuery(GET_USERS)

  watchEffect(() => {
    isLoading.value = loading.value
    if (result.value) {
      users.value = result.value.users
    }
    if (error.value) {
      console.error('Error fetching users:', error.value)
      toast('Error fetching users', {
        theme: 'auto',
        type: 'error',
        position: 'top-right'
      })
    }
  })

  const fetchUserById = (id: string) => {
    const { result, loading, error } = useQuery(GET_USERS_BY_ID, { id })

    watchEffect(() => {
      isLoading.value = loading.value
      if (result.value && result.value.users.length > 0) {
        user.value = result.value.users[0]
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

  const handleUpdateUser = async (updatedUser: User) => {
    const { mutate } = useMutation(UPDATE_USER)

    try {
      const response = await mutate({
        id: updatedUser.id,
        username: updatedUser.username,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email
      })

      if (response?.data?.update_users?.affected_rows) {
        const updated = response.data.update_users.returning[0]
        const index = users.value.findIndex((p) => p.id === updated.id)

        if (index !== -1) {
          users.value = [
            ...users.value.slice(0, index),
            updated,
            ...users.value.slice(index + 1)
          ]
        }

        toast('Product updated successfully', {
          theme: 'auto',
          type: 'success',
          position: 'top-right'
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
    users,
    user,
    isLoading,
    fetchUserById,
    handleUpdateUser
  }
})
