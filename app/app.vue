<template>
  <ToastProvider>
    <NuxtPage />
  </ToastProvider>
</template>

<style>
.page-enter-active {
  transition: opacity 0.1s ease-in;
}
.page-leave-active {
  transition: opacity 0.1s ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
