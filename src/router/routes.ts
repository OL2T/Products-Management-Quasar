import Dashboard from '../pages/Dashboard'
import Index from '../pages/Index'
import Customers from '../pages/Customers'
import Login from '../pages/Login'
import Register from '../pages/Register'
import DetailView from '../components/DetailView'
import Update from '../components/Update'
import ProductList from '../components/ProductList'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index,
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'customers',
        component: Customers
      },
      {
        path: 'products',
        component: ProductList
      },
      {
        path: 'product/:id',
        component: DetailView
      },
      {
        path: 'update/:id',
        component: Update
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes
