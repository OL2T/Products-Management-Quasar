import { computed, defineComponent, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../store/productStore'
import useVueValidate from '@vuelidate/core'
import { required, minLength, minValue } from '@vuelidate/validators'
import InputForm from './InputForm'

export default defineComponent({
  name: 'View Product',
  setup() {
    const store = useProductStore()
    const route = useRoute()
    const router = useRouter()

    const formEdit = reactive({
      name: route.params.id ? store.product?.name ?? '' : '',
      description: route.params.id ? store.product?.description ?? '' : '',
      category: route.params.id ? store.product?.category ?? '' : '',
      stock: route.params.id ? store.product?.stock ?? 0 : 0,
      price: route.params.id ? store.product?.price ?? 0 : 0
    })

    const fetchProduct = async () => {
      const productId = route.params.id
      if (productId) {
        await store.fetchProductById(productId as string)
      }
    }

    onMounted(() => {
      fetchProduct()
    })

    // Watch for product changes and update formEdit when store.product is ready
    watch(
      () => store.product,
      (product) => {
        if (product) {
          Object.assign(formEdit, {
            name: product.name || '',
            description: product.description || '',
            category: product.category || '',
            stock: product.stock || 0,
            price: product.price || 0
          })
        }
      },
      { immediate: true } // Run the watch handler immediately upon component mount
    )

    const rules = computed(() => ({
      name: { required, minLength: minLength(3) },
      description: { required, minLength: minLength(3) },
      category: { required, minLength: minLength(3) },
      stock: { required, minValue: minValue(1) },
      price: { required, minValue: minValue(1) }
    }))

    const v$ = useVueValidate(rules, formEdit)

    const handleSubmit = async (e: Event) => {
      e.preventDefault()

      const result = await v$.value.$validate()
      if (result) {
        await store.handleUpdateProduct({
          id: route.params.id as string,
          ...formEdit
        })

        v$.value.$reset()

        // Clear input
        formEdit.name = ''
        formEdit.description = ''
        formEdit.category = ''
        formEdit.stock = 0
        formEdit.price = 0
      }
    }
    return () => (
      <form class="p-4 min-w-[480px]" onSubmit={handleSubmit}>
        <div class="mb-5">
          <InputForm
            name="Product Name"
            id="name"
            placeholder="Enter name"
            v-model={formEdit.name}
            error={v$.value.name.$error}
            errorMessage={v$.value.name.$errors.map((error) => error.$message)}
          />
          <InputForm
            name="Category"
            id="category"
            placeholder="Enter category"
            v-model={formEdit.category}
            error={v$.value.category.$error}
            errorMessage={v$.value.category.$errors.map(
              (error) => error.$message
            )}
          />
          <InputForm
            name="Description"
            id="description"
            placeholder="Enter description"
            v-model={formEdit.description}
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
            v-model={formEdit.stock}
            error={v$.value.stock.$error}
            errorMessage={v$.value.stock.$errors.map((error) => error.$message)}
          />
          <InputForm
            name="Price"
            id="price"
            type="number"
            placeholder="Enter price"
            v-model={formEdit.price}
            error={v$.value.price.$error}
            errorMessage={v$.value.price.$errors.map((error) => error.$message)}
          />
        </div>
        <div class="flex gap-x-4 items-center">
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Update
          </button>
        </div>
      </form>
    )
  }
})
