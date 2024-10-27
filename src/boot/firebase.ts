import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCsaQkf2U8MYdxKb7AE_7-N_XGo4iVbDiU',
  authDomain: 'dashboard-management-7dac4.firebaseapp.com',
  projectId: 'dashboard-management-7dac4',
  storageBucket: 'dashboard-management-7dac4.appspot.com',
  messagingSenderId: '742943458605',
  appId: '1:742943458605:web:784483ff0319c76bf8bfa4',
  measurementId: 'G-R6Y3L84018'
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)

export default boot(({ app }) => {
  app.config.globalProperties.$firebaseAuth = auth
})

export { auth }
