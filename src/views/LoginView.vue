<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import logoImage from '../assets/digibuy.jpg';

const authStore = useAuthStore();
const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref(null);
const showPassword = ref(false);
const rememberMe = ref(false); // Non-functional for now
const isLoading = ref(false);

const handleLogin = async () => {
  error.value = null;
  isLoading.value = true;

  try {
    await authStore.login({ username: username.value, password: password.value });
    router.push('/products');
  } catch (err) {
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <!-- 2. ADD THE LOGO IMAGE HERE -->
      <img :src="logoImage" alt="DigiBuy Logo" class="mx-auto h-12 w-auto" />

      <h2 class="text-2xl font-bold text-center text-primary">Welcome Back</h2>
      <p class="text-center text-gray-500">Sign in to manage your products.</p>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Email or Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="you@example.com"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="relative">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            :disabled="isLoading"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 top-6"
            :disabled="isLoading"
          >
            <span v-if="showPassword">Hide</span>
            <span v-else>Show</span>
          </button>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
              :disabled="isLoading"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>
          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-800">Forgot Password?</a>
          </div>
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
      <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      <p class="text-center text-sm text-gray-500 mt-4">© 2025 Digi Buy Technologies. All Rights Reserved.</p>
    </div>
  </div>
</template>
