<template>
  <q-page >

    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <p class="no-margin title text-bold">Все оборудование</p>
        <q-space/>
        <q-btn unelevated
               :class="searchActive ? '' : 'btn-bg'" outline

               :color="searchActive ? 'primary' : ''"
               :text-color="searchActive ? 'white' : 'dark'"
               @click="searchActive = !searchActive"
               icon="search"/>
        <q-btn unelevated outline class="btn-bg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 14C11.1569 14 12.5 15.3431 12.5 17C12.5 18.6568 11.1569 20 9.5 20C7.84315 20 6.5 18.6568 6.5 17C6.5 15.3431 7.84315 14 9.5 14Z" fill="#ECECF0" stroke="#11173E" stroke-width="2"/>
            <path d="M14.5 3.99998C12.8431 3.99998 11.5 5.34312 11.5 6.99998C11.5 8.65683 12.8431 9.99998 14.5 9.99998C16.1569 9.99998 17.5 8.65683 17.5 6.99998C17.5 5.34312 16.1569 3.99998 14.5 3.99998Z" fill="#ECECF0" stroke="#11173E" stroke-width="2"/>
            <path opacity="0.21" d="M13 17L22 17" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
            <path opacity="0.21" d="M11 7L2 6.9585" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
            <path opacity="0.21" d="M2 17L6 17" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
            <path opacity="0.21" d="M22 7L18 7" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <q-menu>
            <q-card flat style="max-width:500px">
              <q-card-section style="padding: 10px !important; border-radius: 12px">

                <div class="row q-col-gutter-md">
                  <div class="col-4"><q-checkbox v-model="filters.is_warranty" label="На гарантии"/></div>
                  <div class="col-4"><q-checkbox v-model="filters.is_service_book_sign" label="Сервисная кн. подписана"/></div>
                  <div class="col-4"><q-checkbox v-model="filters.is_at_exchange" label="На замене"/></div>
                  <div class="col-6">
                    <q-select outlined v-model="filters.model__firm_id"
                              :options="firms"  option-label="name" label="Выберите фирму"
                              map-options
                              option-value="id"
                              emit-value
                              dense
                              @update:model-value="getModels"
                              clearable
                    />

                  </div>
                  <div class="col-6">
                    <q-select outlined v-model="filters.model_id"
                              :options="models"  option-label="name" label="Выберите модель"
                              map-options
                              option-value="id"
                              emit-value
                              dense
                              clearable

                    />
                  </div>
                  <div class="col-6"> <q-input outlined dense v-model="filters.date_in_work_gte"  label="Дата отгрузки от" >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="filters.date_in_work_gte" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Выбрать" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input></div>
                  <div class="col-6">  <q-input outlined dense v-model="filters.date_in_work_lte"  label="Дата отгрузки до" >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="filters.date_in_work_lte" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Выбрать" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input></div>

                </div>

                <br>
                <q-btn label="Применить фильтр" @click="filterAction('apply')" v-close-popup unelevated no-caps/>
                <q-btn label="Сбросить фильтр" @click="filterAction('clear')" v-close-popup unelevated no-caps/>

              </q-card-section>
            </q-card>
          </q-menu>
        </q-btn>

        <AddButton icon="add" label="Создать оборудование" @click="$router.push('/service/equipment/add')"/>
      </div>
    </div>
    <div v-if="searchActive" class="rounded-box q-mt-md q-mb-lg">
      <div class="page-search ">

        <q-input class="input" v-model="filters.q" dense rounded outlined placeholder="Поиск" @keydown.enter="filterAction('apply')">
          <template v-slot:prepend>
            <q-icon name="search" color="grey-4"/>
          </template>
        </q-input>
        <q-btn @click="filterAction('apply')" unelevated class="btn-bg" icon="search"/>

        <q-btn unelevated @click="filterAction('clear'), searchActive = false" class="btn-bg" icon="close"/>
      </div>
    </div>
    <div class="rounded-box">

      <q-table
        flat
        :rows="rows"
        :columns="columns"
        row-key="name"
        table-header-class="t1able-header"
        hide-pagination
        v-model:pagination="pagination"
        :loading = is_loading
        class="q-mb-md"
      >
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-grey-2">

            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              <span class="text-bold"> {{ col.label }}</span>
            </q-th>
            <q-th auto-width />
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props">

              <router-link class="table_link" v-if="col.is_link" :to="`/service/object/${props.row.object?.id}`">{{ props.row.object?.address }}</router-link>
              <span v-else-if="col.name ==='is_warranty'">
                <q-icon v-if="col.value" name="check_circle" size="20px" color="positive"/>
                                <q-icon v-else name="do_not_disturb_on" size="20px" color="negative"/>
              </span>
              <span v-else-if="col.name ==='is_service_book_sign'">
                <q-icon v-if="col.value" name="check_circle" size="20px" color="positive"/>
                                <q-icon v-else name="do_not_disturb_on" size="20px" color="negative"/>
              </span>
              <span v-else-if="col.name ==='is_at_exchange'">
                <q-icon v-if="col.value" name="check_circle" size="20px" color="positive"/>
                                <q-icon v-else name="do_not_disturb_on" size="20px" color="negative"/>
              </span>
              <span v-else>{{ col.value }}</span>

            </q-td>

            <q-td auto-width>
