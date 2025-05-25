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

<style lang="scss" scoped>
.headerNav {
  display: flex;
  justify-content: center;
  background-color: #fff;
}

.headerNav__item {
  position: relative;
  display: inline-block;
  color: var(--gray);
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  padding: 1rem 1.5rem;
  text-decoration: none;
  transition: 0.3s;
  &:hover {
    color: var(--black);
  }
}

.headerNav__item--active {
  color: var(--black);
}

@media screen and (min-width: $md) {
  .headerNav__item {
    transition: color 0.2s;
    &:hover {
      color: var(--black);
      text-decoration: none;
    }
  }
}

@media screen and (max-width: $sm) {
  .headerNav__item {
    padding: 0.5rem 1rem;
  }
}
</style>
