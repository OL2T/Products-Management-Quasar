import { defineComponent, ref } from 'vue'
import ProductChart from '../components/Chart'

export default defineComponent({
  name: 'Dashboard - Parent Component',
  setup() {
    return () => (
      <div class="">
        <h1 class="font-bold text-3xl mb-5 dark:text-gray-100">
          Product statistics
        </h1>
        <ProductChart></ProductChart>
      </div>
    )
  }
})
