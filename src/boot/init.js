import { boot } from 'quasar/wrappers'
import {Cookies} from "quasar"
import {useAuthStore} from "stores/auth"
import YmapPlugin from 'vue-yandex-maps'

export default boot(async({ app, ssrContext,store }) => {
  const authStore = useAuthStore(store)
  const settings = {
    apiKey: 'abfeb9a4-7dd7-471f-a8ce-00504621014c', // Индивидуальный ключ API
    lang: 'ru_RU', // Используемый язык
    coordorder: 'latlong', // Порядок задания географических координат
    debug: false, // Режим отладки
    version: '2.1' // Версия Я.Карт
  }

  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies
  await authStore.getUser()
  app.use(YmapPlugin, settings)
  app.config.globalProperties.auth = authStore.$state


})

