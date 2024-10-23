import { defineComponent, reactive, ref } from 'vue'

/**
 * Component Test
 */
export const TextComponent = defineComponent({
  props: {
    message: {
      type: String
    }
  },
  setup(props) {
    const data = reactive([
      {
        id: Math.random().toPrecision(2),
        task: 'Lau nha',
        isDone: false
      },
      {
        id: Math.random().toPrecision(2),
        task: 'Quet nha',
        isDone: false
      }
    ])

    const newTask = ref('')

    const handleAddTask = () => {
      if (newTask.value.trim()) {
        data.push({
          id: Math.random().toPrecision(),
          task: newTask.value,
          isDone: false
        })
      }
      newTask.value = ''
    }
    const handleDeleteTask = (id: string) => {
      const index = data.findIndex((item) => item.id === id)
      data.splice(index, 1)
    }

    return () => {
      return (
        <div>
          <div>
            <input
              type="text"
              placeholder="Enter task here..."
              v-model={newTask.value}
            />
            <button onClick={handleAddTask}>Add Task</button>
          </div>
          <div class="text-h4">{props.message}</div>
          <ul>
            {data.map((item) => (
              <li key={item.id} class="flex justify-between mb-md">
                {item.task}

                <button onClick={handleDeleteTask}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )
    }
  }
})
