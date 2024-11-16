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
          position: 'top'
        },
        title: {
          display: true,
          text: 'Thống kê số lượng sản phẩm theo danh mục'
        }
      },
      scales: {
        y: {
          beginAtZero: true
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
