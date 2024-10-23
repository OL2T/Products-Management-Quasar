import Create from '../components/Create'
import Manage from '../components/Manage'
import ProductList from '../components/ProductList'
import Dashboard from '../pages/Dashboard'
import Index from '../pages/Index'
import Users from '../pages/Users'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index,
    children: [
      {
        path: 'create',
        component: Create
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'users',
        component: Users
      },
      {
        path: '/products',
        component: Manage
      }
      // {
      //   path: '/products',
      //   component: ProductList
      // }
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes
