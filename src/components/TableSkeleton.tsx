import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TableSkeleton',
  setup() {
    return () => (
      <tbody class="w-full animate-pulse">
        <tr class="odd:bg-[#fff] odd:dark:bg-gray-800 even:bg-gray-200 even:dark:bg-gray-700 border-b dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          ></th>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
        </tr>
        <tr class="odd:bg-[#fff] odd:dark:bg-gray-800 even:bg-gray-200 even:dark:bg-gray-700 border-b dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          ></th>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
        </tr>
        <tr class="odd:bg-[#fff] odd:dark:bg-gray-800 even:bg-gray-200 even:dark:bg-gray-700 border-b dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          ></th>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
        </tr>
        <tr class="odd:bg-[#fff] odd:dark:bg-gray-800 even:bg-gray-200 even:dark:bg-gray-700 border-b dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          ></th>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
          <td class="px-6 py-4"></td>
        </tr>
      </tbody>
    )
  }
})
