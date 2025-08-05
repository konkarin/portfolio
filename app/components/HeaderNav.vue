<template>
  <nav class="headerNav">
    <div class="headerNav__icon"></div>
    <div>
      <NuxtLink
        to="/"
        class="headerNav__item"
        :class="{ 'headerNav__item--active': $route.path === '/' }"
      >
        Home
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
        Blog
      </NuxtLink>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.headerNav {
  display: flex;
  justify-content: space-between;
  padding: 2rem;
}

.headerNav__item {
  position: relative;
  display: inline-block;
  color: var(--gray);
  font-size: 1rem;
  padding: 0 0.6rem;
  text-decoration: none;
  transition: 0.3s;
  &:hover {
    color: var(--black);
  }
}

.headerNav__item--active {
  color: var(--black);
}

@media screen and (min-width: $lg) {
  .headerNav__item {
    transition: color 0.2s;
    &:hover {
      color: var(--black);
      text-decoration: none;
    }
  }
}
</style>
