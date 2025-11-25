<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const productStore = useProductStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const categories = ref([])
const isLoading = ref(false)
const form = ref({
  title: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  thumbnail: ''
})
const error = ref(null)

onMounted(async () => {
  isLoading.value = true
  try {
    // Fetch product details
    const product = await productStore.fetchProductById(route.params.id)
    form.value = {
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      thumbnail: product.thumbnail
    }

    // Fetch categories
    const response = await axios.get('https://dummyjson.com/products/category-list')
    categories.value = response.data.map(slug => ({
      slug: slug,
      name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }))
  } catch (err) {
    console.error('Failed to load product:', err)
    error.value = 'Failed to load product details'
    toast.error('Failed to load product for editing')
  } finally {
    isLoading.value = false
  }
})

const handleCancel = () => {
  router.push(`/products/${route.params.id}`)
}

const handleSubmit = async () => {
  if (!form.value.title || !form.value.price || !form.value.stock || !form.value.category) {
    error.value = 'Product Title, Price, Stock, and Category are required.'
    return
  }

  error.value = null
  try {
    const updateData = {
      ...form.value,
      price: parseFloat(form.value.price),
      stock: parseInt(form.value.stock, 10)
    }

    await productStore.updateProduct(route.params.id, updateData)
    toast.success('Product updated successfully!')
    router.push(`/products/${route.params.id}`)
  } catch (err) {
    error.value = err.message || 'An error occurred while updating the product.'
    toast.error('Failed to update product')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div v-if="isLoading" class="text-center">
      <p class="text-gray-600">Loading product...</p>
    </div>

    <template v-else>
      <div class="w-full max-w-3xl mb-4">
        <h1 class="text-xl font-medium text-gray-800">Edit Product</h1>
        <p class="text-sm text-gray-500">
          Update the details below to modify your product.
        </p>
      </div>

      <div class="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <p v-if="error" class="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 font-medium">
            Error: {{ error }}
          </p>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Product Information</h3>

            <label class="block text-sm font-medium text-gray-700">Product Title</label>
            <input
              v-model="form.title"
              placeholder="Enter product title"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <label class="block text-sm font-medium text-gray-700">Product Description</label>
            <textarea
              v-model="form.description"
              placeholder="Provide a detailed description of the product"
              rows="4"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            ></textarea>
          </div>

          <div class="space-y-4 pt-4">
            <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Pricing & Inventory</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Price</label>
                <div class="relative mt-1">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    v-model="form.price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full p-3 pl-7 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Stock Quantity</label>
                <input
                  v-model="form.stock"
                  type="number"
                  min="0"
                  placeholder="Enter stock quantity"
                  class="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <select
                v-model="form.category"
                class="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="" disabled>Select a category</option>
                <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end pt-4 space-x-3 border-t">
            <button
              type="button"
              @click="handleCancel"
              class="py-2 px-6 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="py-2 px-6 text-white rounded-md transition duration-150 font-medium bg-indigo-600 hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>
