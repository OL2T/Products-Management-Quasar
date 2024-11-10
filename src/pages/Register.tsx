import { computed, defineComponent, reactive, watch } from 'vue'
import { RouterLink } from 'vue-router'
import InputForm from '../components/InputForm'
import useVueValidate from '@vuelidate/core'
import { minLength, required, email, sameAs } from '@vuelidate/validators'
import { useAuthStore } from '../store/authStore'
export default defineComponent({
  name: 'register',
  setup() {
    const authStore = useAuthStore()
    const formRegister = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const rules = computed(() => ({
      username: { required, minLength: minLength(6) },
      email: { required, email },
      password: { required, minLength: minLength(6) },
      confirmPassword: {
        required,
        minLength: minLength(6),
        sameAs: sameAs(formRegister.password)
      }
    }))

    const v$ = useVueValidate(rules, formRegister)

    const handleRegister = async (e: Event) => {
      e.preventDefault()

      const result = await v$.value.$validate()
      if (result) {
        authStore.register(
          formRegister.email,
          formRegister.password,
          formRegister.username
        )

        v$.value.$reset()

        formRegister.email = ''
        formRegister.username = ''
        formRegister.password = ''
        formRegister.confirmPassword = ''
      }
    }

    return () => (
      <div class="relative">
        {/* <!-- Main modal --> */}
        <div class=" fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0  max-h-full bg-[#333] bg-opacity-70">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-md max-h-full">
            {/* <!-- Modal content --> */}
            <div class="relative bg-[#fff] rounded-lg shadow dark:bg-gray-700">
              {/* <!-- Modal header --> */}
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Sign up your account
                </h3>
                <button
                  type="button"
                  class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="authentication-modal"
                >
                  <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <div class="p-4 md:p-5">
                <form
                  class="space-y-4"
                  action="submit"
                  onSubmit={handleRegister}
                >
                  <div class="">
                    <InputForm
                      type="text"
                      name="User name"
                      id="username"
                      placeholder="johndoe"
                      v-model={formRegister.username}
                      error={v$.value.username.$error}
                      errorMessage={v$.value.username.$errors.map((error) => (
                        <span class="text-red-500">{error.$message}</span>
                      ))}
                    />
                    <InputForm
                      type="username"
                      name="Email"
                      id="email"
                      placeholder="alex@gmail.com"
                      v-model={formRegister.email}
                      error={v$.value.email.$error}
                      errorMessage={v$.value.email.$errors.map((error) => (
                        <span class="text-red-500">{error.$message}</span>
                      ))}
                    />
                    <InputForm
                      type="password"
                      name="Password"
                      id="password"
                      placeholder="••••••••"
                      v-model={formRegister.password}
                      error={v$.value.password.$error}
                      errorMessage={v$.value.password.$errors.map((error) => (
                        <span class="text-red-500">{error.$message}</span>
                      ))}
                    />
                    <InputForm
                      type="password"
                      name="Confirm Password"
                      id="confirm_password"
                      placeholder="••••••••"
                      v-model={formRegister.confirmPassword}
                      error={v$.value.confirmPassword.$error}
                      errorMessage={v$.value.confirmPassword.$errors.map(
                        (error) => (
                          <span class="text-red-500">{error.$message}</span>
                        )
                      )}
                    />
                  </div>
                  <button
                    type="submit"
                    class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Register your account
                  </button>
                  <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Already have account?{' '}
                    <RouterLink
                      to="/login"
                      class="text-blue-700 hover:underline dark:text-blue-500"
                    >
                      Sign in here
                    </RouterLink>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
