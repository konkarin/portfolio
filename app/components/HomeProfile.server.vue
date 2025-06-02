<template>
  <section>
    <h2>About me</h2>
    <div class="profile">
      <div class="profile-image">
        <div></div>
      </div>
      <div>
        <p>
          こん と申します。Webフロントエンドを主に開発しています。<br />コーヒー飲みながら猫と暮らしています。たまにキャンプします。
        </p>
        <p class="accounts">
          <a href="https://x.com/k0n_karin" target="_blank"><Twitter />Twitter</a>
          <a href="https://github.com/konkarin" target="_blank"><Github />GitHub</a>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
h2 {
  margin: 1rem 0;
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
</style>
