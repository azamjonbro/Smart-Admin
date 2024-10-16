import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/',
    name: 'LoginPage',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); //  aka manashu yerda app ga ruhsat bergan shumasmi ? no sabr

  if (!token && to.name !== 'LoginPage') {
    // If no token and trying to access any route except Login, redirect to Login
    next({ name: 'LoginPage' });
  } else if (token && to.name === 'LoginPage') {
    // If token exists and trying to access Login, redirect to Home
    next({ name: 'Home' });
  } else {
    // Otherwise, allow access to the route
    next();
  }
});

export default router;
