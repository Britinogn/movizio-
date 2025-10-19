<template>
    <Navbar/>
    <Footer/>
    <!-- <hero v-if="$route.name === 'name'" /> -->
    <!-- <hero v-if="$route.dashboard === 'dashboard'" /> -->
    <router-view></router-view>
</template>

<script>
import Navbar from './components/navbar.vue'
// import hero from './components/hero.vue'
import Footer from './components/footer.vue'
export default {
    components:{
        Navbar,
        Footer,
        // hero
    }
}
</script>