<!--              <q-btn flat round dense class="q-mr-sm" :ripple="false" :href="props.row.qr" target="_blank">-->
<!--                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                  <path d="M1 18.8803C1 17.309 1 16.5234 1.35366 15.9463C1.55156 15.6234 1.82307 15.3519 2.146 15.154C2.72313 14.8003 3.50875 14.8003 5.08 14.8003H6.4C8.66274 14.8003 9.79411 14.8003 10.4971 15.5032C11.2 16.2062 11.2 17.3376 11.2 19.6003V20.9203C11.2 22.4915 11.2 23.2772 10.8463 23.8543C10.6484 24.1772 10.3769 24.4487 10.054 24.6466C9.47687 25.0003 8.69125 25.0003 7.12 25.0003C4.76313 25.0003 3.58469 25.0003 2.719 24.4698C2.23461 24.173 1.82734 23.7657 1.5305 23.2813C1 22.4156 1 21.2372 1 18.8803Z" stroke="#131119" stroke-width="1.5"/>-->
<!--                  <path d="M14.8008 5.08024C14.8008 3.509 14.8008 2.72337 15.1544 2.14625C15.3523 1.82331 15.6239 1.5518 15.9468 1.35391C16.5239 1.00024 17.3095 1.00024 18.8808 1.00024C21.2377 1.00024 22.4161 1.00024 23.2818 1.53074C23.7662 1.82758 24.1734 2.23485 24.4703 2.71925C25.0008 3.58494 25.0008 4.76337 25.0008 7.12024C25.0008 8.69149 25.0008 9.47711 24.6471 10.0542C24.4492 10.3772 24.1777 10.6487 23.8548 10.8466C23.2777 11.2002 22.492 11.2002 20.9208 11.2002H19.6008C17.338 11.2002 16.2067 11.2002 15.5037 10.4973C14.8008 9.79436 14.8008 8.66299 14.8008 6.40024V5.08024Z" stroke="#131119" stroke-width="1.5"/>-->
<!--                  <path d="M18.3984 6.09985C18.3984 5.48137 18.3984 5.17212 18.5534 4.95377C18.608 4.87672 18.6753 4.80945 18.7524 4.75478C18.9707 4.59985 19.2799 4.59985 19.8984 4.59985C20.5169 4.59985 20.8262 4.59985 21.0445 4.75478C21.1216 4.80945 21.1888 4.87672 21.2435 4.95377C21.3984 5.17212 21.3984 5.48137 21.3984 6.09985C21.3984 6.71834 21.3984 7.02759 21.2435 7.24594C21.1888 7.32298 21.1216 7.39026 21.0445 7.44492C20.8262 7.59985 20.5169 7.59985 19.8984 7.59985C19.2799 7.59985 18.9707 7.59985 18.7524 7.44492C18.6753 7.39026 18.608 7.32298 18.5534 7.24594C18.3984 7.02759 18.3984 6.71834 18.3984 6.09985Z" fill="#131119"/>-->
<!--                  <path d="M14.0508 25C14.0508 25.4143 14.3866 25.75 14.8008 25.75C15.215 25.75 15.5508 25.4143 15.5508 25H14.0508ZM15.8674 15.2045L16.2841 15.8281L16.2841 15.8281L15.8674 15.2045ZM15.2053 15.8667L14.5817 15.45L14.5817 15.45L15.2053 15.8667ZM21.4008 14.05H19.0008V15.55H21.4008V14.05ZM14.0508 21.4V25H15.5508V21.4H14.0508ZM19.0008 14.05C18.1737 14.05 17.497 14.0491 16.9532 14.1045C16.3969 14.1611 15.8972 14.2826 15.4507 14.5809L16.2841 15.8281C16.443 15.722 16.6673 15.6413 17.105 15.5968C17.5552 15.551 18.1425 15.55 19.0008 15.55V14.05ZM15.5508 19C15.5508 18.1418 15.5517 17.5545 15.5975 17.1043C15.642 16.6666 15.7227 16.4423 15.8289 16.2834L14.5817 15.45C14.2833 15.8964 14.1618 16.3961 14.1052 16.9525C14.0499 17.4962 14.0508 18.173 14.0508 19H15.5508ZM15.4507 14.5809C15.1068 14.8107 14.8115 15.1061 14.5817 15.45L15.8289 16.2834C15.9492 16.1032 16.1039 15.9485 16.2841 15.8281L15.4507 14.5809Z" fill="#131119"/>-->
<!--                  <path d="M25.75 14.8003C25.75 14.3861 25.4142 14.0503 25 14.0503C24.5858 14.0503 24.25 14.3861 24.25 14.8003H25.75ZM23.5184 24.8176L23.8055 25.5105L23.8055 25.5105L23.5184 24.8176ZM24.8173 23.5187L24.1244 23.2317V23.2317L24.8173 23.5187ZM19 25.7503H21.4V24.2503H19V25.7503ZM25.75 19.0003V14.8003H24.25V19.0003H25.75ZM21.4 25.7503C21.9489 25.7503 22.3981 25.7507 22.7642 25.7257C23.1371 25.7003 23.4783 25.646 23.8055 25.5105L23.2314 24.1247C23.1175 24.1719 22.9586 24.209 22.6621 24.2292C22.3589 24.2499 21.9694 24.2503 21.4 24.2503V25.7503ZM24.25 21.4003C24.25 21.9697 24.2496 22.3592 24.2289 22.6624C24.2087 22.9589 24.1716 23.1178 24.1244 23.2317L25.5102 23.8057C25.6457 23.4786 25.7 23.1374 25.7254 22.7645C25.7504 22.3984 25.75 21.9492 25.75 21.4003H24.25ZM23.8055 25.5105C24.5773 25.1908 25.1905 24.5776 25.5102 23.8057L24.1244 23.2317C23.9569 23.636 23.6357 23.9572 23.2314 24.1247L23.8055 25.5105Z" fill="#131119"/>-->
<!--                  <path d="M1 7.12024C1 4.76337 1 3.58494 1.5305 2.71925C1.82734 2.23485 2.23461 1.82758 2.719 1.53074C3.58469 1.00024 4.76313 1.00024 7.12 1.00024C8.69125 1.00024 9.47687 1.00024 10.054 1.35391C10.3769 1.5518 10.6484 1.82331 10.8463 2.14625C11.2 2.72337 11.2 3.509 11.2 5.08024V6.40024C11.2 8.66299 11.2 9.79436 10.4971 10.4973C9.79411 11.2002 8.66274 11.2002 6.4 11.2002H5.08C3.50875 11.2002 2.72313 11.2002 2.146 10.8466C1.82307 10.6487 1.55156 10.3772 1.35366 10.0542C1 9.47711 1 8.69149 1 7.12024Z" stroke="#131119" stroke-width="1.5"/>-->
<!--                  <path d="M4.60156 6.09985C4.60156 5.48137 4.60156 5.17212 4.75649 4.95377C4.81116 4.87672 4.87843 4.80945 4.95548 4.75478C5.17383 4.59985 5.48307 4.59985 6.10156 4.59985C6.72005 4.59985 7.02929 4.59985 7.24765 4.75478C7.32469 4.80945 7.39197 4.87672 7.44663 4.95377C7.60156 5.17212 7.60156 5.48137 7.60156 6.09985C7.60156 6.71834 7.60156 7.02759 7.44663 7.24594C7.39197 7.32298 7.32469 7.39026 7.24765 7.44492C7.02929 7.59985 6.72005 7.59985 6.10156 7.59985C5.48307 7.59985 5.17383 7.59985 4.95548 7.44492C4.87843 7.39026 4.81116 7.32298 4.75649 7.24594C4.60156 7.02759 4.60156 6.71834 4.60156 6.09985Z" fill="#131119"/>-->
<!--                  <path d="M4.60156 19.9006C4.60156 19.2821 4.60156 18.9729 4.75649 18.7546C4.81116 18.6775 4.87843 18.6102 4.95548 18.5556C5.17383 18.4006 5.48307 18.4006 6.10156 18.4006C6.72005 18.4006 7.02929 18.4006 7.24765 18.5556C7.32469 18.6102 7.39197 18.6775 7.44663 18.7546C7.60156 18.9729 7.60156 19.2821 7.60156 19.9006C7.60156 20.5191 7.60156 20.8284 7.44663 21.0467C7.39197 21.1238 7.32469 21.191 7.24765 21.2457C7.02929 21.4006 6.72005 21.4006 6.10156 21.4006C5.48307 21.4006 5.17383 21.4006 4.95548 21.2457C4.87843 21.191 4.81116 21.1238 4.75649 21.0467C4.60156 20.8284 4.60156 20.5191 4.60156 19.9006Z" fill="#131119"/>-->
<!--                  <path d="M17.8008 19.9C17.8008 19.0574 17.8008 18.636 18.003 18.3334C18.0906 18.2023 18.2031 18.0898 18.3341 18.0023C18.6368 17.8 19.0581 17.8 19.9008 17.8C20.7435 17.8 21.1648 17.8 21.4675 18.0023C21.5985 18.0898 21.711 18.2023 21.7985 18.3334C22.0008 18.636 22.0008 19.0574 22.0008 19.9C22.0008 20.7427 22.0008 21.1641 21.7985 21.4667C21.711 21.5978 21.5985 21.7103 21.4675 21.7978C21.1648 22 20.7435 22 19.9008 22C19.0581 22 18.6368 22 18.3341 21.7978C18.2031 21.7103 18.0906 21.5978 18.003 21.4667C17.8008 21.1641 17.8008 20.7427 17.8008 19.9Z" fill="#131119"/>-->
<!--                </svg>-->

