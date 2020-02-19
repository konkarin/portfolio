<template>
  <div id="app">
    <hnav />
    <transition
      appear
      name="fade"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
import HeaderNav from './components/parts/HeaderNav'
export default {
  name: 'App',
  components: {
    hnav: HeaderNav
  }
}
</script>
