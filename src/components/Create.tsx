import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  setup() {
    return () => (
      <div class=" bg-white rounded-sm shadow-sm mx-4">
        <form class="my-8 p-4">
          <div class="text-2xl font-bold mb-8">Create User</div>
          <div class="group flex flex-col gap-y-4 mb-8">
            <div>
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name:
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                User Name:
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email:
              </label>
              <input
                id="email"
                type="text"
                placeholder="Enter email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                for="phone"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone:
              </label>
              <input
                id="phone"
                type="text"
                placeholder="Enter phone"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                for="website"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Website:
              </label>
              <input
                id="website"
                type="text"
                placeholder="Enter website"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div class="flex gap-x-4 items-center">
            <button class="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold text-[18px]">
              Create
            </button>
            <button class="px-4 py-2 rounded-md bg-gray-500 text-white font-semibold text-[18px]">
              <RouterLink to="/">Cancel</RouterLink>
            </button>
          </div>
        </form>
      </div>
    )
  }
})
