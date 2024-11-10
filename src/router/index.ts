import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from '../store/authStore'

export default route<any>(function (/* { store, ssrContext } */) {
  const createHistory =
    process.env.MODE === 'ssr'
      ? createMemoryHistory
      : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(
      // eslint-disable-next-line no-void
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    )
  })

  Router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('accessToken') !== null // Kiểm tra xem người dùng đã đăng nhập chưa

    // Nếu người dùng chưa đăng nhập và đang cố gắng vào trang yêu cầu đăng nhập
    if (!isLoggedIn && to.path !== '/login' && to.path !== '/register') {
      next('/login') // Chuyển hướng người dùng về trang login
    }

    // Nếu người dùng đã đăng nhập và cố gắng vào trang login hoặc register
    else if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
      next('/') // Chuyển hướng người dùng về trang home
    } else {
      next() // Tiếp tục nếu điều kiện hợp lệ
    }
  })

  return Router
})
