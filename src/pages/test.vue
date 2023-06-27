<template>

</template>
<!--<template>-->
<!--    <q-page padding>-->
<!--      <p><span class="text-bold">Номер заявки :</span>  {{order.number}}</p>-->
<!--      <p><span class="text-bold">Статус заявки :</span> {{order.status?.name}}</p>-->
<!--      <p><span class="text-bold">Этап заявки :</span> {{order.stage?.name}}</p>-->
<!--      <p><span class="text-bold">Коментарий к этапу :</span> {{order.stage?.comment}}</p>-->
<!--      <p><span class="text-bold">Описание  :</span> {{order.comment}}</p>-->

<!--      <hr>-->
<!--      <div class="q-mb-lg">-->
<!--        <q-btn v-if="order.stage?.check_list" color="primary" no-caps unelevated label="Заполнить чеклист" @click="showCheckList = !showCheckList"/>-->
<!--      </div>-->



<!--      <div class="q-gutter-md">-->
<!--        <q-btn v-if="order.stage?.btn_1_goto_stage" no-caps unelevated color="primary" outline :label="order.stage?.btn_1_label" @click="changeStage(order.stage?.btn_1_goto_stage)"/>-->
<!--        <q-btn v-if="order.stage?.btn_2_goto_stage" no-caps unelevated color="primary" outline :label="order.stage?.btn_2_label" @click="changeStage(order.stage?.btn_2_goto_stage)"/>-->

<!--      </div>-->
<!--    </q-page>-->
<!--  <q-dialog v-model="showCheckList">-->
<!--    <q-card>-->
<!--      <q-card-section>-->
<!--        <div class="text-h6">Чеклист</div>-->
<!--      </q-card-section>-->

<!--      <q-separator />-->

<!--      <q-card-section style="max-height: 50vh" class="scroll">-->

<!--          <div v-for="(input,index) in checkList" :key="index">-->
<!--            <q-checkbox v-if="input.is_boolean" dense class="q-mb-md" v-model="checkList[index].value" :label="checkList[index].label"/>-->
<!--            <q-input v-if="input.is_input" dense outlined class="q-mb-md" v-model="checkList[index].value" :label="checkList[index].label"/>-->
<!--            <q-input v-if="input.is_date" dense outlined class="q-mb-md" v-model="checkList[index].value" :label="checkList[index].label" mask="date" :rules="['date']">-->
<!--              <template v-slot:append>-->
<!--                <q-icon name="event" class="cursor-pointer">-->
<!--                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">-->
<!--                    <q-date v-model="checkList[index].value">-->
<!--                      <div class="row items-center justify-end">-->
<!--                        <q-btn v-close-popup label="Close" color="primary" flat />-->
<!--                      </div>-->
<!--                    </q-date>-->
<!--                  </q-popup-proxy>-->
<!--                </q-icon>-->
<!--              </template>-->
<!--            </q-input>-->

<!--          </div>-->

<!--     </q-card-section>-->

<!--      <q-separator />-->

<!--      <q-card-actions align="center">-->
<!--        <q-btn outline label="Сохранить" @click="saveData(order.id,order.stage?.check_list.id)" no-caps color="positive" />-->
<!--        <q-btn outline label="Отмена" no-caps color="negative" v-close-popup />-->
<!--        <p class="text-caption text-grey-9 text-center">В случае ошибки вы сможете заполнить чек лист заного или это сделает администратор системы</p>-->
<!--      </q-card-actions>-->
<!--    </q-card>-->
<!--  </q-dialog>-->

<!--&lt;!&ndash;  <pre>&ndash;&gt;-->
<!--&lt;!&ndash;     {{checkList}}&ndash;&gt;-->
<!--&lt;!&ndash;  </pre>&ndash;&gt;-->
<!--</template>-->
<!--<script setup>-->
<!--import {onBeforeMount, ref} from "vue";-->
<!--import {api} from "boot/axios";-->
<!--import {useNotify} from "src/helpers/notify"-->
<!--const order = ref({})-->
<!--const showCheckList = ref(false)-->

<!--const notify = useNotify-->

<!--const checkList = ref([])-->
<!--onBeforeMount(async ()=>{-->
<!--  await getOrder()-->

<!--})-->
<!--const getOrder = async () => {-->
<!--  const response = await api(`/api/data/order/123`)-->
<!--  order.value = response.data-->
<!--  if (order.value.stage.check_list){-->
<!--    order.value.stage.check_list.inputs.forEach((el)=>{-->
<!--      console.log(el)-->
<!--      checkList.value.push(-->
<!--        {-->
<!--          label:el.label,-->
<!--          value:null,-->
<!--          is_boolean:el.input.is_boolean,-->
<!--          is_input:el.input.is_input,-->
<!--          is_date:el.input.is_date,-->
<!--        }-->
<!--      )-->
<!--    })-->
<!--  }-->
<!--}-->
<!--const changeStage = async (stage_id) => {-->
<!--  checkList.value = []-->
<!--  const response = await api.patch(`/api/data/order/123`,{stage_id})-->
<!--  await getOrder()-->
<!--}-->
<!--const saveData = async (order_id,check_list_id) => {-->
<!--  const response = await api.post(`/api/data/save_check_list_data`,{order_id,check_list_id,data:checkList.value})-->
<!--  showCheckList.value = false-->
<!--  notify('positive','Чеклист сохранен')-->
<!--}-->
<!--</script>-->
