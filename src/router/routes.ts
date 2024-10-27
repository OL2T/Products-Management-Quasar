import Create from '../components/Create'
import Manage from '../components/Manage'
import ProductList from '../components/ProductList'
import Dashboard from '../pages/Dashboard'
import Index from '../pages/Index'
import Customers from '../pages/Customers'
import Login from '../pages/Login'
import Register from '../pages/Register'
import DetailView from '../components/DetailView'
import Edit from '../components/Edit'

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
        component: Manage
      },
      {
        path: 'product/:id',
        component: DetailView
      },
      {
        path: 'update/:id',
        component: Edit
      }
      // {
      //   path: '/products',
      //   component: ProductList
      // }
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
