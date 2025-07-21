<template>
  <h1 class="pageTitle">
    <slot />
  </h1>
</template>

<style lang="scss" scoped>
.pageTitle {
  font-size: 2rem;
  text-align: center;
  &__link {
    color: var(--darkYellow);
    @media screen and (min-width: $lg) {
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
