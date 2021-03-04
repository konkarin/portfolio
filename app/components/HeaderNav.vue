<template>
  <nav class="headerNav">
    <NuxtLink
      to="/"
      class="headerNav__item"
      :class="{ 'headerNav__item--active': $route.path === '/' }"
    >
      Home
    </NuxtLink>
    <NuxtLink
      to="/about"
      class="headerNav__item"
      :class="{ 'headerNav__item--active': $route.path === '/about' }"
    >
      About
    </NuxtLink>
    <NuxtLink
      to="/gallery"
      class="headerNav__item"
      :class="{ 'headerNav__item--active': $route.path === '/gallery' }"
    >
      Gallery
    </NuxtLink>
    <NuxtLink
      to="/articles"
      class="headerNav__item"
      :class="{ 'headerNav__item--active': $route.path.includes('/articles') }"
    >
      Articles
    </NuxtLink>
  </nav>
</template>
