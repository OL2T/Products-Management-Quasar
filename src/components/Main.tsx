import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    return () => (
      <main class="flex-1 sm:ml-[280px] dark:bg-gray-500 h-[100vh]">
        <div class="header-main bg-[#fff] dark:bg-gray-800 dark:text-white p-3 shadow-sm">
          <h4 class="font-medium text-lg">Title</h4>
        </div>
        <div class="p-4">
          <router-view />
        </div>
      </main>
    )
  },
  render() {}
})
