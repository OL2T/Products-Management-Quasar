import { defineComponent, ref, onMounted, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart, BarElement, CategoryScale, LinearScale, Title } from 'chart.js'
import { GET_ALL_PRODUCTS } from '../graphql/productQueries'
import { useQuery } from '@vue/apollo-composable'

Chart.register(BarElement, CategoryScale, LinearScale, Title)

const ProductChart = defineComponent({
  components: {
    Bar
  },
  setup() {
    const { result, loading, error, refetch } = useQuery(GET_ALL_PRODUCTS, {})
    const isDarkMode = ref(false)

    const chartData = ref<{
      labels: string[]
      datasets: {
        label: string
        data: number[]
        backgroundColor: string[]
      }[]
    }>({
      labels: [],
      datasets: [
        {
          label: 'Số lượng sản phẩm',
          data: [],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }
      ]
    })

    const chartOptions = ref({
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: isDarkMode.value ? '#FFFFFF' : '#000000' // Change color based on dark mode
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: isDarkMode.value ? '#FFFFFF' : '#000000' // Change color based on dark mode
          }
        },
        y: {
          ticks: {
            color: isDarkMode.value ? '#FFFFFF' : '#000000' // Change color based on dark mode
          }
        }
      }
    })

    const updateChartData = () => {
      if (!result.value || result.value.products.length === 0) return

      const categories: string[] = result.value.products.map(
        (product) => product.category
      )

      const uniqueCategories: string[] = [...new Set(categories)]
      const categoryCounts = uniqueCategories.map(
        (category) => categories.filter((cat) => cat === category).length
      )

      chartData.value = {
        labels: uniqueCategories,
        datasets: [
          {
            label: 'Số lượng sản phẩm',
            data: categoryCounts,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40'
            ]
          }
        ]
      }
    }

    onMounted(() => {
      if (result.value && result.value.products.length > 0) {
        updateChartData()
      }
    })

    watch(
      () => result.value,
      (newResult) => {
        if (newResult && newResult.products.length > 0) {
          updateChartData()
        }
      }
    )

    watch(isDarkMode, (newVal) => {
      chartOptions.value.plugins.legend.labels.color = newVal
        ? '#FFFFFF'
        : '#000000'
      chartOptions.value.scales.x.ticks.color = newVal ? '#FFFFFF' : '#000000'
      chartOptions.value.scales.y.ticks.color = newVal ? '#FFFFFF' : '#000000'
    })

    onMounted(() => {
      // Simulate fetching the theme from a global state or a prop
      isDarkMode.value =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    return () => (
      <div class="w-full">
        <Bar
          type="bar"
          data={chartData.value}
          options={chartOptions.value}
        ></Bar>
      </div>
    )
  }
})

export default ProductChart