<!--              </q-btn>-->
              <q-btn flat round dense class="q-mr-sm" :ripple="false" :href="props.row.qr" target="_blank">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 18.8803C1 17.309 1 16.5234 1.35366 15.9463C1.55156 15.6234 1.82307 15.3519 2.146 15.154C2.72313 14.8003 3.50875 14.8003 5.08 14.8003H6.4C8.66274 14.8003 9.79411 14.8003 10.4971 15.5032C11.2 16.2062 11.2 17.3376 11.2 19.6003V20.9203C11.2 22.4915 11.2 23.2772 10.8463 23.8543C10.6484 24.1772 10.3769 24.4487 10.054 24.6466C9.47687 25.0003 8.69125 25.0003 7.12 25.0003C4.76313 25.0003 3.58469 25.0003 2.719 24.4698C2.23461 24.173 1.82734 23.7657 1.5305 23.2813C1 22.4156 1 21.2372 1 18.8803Z" stroke="#131119" stroke-width="1.5"/>
                  <path d="M14.8008 5.08024C14.8008 3.509 14.8008 2.72337 15.1544 2.14625C15.3523 1.82331 15.6239 1.5518 15.9468 1.35391C16.5239 1.00024 17.3095 1.00024 18.8808 1.00024C21.2377 1.00024 22.4161 1.00024 23.2818 1.53074C23.7662 1.82758 24.1734 2.23485 24.4703 2.71925C25.0008 3.58494 25.0008 4.76337 25.0008 7.12024C25.0008 8.69149 25.0008 9.47711 24.6471 10.0542C24.4492 10.3772 24.1777 10.6487 23.8548 10.8466C23.2777 11.2002 22.492 11.2002 20.9208 11.2002H19.6008C17.338 11.2002 16.2067 11.2002 15.5037 10.4973C14.8008 9.79436 14.8008 8.66299 14.8008 6.40024V5.08024Z" stroke="#131119" stroke-width="1.5"/>
                  <path d="M18.3984 6.09985C18.3984 5.48137 18.3984 5.17212 18.5534 4.95377C18.608 4.87672 18.6753 4.80945 18.7524 4.75478C18.9707 4.59985 19.2799 4.59985 19.8984 4.59985C20.5169 4.59985 20.8262 4.59985 21.0445 4.75478C21.1216 4.80945 21.1888 4.87672 21.2435 4.95377C21.3984 5.17212 21.3984 5.48137 21.3984 6.09985C21.3984 6.71834 21.3984 7.02759 21.2435 7.24594C21.1888 7.32298 21.1216 7.39026 21.0445 7.44492C20.8262 7.59985 20.5169 7.59985 19.8984 7.59985C19.2799 7.59985 18.9707 7.59985 18.7524 7.44492C18.6753 7.39026 18.608 7.32298 18.5534 7.24594C18.3984 7.02759 18.3984 6.71834 18.3984 6.09985Z" fill="#131119"/>
                  <path d="M14.0508 25C14.0508 25.4143 14.3866 25.75 14.8008 25.75C15.215 25.75 15.5508 25.4143 15.5508 25H14.0508ZM15.8674 15.2045L16.2841 15.8281L16.2841 15.8281L15.8674 15.2045ZM15.2053 15.8667L14.5817 15.45L14.5817 15.45L15.2053 15.8667ZM21.4008 14.05H19.0008V15.55H21.4008V14.05ZM14.0508 21.4V25H15.5508V21.4H14.0508ZM19.0008 14.05C18.1737 14.05 17.497 14.0491 16.9532 14.1045C16.3969 14.1611 15.8972 14.2826 15.4507 14.5809L16.2841 15.8281C16.443 15.722 16.6673 15.6413 17.105 15.5968C17.5552 15.551 18.1425 15.55 19.0008 15.55V14.05ZM15.5508 19C15.5508 18.1418 15.5517 17.5545 15.5975 17.1043C15.642 16.6666 15.7227 16.4423 15.8289 16.2834L14.5817 15.45C14.2833 15.8964 14.1618 16.3961 14.1052 16.9525C14.0499 17.4962 14.0508 18.173 14.0508 19H15.5508ZM15.4507 14.5809C15.1068 14.8107 14.8115 15.1061 14.5817 15.45L15.8289 16.2834C15.9492 16.1032 16.1039 15.9485 16.2841 15.8281L15.4507 14.5809Z" fill="#131119"/>
                  <path d="M25.75 14.8003C25.75 14.3861 25.4142 14.0503 25 14.0503C24.5858 14.0503 24.25 14.3861 24.25 14.8003H25.75ZM23.5184 24.8176L23.8055 25.5105L23.8055 25.5105L23.5184 24.8176ZM24.8173 23.5187L24.1244 23.2317V23.2317L24.8173 23.5187ZM19 25.7503H21.4V24.2503H19V25.7503ZM25.75 19.0003V14.8003H24.25V19.0003H25.75ZM21.4 25.7503C21.9489 25.7503 22.3981 25.7507 22.7642 25.7257C23.1371 25.7003 23.4783 25.646 23.8055 25.5105L23.2314 24.1247C23.1175 24.1719 22.9586 24.209 22.6621 24.2292C22.3589 24.2499 21.9694 24.2503 21.4 24.2503V25.7503ZM24.25 21.4003C24.25 21.9697 24.2496 22.3592 24.2289 22.6624C24.2087 22.9589 24.1716 23.1178 24.1244 23.2317L25.5102 23.8057C25.6457 23.4786 25.7 23.1374 25.7254 22.7645C25.7504 22.3984 25.75 21.9492 25.75 21.4003H24.25ZM23.8055 25.5105C24.5773 25.1908 25.1905 24.5776 25.5102 23.8057L24.1244 23.2317C23.9569 23.636 23.6357 23.9572 23.2314 24.1247L23.8055 25.5105Z" fill="#131119"/>
                  <path d="M1 7.12024C1 4.76337 1 3.58494 1.5305 2.71925C1.82734 2.23485 2.23461 1.82758 2.719 1.53074C3.58469 1.00024 4.76313 1.00024 7.12 1.00024C8.69125 1.00024 9.47687 1.00024 10.054 1.35391C10.3769 1.5518 10.6484 1.82331 10.8463 2.14625C11.2 2.72337 11.2 3.509 11.2 5.08024V6.40024C11.2 8.66299 11.2 9.79436 10.4971 10.4973C9.79411 11.2002 8.66274 11.2002 6.4 11.2002H5.08C3.50875 11.2002 2.72313 11.2002 2.146 10.8466C1.82307 10.6487 1.55156 10.3772 1.35366 10.0542C1 9.47711 1 8.69149 1 7.12024Z" stroke="#131119" stroke-width="1.5"/>
                  <path d="M4.60156 6.09985C4.60156 5.48137 4.60156 5.17212 4.75649 4.95377C4.81116 4.87672 4.87843 4.80945 4.95548 4.75478C5.17383 4.59985 5.48307 4.59985 6.10156 4.59985C6.72005 4.59985 7.02929 4.59985 7.24765 4.75478C7.32469 4.80945 7.39197 4.87672 7.44663 4.95377C7.60156 5.17212 7.60156 5.48137 7.60156 6.09985C7.60156 6.71834 7.60156 7.02759 7.44663 7.24594C7.39197 7.32298 7.32469 7.39026 7.24765 7.44492C7.02929 7.59985 6.72005 7.59985 6.10156 7.59985C5.48307 7.59985 5.17383 7.59985 4.95548 7.44492C4.87843 7.39026 4.81116 7.32298 4.75649 7.24594C4.60156 7.02759 4.60156 6.71834 4.60156 6.09985Z" fill="#131119"/>
                  <path d="M4.60156 19.9006C4.60156 19.2821 4.60156 18.9729 4.75649 18.7546C4.81116 18.6775 4.87843 18.6102 4.95548 18.5556C5.17383 18.4006 5.48307 18.4006 6.10156 18.4006C6.72005 18.4006 7.02929 18.4006 7.24765 18.5556C7.32469 18.6102 7.39197 18.6775 7.44663 18.7546C7.60156 18.9729 7.60156 19.2821 7.60156 19.9006C7.60156 20.5191 7.60156 20.8284 7.44663 21.0467C7.39197 21.1238 7.32469 21.191 7.24765 21.2457C7.02929 21.4006 6.72005 21.4006 6.10156 21.4006C5.48307 21.4006 5.17383 21.4006 4.95548 21.2457C4.87843 21.191 4.81116 21.1238 4.75649 21.0467C4.60156 20.8284 4.60156 20.5191 4.60156 19.9006Z" fill="#131119"/>
                  <path d="M17.8008 19.9C17.8008 19.0574 17.8008 18.636 18.003 18.3334C18.0906 18.2023 18.2031 18.0898 18.3341 18.0023C18.6368 17.8 19.0581 17.8 19.9008 17.8C20.7435 17.8 21.1648 17.8 21.4675 18.0023C21.5985 18.0898 21.711 18.2023 21.7985 18.3334C22.0008 18.636 22.0008 19.0574 22.0008 19.9C22.0008 20.7427 22.0008 21.1641 21.7985 21.4667C21.711 21.5978 21.5985 21.7103 21.4675 21.7978C21.1648 22 20.7435 22 19.9008 22C19.0581 22 18.6368 22 18.3341 21.7978C18.2031 21.7103 18.0906 21.5978 18.003 21.4667C17.8008 21.1641 17.8008 20.7427 17.8008 19.9Z" fill="#131119"/>
                </svg>

              </q-btn>
