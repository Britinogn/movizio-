import { createRouter , createWebHistory } from 'vue-router'

//import all pages

import Home from '../pages/index.vue'
import Signup from '../pages/signup.vue'
import Signin from '../pages/signin.vue'
import About from '../pages/about.vue'
import GenresDetail from '../pages/GenresDetail.vue'
import Discover from '../pages/DiscoverMovies.vue'
import Genres from '../pages/Genres.vue'

import MovieDetail from '../pages/MovieDetail.vue'
import TvDetail from '../pages/TvDetail.vue'

//define the routr

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    
    {
        path: '/login',
        name: 'Signin',
        component: Signin
    },

    {
        path: '/about',
        name: 'About',
        component: About,
        meta:{requiresAuth: true}
    },

    {
        path: '/register',
        name: 'Signup',
        component: Signup
    },

    // {
    //     path: '/movies',
    //     name: 'Movies',
    //     component: Movies, // Replace YourMovieComponent with the actual component
    //     meta:{requiresAuth: true}
    // },

    {
    path: '/discover',
    name: 'Discover',
    component: Discover,
    meta: { requiresAuth: true } // Protected - only logged-in users
    },

    {
      path: '/genres',
      name: 'Genres',
      component: Genres,
      meta: { requiresAuth: true } // Protected
    },

    {
      path: '/movie/:id',
      name: 'MovieDetail',
      component: MovieDetail, // Use the detail component I provided, with type='movie'
      meta: { requiresAuth: true } // Protected
    },

    {
      path: '/tv/:id',
      name: 'TvDetail',
      component: TvDetail, // Or same component with type='tv'
      meta: { requiresAuth: true }
    },



    { 
      path: '/detail/:type/:id', 
      name: 'GenresDetail', 
      component: GenresDetail, // Use the detail component I provided, with type='movie'
      meta: { requiresAuth: true }
    }
// ... other protected routes
];

// register route

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// GOOD - Only protect specific routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  // Define which routes require authentication
  const protectedRoutes = ['/discover', '/genres', '/about'];
  
  // Only redirect to login if accessing a protected route without token
  if (!token && protectedRoutes.includes(to.path)) {
    next('/login');
  } else {
    next();
  }
});


export default router