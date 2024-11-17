import { defineComponent, onMounted, reactive, watch } from 'vue'
import InputForm from '../components/InputForm'
import { useUserStore } from '../store/userStore'

export default defineComponent({
  name: 'Profile',
  setup() {
    const userStore = useUserStore()
    const uid = localStorage.getItem('user')
    const userId = uid ? JSON.parse(uid).id : null

    const formUser = reactive({
      first_name: userStore.user?.first_name || '',
      last_name: userStore.user?.last_name || '',
      username: userStore.user?.username || '',
      email: userStore.user?.email || ''
    })

    const fetchUser = () => {
      userStore.fetchUserById(userId)
    }
    onMounted(() => {
      fetchUser()
    })

    watch(
      () => userStore.user,
      (user) => {
        if (user) {
          Object.assign(formUser, {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            username: user.username || '',
            email: user.email || ''
          })
        }
      }
    )

    const handleUpdateUser = async (e: Event) => {
      e.preventDefault()
      await userStore.handleUpdateUser({ id: userId, ...formUser })
    }

    return () => (
      <div class="bg-[#fff] dark:bg-gray-700 w-full flex flex-col gap-5 md:flex-row text-[#161931]">
        <div class="w-full p-8 sm:rounded-lg">
          <div class="">
            <div class="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
              <svg
                class="w-40 h-40 text-gray-400 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>

            <form
              class="items-center mt-8 sm:mt-14 text-[#202142]"
              onSubmit={handleUpdateUser}
            >
              <div class="flex flex-nowrap gap-5 w-full">
                <InputForm
                  class="w-1/2"
                  id="first_name"
                  name="Your first name"
                  modelValue={formUser?.first_name}
                  placeholder="Your first name"
                  onUpdate:modelValue={(value) => {
                    formUser.first_name = value
                  }}
                />
                <InputForm
                  class="w-1/2"
                  id="last_name"
                  name="Your last name"
                  modelValue={formUser?.last_name}
                  placeholder="Your last name"
                  onUpdate:modelValue={(value) => {
                    formUser.last_name = value
                  }}
                />
              </div>
              <InputForm
                id="username"
                name="User Name"
                modelValue={formUser?.username}
                placeholder="your username"
                onUpdate:modelValue={(value) => {
                  formUser.username = value
                }}
              />
              <InputForm
                id="email"
                name="Your email"
                type="email"
                modelValue={formUser?.email}
                placeholder="your.email@mail.com"
                onUpdate:modelValue={(value) => {
                  formUser.email = value
                }}
              />

              <div class="flex justify-end">
                <button
                  type="submit"
                  class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
})