<!--              <q-btn flat round dense class="q-mr-sm" @click="props.expand = !props.expand" :ripple="false">-->
<!--                <svg v-if="!props.expand" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.66602 16.0003C3.66602 25.2497 6.75002 28.3337 15.9993 28.3337C25.2487 28.3337 28.3327 25.2497 28.3327 16.0003C28.3327 6.75099 25.2487 3.66699 15.9993 3.66699C6.75002 3.66699 3.66602 6.75099 3.66602 16.0003Z" fill="#31948E" stroke="#31948E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--                  <path d="M11.3691 14.0771C11.3691 14.0771 14.5585 18.7251 15.9985 18.7251C17.4385 18.7251 20.6251 14.0771 20.6251 14.0771" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--                </svg>-->
<!--                <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                  <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M3.66602 16.0003C3.66602 25.2497 6.75002 28.3337 15.9993 28.3337C25.2487 28.3337 28.3327 25.2497 28.3327 16.0003C28.3327 6.75099 25.2487 3.66699 15.9993 3.66699C6.75002 3.66699 3.66602 6.75099 3.66602 16.0003Z" stroke="#131119" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--                  <path d="M11.3691 14.0771C11.3691 14.0771 14.5585 18.7251 15.9985 18.7251C17.4385 18.7251 20.6251 14.0771 20.6251 14.0771" stroke="#131119" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--                </svg>-->

