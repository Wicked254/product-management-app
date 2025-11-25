<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../stores/product';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';
import ConfirmModal from '../views/ConfirmModal.vue';

const productStore = useProductStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const product = ref(null);

const toast = useToast();


const isMobileMenuOpen = ref(false);


const isDeleteModalVisible = ref(false);

onMounted(async () => {
  try {
    product.value = await productStore.fetchProductById(route.params.id);
  } catch (err) {
    toast.error('Failed to load product details. It may have been removed or does not exist.');
    console.error(err);
  }
});

const goBack = () => router.push('/products');
const goToEdit = () => router.push(`/products/${route.params.id}/edit`);


const handleDelete = async () => {

  isDeleteModalVisible.value = true;
};


const confirmDelete = async () => {

  try {
    await productStore.deleteProduct(route.params.id);
    toast.success(`"${product.value.title}" has been deleted successfully.`);
    goBack();
  } catch (err) {
    toast.error('Failed to delete the product. Please try again.');
    console.error(err);
  } finally {
    // Close the modal regardless of outcome
    isDeleteModalVisible.value = false;
  }
};

const cancelDelete = () => {
  // This function just closes the modal
  isDeleteModalVisible.value = false;
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

// Helper to determine stock status and styling
const getStockInfo = (stock) => {
  if (stock > 50) return { color: 'text-green-600', text: 'In Stock' };
  if (stock > 0) return { color: 'text-orange-600', text: 'Low Stock' };
  return { color: 'text-red-600', text: 'Out of Stock' };
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow-md relative z-50">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo and Title -->
            <div class="flex-shrink-0 flex items-center">
              <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                A
              </div>
              <span class="font-bold text-lg">AlienSoft Admin</span>
            </div>
            <!-- Main Nav Links (hidden on mobile, visible on larger screens) -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="/products" class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Products
              </a>
              <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Orders
              </a>
              <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Customers
              </a>
            </div>
          </div>
          <!-- Right side buttons (hidden on mobile) -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600">Logout</button>
          </div>
          <!-- Mobile menu button -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- Mobile menu panel -->
      <div v-if="isMobileMenuOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <a href="#" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Dashboard</a>
          <a href="/products" class="bg-opacity-10 bg-indigo-600 border-indigo-500 text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Products</a>
          <a href="#" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Orders</a>
          <a href="#" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Customers</a>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="mt-3 px-2 space-y-1">
            <button @click="logout" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 w-full text-left">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Area (now takes up the rest of the screen) -->
    <main class="flex-1 p-4 lg:p-8">
      <!-- Header with Actions -->
      <div class="flex justify-between items-center mb-6">
        <!-- Back Button and Title Group -->
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors" title="Go Back">
            <!-- Back Arrow Icon -->
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-gray-800">Product Details</h1>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-2">
          <button @click="goToEdit" class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Edit</button>
          <button @click="handleDelete" class="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
        </div>
      </div>

      <!-- Product Content -->
      <div v-if="productStore.isLoading" class="text-center py-10">Loading product...</div>
      <div v-else-if="product" class="bg-white rounded-lg shadow-lg p-4 md:p-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Product Images -->
          <div class="flex-1">
            <div class="bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img :src="product.thumbnail" :alt="product.title" class="w-full h-96 object-cover" />
            </div>
            <!-- Thumbnails -->
            <div class="flex space-x-2 overflow-x-auto">
              <img v-for="(image, index) in product.images" :key="index" :src="image" :alt="`${product.title} ${index + 1}`" class="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-indigo-500" />
            </div>
          </div>

          <!-- Product Details -->
          <div class="flex-1 lg:max-w-md">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ product.title }}</h2>
            <p class="text-gray-600 mb-4">{{ product.description }}</p>

            <!-- Price and Discount -->
            <div class="flex items-center mb-4">
              <span v-if="product.discountPercentage" class="text-3xl font-bold text-gray-900">${{ (product.price * (1 - product.discountPercentage / 100)).toFixed(2) }}</span>
              <span v-else class="text-3xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</span>
              <span v-if="product.discountPercentage" class="ml-2 text-lg text-gray-500 line-through">${{ product.price.toFixed(2) }}</span>
              <span v-if="product.discountPercentage" class="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">{{ product.discountPercentage }}% OFF</span>
            </div>

            <!-- Other Details -->
            <div class="mb-6 space-y-2">
              <div class="flex items-center">
                <span class="font-semibold text-gray-700 w-24">Category:</span>
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{{ product.category }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold text-gray-700 w-24">Stock:</span>
                <span :class="getStockInfo(product.stock).color">
                  {{ getStockInfo(product.stock).text }} ({{ product.stock }} units)
                </span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold text-gray-700 w-24">Brand:</span>
                <span class="text-gray-600">{{ product.brand || 'N/A' }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold text-gray-700 w-24">SKU:</span>
                <span class="text-gray-600">{{ product.sku || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Reviews Section -->
        <div class="mt-12 border-t pt-8">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
          <div class="flex flex-col md:flex-row md:items-center md:space-x-8">
            <div class="flex items-center mb-4 md:mb-0">
              <span class="text-4xl font-bold mr-4">{{ product.rating.toFixed(1) }}</span>
              <div>
                <div class="flex text-yellow-400">
                  <span v-for="i in 5" :key="i" :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'">★</span>
                </div>
                <p class="text-sm text-gray-500">Based on {{ product.reviews?.length || 0 }} reviews</p>
              </div>
            </div>
            <div class="flex-1 space-y-2">
              <div v-for="star in 5" :key="star" class="flex items-center">
                <span class="w-4">{{ 6 - star }}</span>
                <div class="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div :style="{ width: `${((6 - star) / 5) * product.rating * 20}%` }" class="h-full bg-yellow-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
<ConfirmModal
  :isVisible="isDeleteModalVisible"
  title="Delete Product"
  :message='`Are you sure you want to delete "${product?.title}"? This action cannot be undone.`'
  confirmButtonText="Delete"
  cancelButtonText="Cancel"
  @confirm="confirmDelete"
  @cancel="cancelDelete"
/>
  </div>
</template>
