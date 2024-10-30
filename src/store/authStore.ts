import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth'
import { auth } from '../boot/firebase'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ADD_USER_MUTATION } from '../graphql/userQueries'

interface User {
  id: string
  username: string | null
  email: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const router = useRouter()

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const newUser = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        username: username
      }

      user.value = newUser
      await updateProfile(userCredential.user, { displayName: username })
      console.log('newUser', newUser)

      const admin_secret = 'myadminsecretkey'
      const url = 'http://localhost:8080/v1/graphql'
      const query = `mutation($userId: String!, $userEmail: String, $username: String) {
        insert_users(objects: [{
          id: $userId, username: $username, email: $userEmail, last_seen: "now()"
        }], on_conflict: {constraint: users_pkey, update_columns: [last_seen, email]}
        ) {
          affected_rows
        }
      }`

      const variables = {
        userId: newUser.id,
        userEmail: newUser.email,
        username: newUser.username
      }

      fetch(url, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'x-hasura-admin-secret': admin_secret
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        })
      })

      toast('User registered successfully', {
        theme: 'auto',
        type: 'success',
        position: 'top-right'
      })
    } catch (err: any) {
      error.value = err.message
      toast(`${err.message}`, {
        theme: 'auto',
        type: 'error',
        position: 'top-right'
      })
    } finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const newUser = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        username: userCredential.user.displayName
      }

      user.value = newUser
      console.log(newUser)
      const accessToken = await userCredential.user.getIdToken()

      // Lưu accessToken vào localStorage
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(newUser))

      toast('User logged in successfully', {
        theme: 'auto',
        type: 'success',
        position: 'top-right',
        onClose: () => {
          router.push({ path: '/products' })
        }
      })
    } catch (err: any) {
      error.value = err.message
      const errorNotFound =
        err.message === 'Firebase: Error (auth/user-not-found).'
          ? 'User not found'
          : err.message
      const errorIncorrect =
        err.message === 'Firebase: Error (auth/invalid-credential).'
          ? 'Email or Password is incorrect'
          : err.message
      toast(`${errorIncorrect}`, {
        theme: 'auto',
        type: 'error',
        position: 'top-right'
      })
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      await signOut(auth)
      user.value = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      router.push({ path: '/login' })
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    register,
    login,
    logout
  }
})
