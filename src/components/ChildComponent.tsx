import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ChildComponent',
  props: {
    message: {
      type: String as PropType<string>,
      required: true
    }
  },
  emits: ['updateMessage'],
  setup(props, { emit }) {
    const sendMessage = () => {
      emit('updateMessage', 'Hello from Child!')
    }

    return () => (
      <div>
        <h3>Child Component</h3>
        <p>Message from Parent: {props.message}</p>
        <button class="p-4 bg-blue-300" onClick={sendMessage}>
          Send Message to Parent
        </button>
      </div>
    )
  }
})
