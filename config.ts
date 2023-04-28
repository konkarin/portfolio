const targetEnv: string = '{{TARGET_ENV}}'

const production = {
  API_KEY: 'AIzaSyAeEviiI6BRwheQrmiXpBeztb_XcUdZw8E',
  AUTH_DOMAIN: 'konkarin-photo.firebaseapp.com',
  PROJECT_ID: 'konkarin-photo',
  STORAGE_BUCKET: 'konkarin-photo.appspot.com',
  MESSAGING_SENDER_ID: '631852417771',
  APP_ID: '1:631852417771:web:46ff2edb9660c9906534ae',
  MEASUREMENT_ID: 'G-YGDY0HJSYV',
  AUTHOR_ID: 'y6VxBfC6TPPWTRvV5siYr1wzfBx2',
  APP_URL: 'https://konkarin.photo',
}

const development = {
  API_KEY: 'AIzaSyAZUlX7Qx63lE5IAp9mfjEPfGvn6v-Hwjs',
  AUTH_DOMAIN: 'staging-konkarin-photo.firebaseapp.com',
  PROJECT_ID: 'staging-konkarin-photo',
  STORAGE_BUCKET: 'staging-konkarin-photo.appspot.com',
  MESSAGING_SENDER_ID: '607311000326',
  APP_ID: '1:607311000326:web:ffd640d8859113a35a6487',
  MEASUREMENT_ID: 'G-5QD17SVXWZ',
  AUTHOR_ID: 'oOHIOfsyFSh5fVKAJoGSSmL2lfo2',
  APP_URL: 'https://staging-konkarin-photo.web.app/',
}

export const runtimePublicConfig =
  targetEnv === 'production' ? production : development
