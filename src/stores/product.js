import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchProducts() {
      this.isLoading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const response = await axios.get('https://dummyjson.com/products', {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.products = response.data.products
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    async fetchProductById(id) {
      this.isLoading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const response = await axios.get(`https://dummyjson.com/products/${id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async addProduct(payload) {
      this.isLoading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const response = await axios.post('https://dummyjson.com/products/add', payload, {
          headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' }
        })
        this.products.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async updateProduct(id, payload) {
      this.isLoading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const response = await axios.put(`https://dummyjson.com/products/${id}`, payload, {
          headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' }
        })
        // Update the product in the store
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async deleteProduct(id) {
      this.isLoading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        await axios.delete(`https://dummyjson.com/products/${id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        this.products = this.products.filter(p => p.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})
