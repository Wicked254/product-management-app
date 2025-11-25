import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    refreshToken: null, // Optional
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('https://dummyjson.com/auth/login', credentials, {
          headers: { 'Content-Type': 'application/json' },
        });
        this.token = response.data.accessToken; // Fix: Use accessToken from response
        this.refreshToken = response.data.refreshToken; // Optional
        this.user = response.data;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('authRefreshToken', this.refreshToken); // Optional
        localStorage.setItem('authUser', JSON.stringify(this.user));
      } catch (error) {
        throw error.response?.data?.message || 'Login failed';
      }
    },
    logout() {
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authRefreshToken');
      localStorage.removeItem('authUser');
    },
    restoreSession() {
      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('authRefreshToken');
      const user = JSON.parse(localStorage.getItem('authUser'));
      if (token) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = user;
      }
    },
  },
});
