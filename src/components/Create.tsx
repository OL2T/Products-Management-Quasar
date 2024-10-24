import { defineComponent, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '../store/ProductStore'

export default defineComponent({
  setup() {
    const store = useProductStore()
    const name = ref('')
    const description = ref('')
    const category = ref('')
    const stock = ref(0)
    const price = ref(0)

    const handleSubmit = (e) => {
      e.preventDefault()
      store.addProduct({
        name: name.value,
        description: description.value,
        category: category.value,
        stock: stock.value,
        price: price.value
      })

      // Clear the input fields after submitting
      name.value = ''
      description.value = ''
      category.value = ''
      stock.value = 0
      price.value = 0
    }

    return () => (
      <div class=" bg-[#fff] rounded-sm shadow-sm mx-4 dark:bg-gray-800">
        <form class="my-8 p-4">
          <div class="text-2xl font-bold mb-8 dark:text-white">Create New</div>
          <div class="group flex flex-col gap-y-4 mb-8">
            <div>
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Product Name:
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                v-model={name.value}
              />
            </div>
            <div>
              <label
                for="category"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Category:
              </label>
              <input
                id="category"
                type="text"
                placeholder="Enter category"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                v-model={category.value}
              />
            </div>
            <div>
              <label
                for="description"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description:
              </label>
              <input
                id="description"
                type="text"
                placeholder="Enter description"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                v-model={description.value}
              />
            </div>
            <div>
              <label
                for="stock"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Stock:
              </label>
              <input
                id="stock"
                type="text"
                placeholder="Enter stock"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                v-model={stock.value}
              />
            </div>
            <div>
              <label
                for="price"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Price:
              </label>
              <input
                id="price"
                type="text"
                placeholder="Enter price"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                v-model={price.value}
              />
            </div>
          </div>
          <div class="flex gap-x-4 items-center">
            <button
              type="submit"
              class="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold text-[18px]"
              onClick={handleSubmit}
            >
              Create
            </button>
            <button class="px-4 py-2 rounded-md bg-gray-500 text-white font-semibold text-[18px]">
              <RouterLink to="/">Cancel</RouterLink>
            </button>
          </div>
        </form>
      </div>
    )

    return {
      name,
      description,
      category,
      stock,
      price,
      handleSubmit
    }
  }
  // render() {
  //   const { name, description, category, stock, price, handleSubmit } = this
  // }
})