<!--              </q-btn>-->
              <q-btn flat round dense :to="`/service/equipment/${props.row.id}`">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.46967 17.4702C5.17678 17.7631 5.17678 18.2379 5.46967 18.5308C5.76256 18.8237 6.23744 18.8237 6.53033 18.5308L5.46967 17.4702ZM6.53033 18.5308L18.5303 6.53082L17.4697 5.47016L5.46967 17.4702L6.53033 18.5308Z" fill="#131119"/>
                  <path d="M9 6.00049H18V15.0005" stroke="#131119" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </q-btn>
            </q-td>
          </q-tr>

<!--          <q-tr v-show="props.expand" :props="props">-->
<!--            <q-td colspan="100%">-->
<!--              <div class="text-left">-->
<!--                <p class="text-weight-bolder q-mb-xs">Коментарий</p>-->
<!--                <p class="comment q-mb-lg">{{props.row.comment}}</p>-->
<!--                <p class="text-bold q-mb-xs">Заявки</p>-->

<!--                <q-list >-->

<!--                  <q-item  v-for="order in props.row.orders.filter(x=>!x.is_done)" class="bg-green-1 q-mb-sm">-->
<!--                    <q-item-section>-->
<!--                      <q-item-label>{{order.stage?.name}}</q-item-label>-->
<!--                      <q-item-label caption>Статус: {{order.status?.name}}</q-item-label>-->
<!--                    </q-item-section>-->
<!--                    <q-item-section side>-->
<!--                      <q-btn flat round dense :to="`/order/${order.number}`">-->
<!--                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                          <path d="M5.46967 17.4702C5.17678 17.7631 5.17678 18.2379 5.46967 18.5308C5.76256 18.8237 6.23744 18.8237 6.53033 18.5308L5.46967 17.4702ZM6.53033 18.5308L18.5303 6.53082L17.4697 5.47016L5.46967 17.4702L6.53033 18.5308Z" fill="#131119"/>-->
<!--                          <path d="M9 6.00049H18V15.0005" stroke="#131119" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--                        </svg>-->

