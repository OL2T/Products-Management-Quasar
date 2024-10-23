import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
export default defineComponent({
  setup() {
    return () => (
      <div>
        <button class="bg-primary px-4 py-2 rounded-md text-white font-medium">
          <RouterLink to="/create">Create User</RouterLink>
        </button>
      </div>
    )
  }
})
