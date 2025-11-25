<!-- src/components/ConfirmModal.vue -->
<script setup>
// Define component's props using a standard JavaScript object
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?',
  },
  confirmButtonText: {
    type: String,
    default: 'Confirm',
  },
  cancelButtonText: {
    type: String,
    default: 'Cancel',
  },
});

// Define the events the component can emit
const emit = defineEmits(['confirm', 'cancel']);

// You can now access the props via `props.title`, `props.message`, etc.
// For example:
// console.log(props.title);

// Emit 'cancel' event when the background or cancel button is clicked
const handleCancel = () => {
  emit('cancel');
};

// Emit 'confirm' event when the confirm button is clicked
const handleConfirm = () => {
  emit('confirm');
};
</script>

<template>
  <!-- The modal is only rendered when isVisible is true -->
  <div v-if="props.isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Modal Header -->
      <div class="p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">{{ props.title }}</h3>
      </div>
      <!-- Modal Body -->
      <div class="p-6">
        <p class="text-gray-700">{{ props.message }}</p>
      </div>
      <!-- Modal Footer -->
      <div class="p-6 border-t flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {{ props.cancelButtonText }}
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {{ props.confirmButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>
