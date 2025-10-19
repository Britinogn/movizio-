<template>
  <div class="bg-[#0a0918] min-h-screen flex items-center justify-center pt-30 px-4 md:px-8 py-12">
    <form
      class="max-w-md w-full p-8 bg-[#181727]/90 backdrop-blur-lg rounded-2xl shadow-2xl space-y-6 border border-purple-500/20 text-white"
      @submit.prevent="submit"
    >
      <div class="text-center space-y-3">
        <h1
          class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
        >
          Sign In
        </h1>
        <p class="text-lg font-semibold text-gray-300">
          Get access to more upcoming movies
        </p>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="email" class="text-sm font-medium text-gray-300">Email:</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="px-4 py-3 bg-[#0a0918]/50 backdrop-blur-sm border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 text-white placeholder-gray-400"
          placeholder="Enter your email"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="password" class="text-sm font-medium text-gray-300">Password:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="px-4 py-3 bg-[#0a0918]/50 backdrop-blur-sm border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 text-white placeholder-gray-400"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        class="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
      >
        <span v-if="loading">Signing In...</span>
        <span v-else>Sign In</span>
      </button>

      <p class="text-center text-sm text-gray-300">
        Don't have an account?
        <router-link
          to="/register"
          class="text-purple-400 hover:text-pink-400 font-semibold hover:underline transition-colors duration-300"
        >
          Sign Up
        </router-link>
      </p>

      <p v-if="error" class="text-red-400 text-center text-sm font-medium capitalize">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script>
import api from '../services/api'
import {setToken} from "../services/auth";

export default{
    data(){
        return {
            email:'',
            password:'',
            error:'',
            loading: false
        }
    },

    methods:{
       async submit(){
        this.error = ''
        this.loading = true;

        try {
            const res = await api.post('/auth/login',
            {
                email: this.email,
                password: this.password
            });
            
            const token = res.data.token;
            setToken(token);
            // this.$notify('Login Successful!')
            this.$router.push ({name: 'Discover'});
            
        } catch (err) {
            this.error = err.response?.data?.message || 'Login failed'
        } finally{
            this.loading = false;
        }
            }
    },
}
</script>