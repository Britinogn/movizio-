<template>
  <div class="bg-[#0a0918] min-h-screen flex items-center justify-center pt-30 px-4 md:px-8 py-12">
    <form
      class="max-w-md w-full p-8 bg-[#181727]/90 backdrop-blur-lg rounded-2xl shadow-2xl space-y-6 border border-purple-500/20 text-white"
      @submit.prevent="submit"
    >
      <h1
        class="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6"
      >
        Create Your Account
      </h1>

      <div class="flex flex-col space-y-2">
        <label for="name" class="text-sm font-medium text-gray-300">Name:</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          class="px-4 py-3 bg-[#0a0918]/50 backdrop-blur-sm border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 text-white placeholder-gray-400"
          placeholder="Enter your name"
        />
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
        <span v-if="loading">Signing Up...</span>
        <span v-else>Sign Up</span>
      </button>

      <p class="text-center text-sm text-gray-300">
        Already have an account?
        <router-link to="/login" class="text-purple-400 hover:text-pink-400 font-semibold hover:underline transition-colors duration-300">
          Sign In
        </router-link>
      </p>

      <p v-if="error" class="text-red-400 text-center text-sm font-medium capitalize">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script>
//import  axios  from 'axios'
import api from '../services/api'
import {setToken} from "../services/auth";

export default{
    data() {
        return {
            name: '',
            email: '',
            password:'',
            error: '',
            loading: false 
        }
    },

    methods:{
        async submit() {
            this.loading = true;
            this.error = '';

            try {
                await api.post('/auth/register',         
                { 
                    name: this.name,
                    email: this.email,
                    password: this.password 
                });

                //login right after registeration
                const res = await api.post('/auth/login',
                {
                    email: this.email,
                    password: this.password
                });

                setToken(res.data.token);
                this.$router.push({name: 'Discover'})
                
            } catch (err) {
                this.error = err.response?.data?.message || 'Registration Failed'
            } finally{
                this.loading = false;
            }
        
        }
    }
}
</script>