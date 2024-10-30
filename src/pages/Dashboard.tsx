import { defineComponent, ref } from 'vue'
import ChildComponent from '../components/ChildComponent'

export default defineComponent({
  name: 'Dashboard - Parent Component',
  setup() {
    const parentMessage = ref('Hello from Parent!')
    const updatedMessage = ref('')

    const handleMessageUpdate = (newMessage: string) => {
      updatedMessage.value = newMessage
    }
    return () => (
      <div class="text-white">
        <h2>Parent Component</h2>
        <ChildComponent
          class="bg-white text-black"
          message={parentMessage.value}
          onUpdateMessage={handleMessageUpdate}
        />
        <p>Updated Message from Child: {updatedMessage.value}</p>
      </div>
    )
  }
})
