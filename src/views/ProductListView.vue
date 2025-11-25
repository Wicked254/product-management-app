<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/product';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

const productStore = useProductStore();
const authStore = useAuthStore();
const router = useRouter();
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStockStatus = ref('');
const categories = ref([]);

const isSidebarOpen = ref(false);

onMounted(async () => {
  await productStore.fetchProducts();
  try {
    // This endpoint returns an array of strings, e.g., ["beauty", "fragrances", ...]
    const response = await axios.get('https://dummyjson.com/products/category-list');

    // We need to transform this array of strings into an array of objects
    // with 'slug' and 'name' properties to match the template's expectations.
    categories.value = response.data.map(slug => ({
      slug: slug,
      name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }));

  } catch (error) {
    console.error("Failed to fetch primary category list, trying fallback:", error);
    try {
      // Fallback endpoint might have a different structure, but we apply the same transformation.
      const fallbackResponse = await axios.get('https://dummyjson.com/products/categories');
      categories.value = fallbackResponse.data.map(slug => ({
        slug: slug,
        name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      }));
    } catch (fallbackError) {
      console.error("Failed to fetch categories from fallback endpoint as well:", fallbackError);
    }
  }
});

const filteredProducts = computed(() => {
  return productStore.products.filter(product => {
    const matchesTitle = product.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value;
    let matchesStock = true;
    if (selectedStockStatus.value === 'In Stock') {
      matchesStock = product.stock > 50;
    } else if (selectedStockStatus.value === 'Low Stock') {
      matchesStock = product.stock > 0 && product.stock <= 50;
    } else if (selectedStockStatus.value === 'Out of Stock') {
      matchesStock = product.stock === 0;
    }
    return matchesTitle && matchesCategory && matchesStock;
  });
});

const getStockColor = (stock) => {
  // Using CSS variables for colors is more robust and maintainable
  if (stock > 50) return 'bg-green-500';
  if (stock > 0) return 'bg-orange-500';
  return 'bg-red-500';
};

const getStockText = (stock) => {
  if (stock > 50) return 'In Stock';
  if (stock > 0) return 'Low Stock';
  return 'Out of Stock';
};

const goToAdd = () => router.push('/products/new');
const viewProduct = (id) => router.push(`/products/${id}`);
const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

---

<template>
  <div class="flex min-h-screen bg-gray-100 relative">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <aside
      :class="[
        'fixed lg:relative inset-y-0 left-0 z-50 w-64 lg:w-72 bg-white shadow-md flex flex-col justify-between transform transition-transform duration-300 ease-in-out border-r border-gray-200',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      style="padding: 0; background-color: #ffffff; color: #4b5563;"
    >
      <div>
        <div class="flex items-center p-4 border-b border-gray-200 mb-6">
          <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 mr-3">
            E
          </div>
          <span class="font-semibold text-lg text-gray-800">E-Commerce<br>Admin Panel</span>
        </div>

        <nav class="space-y-1 px-4">
          <a href="#" class="flex items-center p-3 rounded-lg text-gray-600 hover:bg-indigo-50-600 hover:text-indigo-700 transition-colors duration-150">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            Dashboard
          </a>

          <a href="#" class="flex items-center p-3 rounded-lg text-white font-semibold bg-indigo-600 shadow-md">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7L4 7M10 7L10 17M14 7L14 17M18 7L18 17M6 7L6 17M20 7V17a2 2 0 01-2 2H6a2 2 0 01-2-2V7"></path></svg>
            Products
          </a>

          <a href="#" class="flex items-center p-3 rounded-lg text-gray-600 hover:bg-indigo-50-600 hover:text-indigo-700 transition-colors duration-150">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            Orders
          </a>

          <a href="#" class="flex items-center p-3 rounded-lg text-gray-600 hover:bg-indigo-50-600 hover:text-indigo-700 transition-colors duration-150">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m14-4a5 5 0 100-10 5 5 0 000 10zm-7-5a5 5 0 100-10 5 5 0 000 10z"></path></svg>
            Customers
          </a>
        </nav>
      </div>

      <div class="px-4 pb-4 space-y-2">
        <a href="#" class="flex items-center p-3 rounded-lg text-gray-600 hover:bg-indigo-50-600 hover:text-indigo-700 transition-colors duration-150">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Settings
        </a>

        <button @click="logout" class="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center font-medium transition-colors duration-150">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 p-2 sm:p-4 lg:p-8 transition-all duration-300 ease-in-out">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button @click="isSidebarOpen = true" class="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Products</h1>
          <p class="text-sm sm:text-base text-gray-500">Manage your inventory and view product performance.</p>
        </div>

        <button @click="goToAdd" class="w-full sm:w-auto py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center sm:justify-start font-medium transition-colors duration-150">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m-8-8h16"></path></svg>
          Add New Product
        </button>
      </div>

      <div class="flex flex-col gap-3 mb-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            placeholder="Search by product name..."
            class="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 text-black"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <select v-model="selectedCategory" class="p-3 border border-gray-300 rounded-lg bg-gray-50 flex-1 sm:w-auto focus:ring-indigo-500 focus:border-indigo-500 text-black">
            <option value="">Category</option>
            <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">{{ cat.name }}</option>
          </select>
          <select v-model="selectedStockStatus" class="p-3 border border-gray-300 rounded-lg bg-gray-50 flex-1 sm:w-auto focus:ring-indigo-500 focus:border-indigo-500 text-black">
            <option value="">Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div v-if="productStore.isLoading" class="text-center py-10 text-lg font-medium">Loading products...</div>
      <div v-else-if="productStore.error" class="text-red-500 text-center py-10">{{ productStore.error }}</div>

      <div v-else class="w-full bg-white shadow-xl rounded-xl overflow-x-auto border border-gray-200">
        <table class="w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th class="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
              <th class="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th class="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id" class="cursor-pointer hover:bg-gray-50 transition-colors duration-150" @click="viewProduct(product.id)">
              <td class="p-4 flex items-center">
                <img :src="product.thumbnail" class="w-12 h-12 object-cover rounded-md mr-4" :alt="product.title" />
                <div>
                  <p class="font-medium text-gray-800">{{ product.title }}</p>
                  <p class="text-sm text-gray-500">{{ product.description.slice(0, 50) }}...</p>
                </div>
              </td>
              <td class="p-4 hidden md:table-cell">
                <span class="px-3 py-1 text-sm rounded-full"
                      :class="{
                        'bg-blue-100 text-blue-800': product.category === 'electronics',
                        'bg-purple-100 text-purple-800': product.category === 'groceries',
                        'bg-red-100 text-red-800': product.category === 'apparel' || product.category === 'fashion',
                        'bg-yellow-100 text-yellow-800': product.category === 'home-decoration'
                      }">
                  {{ product.category }}
                </span>
              </td>
              <td class="p-4 font-medium text-gray-700">${{ product.price.toFixed(2) }}</td>
              <td class="p-4">
                <div class="flex items-center">
                  <span :class="['w-2.5 h-2.5 rounded-full mr-2', getStockColor(product.stock)]"></span>
                  <span class="text-gray-700">{{ product.stock }}</span>
                  <span class="text-sm text-gray-500 ml-1">({{ getStockText(product.stock) }})</span>
                </div>
              </td>
              <td class="p-4 text-right">
                <svg class="w-5 h-5 text-gray-400 hover:text-gray-700 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex justify-between items-center text-gray-500 text-sm">
        <span>
          Showing 1 to {{ filteredProducts.length }} of {{ productStore.products.length }} results
        </span>
        <div class="flex space-x-2">
          <button class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
