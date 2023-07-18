<template>
  <div v-if="item">

    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад"  icon="arrow_back" class="q-py-md" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">{{item?.check_list.name}}, заявка {{item?.order_number}} </p>
        <q-btn :label="check_list_editable ? 'Отменить редактирование' : 'Редактировать'"
               :loading="is_loading"
               class="q-py-md" @click="check_list_editable=!check_list_editable"
               :icon="check_list_editable ? 'close' : 'edit'"
               :color="check_list_editable ? 'red' : 'primary'"
               unelevated no-caps/>
      </div>
    </div>
    <div class="rounded-box">
      <div v-for="(check_list_input,index) in item.data" :key="index" >
        <q-checkbox :disable="!check_list_editable" v-if="check_list_input.is_boolean" dense
                    class="q-mb-md"
                    v-model="item.data[index].value"
                    :label="item.data[index].label"/>
        <q-input :disable="!check_list_editable" v-if="check_list_input.is_input" dense outlined class="q-mb-md"
                 v-model="item.data[index].value"
                 :label="item.data[index].label"/>
        <div class="q-mb-md" v-if="check_list_input.is_multiple_boolean">
          <p>{{item.data[index].label}}</p>
          <q-checkbox :disable="!check_list_editable"  dense class="q-mb-md"
                      v-for="(label,label_index) in item.data[index].labels.split('/')"
                      v-model="item.data[index].values[label_index]"
                      :label="label"/>
        </div>
        <div class="bg-grey-3 q-mb-md" v-if="check_list_input.is_multiple_boolean_with_input">
          <p class="q-mb-xs">{{item.data[index].label}}</p>
          <div class="flex items-center justify-between">
            <q-checkbox  dense
                         :disable="!check_list_editable"
                         v-for="(label,label_index) in item.data[index].labels.split('/').slice(0,-1)"
                         v-model="item.data[index].values[label_index]"
                         :label="label"/>
            <q-input dense outlined :disable="!check_list_editable" v-model="item.data[index].value" :label="item.data[index].labels.split('/').slice(-1)[0]"/>
          </div>

        </div>

      </div>
      <q-btn
             @click="saveData"
             :loading="is_loading"
             v-if="check_list_editable"
             no-caps
             unelevated
             color="primary"
             label="Сохранить изменения"/>
    </div>
  </div>
  <div v-else class="full-height ">
    <q-inner-loading showing>
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import {useRoute} from "vue-router";
import {useNotify} from "src/helpers/notify";
const route = useRoute()
const item = ref(null)
const is_loading = ref(false)
const check_list_editable = ref(false)
const notify = useNotify
onBeforeMount(async ()=>{
  await getItem()
})

const getItem = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/order_checklist?id=${route.params.id}`)
  item.value = response.data
  console.log(item.value)
  is_loading.value = !is_loading.value
}

const saveData = async (check_list_index,check_list_id) => {
  is_loading.value = !is_loading.value
  const response = await api.post(`/api/data/save_check_list_data`,{
    order_id:item.value.order,
    check_list_id:item.value.check_list.id,
    data:item.value.data})
  check_list_editable.value = false
  await getItem()
  notify('positive','Чеклист сохранен')
  is_loading.value = !is_loading.value

}

</script>
