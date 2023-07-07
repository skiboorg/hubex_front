import { defineStore } from 'pinia';
import {useNotify} from "src/helpers/utils";
import {computed} from "vue";





export const useWSStore = defineStore('ws', () => {

    let socket = null
    // if(process.env.CLIENT){
    //   const sound = new Audio('notify.mp3')
    // }

    async function connectWS (uuid) {
        //if (person.value){}
      console.log('ws connecting',uuid)
      console.log(process.env.WS)

        socket = new WebSocket(process.env.WS+'/ws/user/online')
        socket.onopen = () => {
          console.log('ws connected',uuid)

          socket.send(JSON.stringify({'uuid':uuid}))
          socket.onmessage = async (res) =>{
            console.log('message',JSON.parse(res.data))
            let data = JSON.parse(res.data)
            if (data.event==='update_user_notifications'){
              await sound.play()
            }
            if (data.event==='update_trade'){
              console.log('update_trade')

            }
          }
        }
        return Promise.resolve('Success')
    }
    return{
      connectWS
    }
  }


)
