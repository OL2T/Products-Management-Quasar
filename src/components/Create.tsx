import { computed, defineComponent, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

import useVueValidate from '@vuelidate/core'
import { required, minLength, minValue } from '@vuelidate/validators'
import InputForm from './InputForm'
import { useProductStore } from '../store/ProductStore'

export default defineComponent({
  name: 'Create Products',
  setup() {
    const store = useProductStore()
    const formCreate = reactive({
      name: '',
      description: '',
      category: '',
      stock: 0,
      price: 0
    })

    const rules = computed(() => ({
      name: { required, minLength: minLength(3) },
      description: { required, minLength: minLength(3) },
      category: { required, minLength: minLength(3) },
      stock: { required, minValue: minValue(1) },
      price: { required, minValue: minValue(1) }
    }))

    const v$ = useVueValidate(rules, formCreate)

    const handleSubmit = async (e: Event) => {
      e.preventDefault()

      const result = await v$.value.$validate()
      if (result) {
        store.handleAddProduct({ ...formCreate })
        // store.fetchProducts()
        v$.value.$reset()

        // Clear input
        formCreate.name = ''
        formCreate.description = ''
        formCreate.category = ''
        formCreate.stock = 0
        formCreate.price = 0
      }
    }
    return () => (
      <form class="p-4 min-w-[480px]" onSubmit={handleSubmit}>
        <div class="mb-5">
          <InputForm
            name="Product Name"
            id="name"
            placeholder="Enter name"
            v-model={formCreate.name}
            error={v$.value.name.$error}
            errorMessage={v$.value.name.$errors.map((error) => error.$message)}
          />
          <InputForm
            name="Category"
            id="category"
            placeholder="Enter category"
            v-model={formCreate.category}
            error={v$.value.category.$error}
            errorMessage={v$.value.category.$errors.map(
              (error) => error.$message
            )}
          />
          <InputForm
            name="Description"
            id="description"
            placeholder="Enter description"
            v-model={formCreate.description}
            error={v$.value.description.$error}
            errorMessage={v$.value.description.$errors.map(
              (error) => error.$message
            )}
          />
          <InputForm
            name="Stock"
            id="stock"
            type="number"
            placeholder="Enter stock"
            v-model={formCreate.stock}
            error={v$.value.stock.$error}
            errorMessage={v$.value.stock.$errors.map((error) => error.$message)}
          />
          <InputForm
            name="Price"
            id="price"
            type="number"
            placeholder="Enter price"
            v-model={formCreate.price}
            error={v$.value.price.$error}
            errorMessage={v$.value.price.$errors.map((error) => error.$message)}
          />
        </div>
        <div class="flex gap-x-4 items-center">
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Create
          </button>
        </div>
      </form>
    )
  }
})
