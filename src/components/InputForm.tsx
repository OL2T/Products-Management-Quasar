import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'InputComponent',
  props: {
    id: String,
    type: {
      type: String as PropType<string>,
      default: 'text'
    },
    as: {
      type: String as PropType<'input' | 'select'>,
      default: 'input'
    },
    placeholder: String,
    modelValue: [String, Number],
    error: Boolean,
    errorMessage: Array,
    name: String
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      emit('update:modelValue', target.value)
    }

    return () => (
      <div class="">
        <label
          for={props.id}
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {props.name} <span class="text-red-500">*</span>:{' '}
        </label>
        {props.as === 'select' ? (
          <select
            id={props.id}
            value={props.modelValue}
            onInput={handleInput}
            class={[
              'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
              props.error &&
                'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 dark:bg-red-200 dark:text-red-500 dark:placeholder:text-[#fff]'
            ]}
          >
            <option value="" disabled>
              {props.placeholder}
            </option>
            {slots.default && slots.default()}
          </select>
        ) : (
          <input
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
            value={props.modelValue}
            onInput={handleInput}
            class={[
              'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
              props.error &&
                'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 dark:bg-red-200 dark:text-red-500 dark:placeholder:text-[#fff]'
            ]}
          />
        )}
        <div class="flex h-6 gap-x-2">
          {props.error && props.errorMessage && (
            <div class="flex gap-x-2 text-red-500 dark:text-red-400 text-[13px]">
              {props.errorMessage.map((message) => (
                <span key={message}>{message}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
})