<!--                      </q-btn>-->
<!--                    </q-item-section>-->

<!--                  </q-item>-->
<!--                </q-list>-->

<!--              </div>-->
<!--            </q-td>-->
<!--          </q-tr>-->
        </template>
      </q-table>
        <q-pagination
                v-model="page"
                :max="maxPages"
                :max-pages="6"
                direction-links
                boundary-numbers
                @update:model-value = setPage
                icon-first="skip_previous"
                icon-last="skip_next"
                icon-prev="fast_rewind"
                icon-next="fast_forward"
        />
    </div>
  </q-page>

</template>


<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
const handleDateClick = (arg) => {
  console.log('arg')
}
const handleSelect = (arg) => {
  console.log(arg)
}
const initialPagination= {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50
  // rowsNumber: xx if getting data from a server
}


import {defineAsyncComponent, onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import AddButton from "components/AddButton.vue";


const columns = [
  { name: 'date_in_work', align: 'left',  label: 'Дата отгрузки', field: row => new Date(row.date_in_work).toLocaleDateString(),  sortable: true, is_link:false},
  { name: 'serial_number', align: 'left',  label: 'Серийный номер', field: 'serial_number',  sortable: true, is_link:false},
  { name: 'model_name', align: 'left',  label: 'Модель', field: row => row.model?.name ,  sortable: true, is_link:false},
  { name: 'model_firm', align: 'left',  label: 'Фирма', field: row => row.model?.firm.name ,  sortable: true, is_link:false},
  { name: 'date_in_work', align: 'left',  label: 'Дата отгрузки', field: row => row.date_in_work ,  sortable: true, is_link:false},
  { name: 'object', align: 'left',  label: 'Объект', field: row => row.object ,  sortable: true, is_link:true},
  { name: 'is_warranty', align: 'left',  label: 'Гарантии', field: row => row.is_warranty ,  sortable: true},
  { name: 'is_service_book_sign', align: 'left',  label: 'С/К', field: row => row.is_service_book_sign ,  sortable: true},
  { name: 'is_at_exchange', align: 'left',  label: 'На замене', field: row => row.is_at_exchange ,  sortable: true},
]
const page = ref(1)
const is_loading = ref(false)

const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage:50
    // rowsNumber: xx if getting data from a server
})
const rows = ref([])
const maxPages = ref(5)

