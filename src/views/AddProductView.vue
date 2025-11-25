<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import { useToast } from 'vue-toastification'
import axios from 'axios';
import { onMounted } from 'vue';

const productStore = useProductStore()
const router = useRouter()
const toast = useToast()
const categories = ref([]);
const form = ref({
  title: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  thumbnail: ''
})
const error = ref(null)

// Fetch categories for the dropdown on mount
onMounted(async () => {
    try {
        // This endpoint returns an array of strings, e.g., ["beauty", "fragrances", ...]
        const response = await axios.get('https://dummyjson.com/products/category-list');

        // We transform the array of strings into an array of objects
        // with 'slug' and 'name' properties.
        categories.value = response.data.map(slug => ({
            slug: slug,
            name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        }));

    } catch (err) {
        console.error("Failed to fetch categories:", err);
        // You could set an error state here to show the user
    }
});

const handleCancel = () => {
  // Navigate back to the product list
  router.push('/products');
}

const handleSubmit = async () => {
  // Simple validation check
  if (!form.value.title || !form.value.price || !form.value.stock || !form.value.category) {
    return error.value = 'Product Title, Price, Stock, and Category are required.'
  }

  error.value = null
  try {
    // Ensure numbers are numbers, not strings from input fields
    const newProductData = {
      ...form.value,
      price: parseFloat(form.value.price),
      stock: parseInt(form.value.stock, 10),
    };

    // Add product
    await productStore.addProduct(newProductData);

    // Show success toast and redirect to product list
    toast.success('Product added successfully!');
    setTimeout(() => {
      router.replace('/products');
    }, 500);
  } catch (err) {
    error.value = err.message || 'An error occurred while adding the product.';
    toast.error(error.value);
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">

    <div class="w-full max-w-3xl mb-4">
      <h1 class="text-xl font-medium text-gray-800">Add New Product</h1>
      <p class="text-sm text-gray-500">
        Enter the details below to add a new item to your inventory.
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
              <!-- Use the transformed categories array -->
              <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">{{ cat.name }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-4 pt-4">
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Media</h3>

          <div class="border-2 border-dashed border-gray-300 p-10 rounded-lg text-center bg-gray-50 hover:bg-gray-100 transition duration-150 cursor-pointer">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-600">
              <span class="font-medium text-indigo-600">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (MAX. 800x600px)</p>

            <input type="file" class="sr-only">
          </div>

          <input
            v-model="form.thumbnail"
            placeholder="or paste Thumbnail URL"
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
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
            Save Product
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
