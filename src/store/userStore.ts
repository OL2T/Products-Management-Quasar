import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { GET_USERS } from '../graphql/userQueries'
import { useQuery } from '@vue/apollo-composable'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

interface User {
  id: string
  email: string | null
}

export default defineStore('user', () => {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const querySearch = ref('')

  const handleChangeInput = (e: any) => {
    querySearch.value = e.target.value
  }

  const filterUsers = computed(() => {
    return users.value.filter((user) =>
      user.email?.toLowerCase().includes(querySearch.value.toLowerCase())
    )
  })

  const fetchUsers = () => {
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
  }

  return {
    users,
    isLoading,
    querySearch,
    filterUsers,
    handleChangeInput,
    fetchUsers
  }
})