const firms = ref([])
const models = ref([])
const searchActive = ref (false)
const query_string = ref('')

const filters = ref({
  model__firm_id:null,
  model_id:null,
  is_warranty:false,
  is_at_exchange:false,
  is_service_book_sign:false,
  q:null,
  date_in_work_gte:null,
  date_in_work_lte:null,
})

onBeforeMount(async ()=>{
  await getEquipment()
  await getFirm()

})

const getFirm = async () => {
  const resp = await api.get('/api/data/equipment_firm')
  firms.value = resp.data
}
const getModels = async () => {

  const resp = await api.get(`/api/data/equipment_model?firm=${filters.value.model__firm_id}`)
  models.value = resp.data
}

const getEquipment = async () => {
    is_loading.value = !is_loading.value
  const response = await api(`/api/data/equipment?page=${page.value}&${query_string.value}`)
  rows.value = response.data.results
    maxPages.value = Math.ceil(response.data.count / 50)
    is_loading.value = !is_loading.value
}
const setPage =  async () => {
    console.log(page.value)
    await getEquipment()
}
const filterAction = async (action) => {
  query_string.value = ``
  if (action==='apply'){
    for (let [k,v] of Object.entries(filters.value)){
      console.log(k,v)
      v ? query_string.value += `${k}=${v}&` : null
    }
  }
  if (action==='clear'){
    query_string.value = ''
    filters.value = {
      firm:false,
      model:false,
      is_warranty:false,
      is_service_book_sign:false,
      q:null,
      date_in_work_gte:null,
      date_in_work_lte:null,
    }
  }
  await getEquipment()

}
</script>
