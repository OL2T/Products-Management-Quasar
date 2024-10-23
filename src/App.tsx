import { defineComponent } from 'vue'

export default defineComponent({
  name: 'User Management',
  setup() {
    return () => (
      <q-layout view="hHh Lpr lff" class="h-full">
        <q-page-container class="h-full">
          <router-view />
        </q-page-container>
      </q-layout>
    )
  }
})
