<template>
  <div class="loader"></div>
</template>

<style lang="scss" scoped>
.loader {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 10px solid #fff;
  border-right-color: transparent;
  animation: spin 1s linear infinite;
  z-index: 999;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
    opacity: 0.2;
  }
  50% {
    transform: rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0.2;
  }
}
</style>
