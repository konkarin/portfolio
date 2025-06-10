<template>
  <main class="wrapper">
    <article class="wrapper-inner">
      <HomeProfile />
      <HomeRss />
      <HomeBlog />
    </article>
  </main>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
h2 {
  margin: 1rem 0;
}
.wrapper-inner {
  max-width: 65ch;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-image {
  display: flex;
  justify-content: center;
  > div {
    background-position: center;
    background-repeat: no-repeat;
    aspect-ratio: 1 / 1;
    background-size: cover;
    border-radius: 50%;
    min-height: 8rem;
    width: 8rem;
    background-image: url('https://pbs.twimg.com/profile_images/1819236852714422272/m0kTpheH_400x400.jpg');
  }
}
.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.profile-name {
  color: #1c1b0d;
  font-size: 22px;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: -0.015em;
  text-align: center;
}

.profile-title,
.profile-location {
  color: #9c9549;
  font-size: 1rem;
  font-weight: normal;
  line-height: normal;
  text-align: center;
}

.accounts {
  display: flex;
  gap: 0.5rem;
  > a {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    border-bottom: 1px solid #000;
    &:hover {
      border-bottom: 1px solid transparent;
    }
  }
}

.tech-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0;
}

.tech {
  > a {
    display: flex;
    gap: 0.2rem;
    padding: 2px;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
}

.favicon {
  width: 24px;
  height: 24px;
  display: inline;
  border-radius: 4px;
}

.blog {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post {
  font-size: 1.2rem;
  line-height: 1.5;
  color: #333;
  > a {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  &:hover .post-title {
    color: var(--darkYellow);
  }
  &:hover .post-text {
    color: var(--darkYellow);
  }
  @media (hover: hover) {
    &:hover {
      .post-img > img,
      .post-img:has(div) > div {
        transform: scale(1.05);
        opacity: 0.8;
      }
    }
  }
}

.post-inner {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;

  @media (max-width: 768px) {
    gap: 0;
  }
}

.post-title {
  font-weight: bold;
}

.post-text {
  color: #666;
  font-size: 0.9rem;
  @media (max-width: 768px) {
    visibility: hidden;
    height: 0px;
  }
}
.post-text {
  color: #666;
  font-size: 0.9rem;
}

.post-img {
  height: 150px;
  width: 250px;
  overflow: hidden;
  border-radius: 8px;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      opacity 0.3s,
      transform 0.3s;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
}

.post-dummyImg {
  display: grid;
  justify-content: center;
  height: 100%;
  align-items: center;
  font-size: 3rem;
  filter: grayscale(1);
  background: #eee;
  height: 100%;
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.link-button {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background-color: var(--yellow);
  font-weight: bold;
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.7;
  }
}

.blog-footer {
  margin-top: 2rem;
}
</style>
