<!--
 * @Author: 王欣磊
 * @Date: 2023-09-01 14:56:47
 * @LastEditors: 王欣磊
 * @LastEditTime: 2023-09-16 19:14:28
 * @Description: 
 * @FilePath: /qrTool/src/App.vue
-->
<template>
  <div class="container-app" flex-column align-center>
    <context-holder />
    <div flex-row flex-center class="header">
      <a-switch m-r-10 v-model:checked="chunkFast" checked-children="高并发" un-checked-children="低并发" />
      <a-button type="primary" @click="runAll" :loading="loadingRunAll">
        <template #icon>
          <CaretRightOutlined />
        </template>
        执行
      </a-button>
    </div>
    <table m-t-10 cellspacing="0">
      <thead>
        <tr>
          <th>序号</th>
          <th>地点</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(i, index) in qrDataObj" :key="i.name">
          <td>{{ index + 1 }}</td>
          <td>{{ i.name }}</td>
          <td>
            <template v-if="i.status === 'blank'">
              <MinusCircleTwoTone two-tone-color="#d5d5d5" />
            </template>
            <template v-else-if="i.status === 'loading'">
              <LoadingOutlined />
            </template>
            <template v-else-if="i.status === 'success'">
              <CheckCircleTwoTone two-tone-color="#52c41a" />
            </template>
            <template v-else-if="i.status === 'error'">
              <CloseCircleTwoTone two-tone-color="#eb2f96" />
            </template>
          </td>
          <td>
            <a-button size="small" type="primary" @click="i.task" :disabled="loadingRunAll">执行</a-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import qrData from '@/assets/data/qrData.json'
import '@/assets/styles/common.scss'
import { CaretRightOutlined, MinusCircleTwoTone, LoadingOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons-vue';
import axios from 'axios'
import { notification } from 'ant-design-vue';
const REQUEST_URL = 'https://wxlde-cros.oregano-07cores.workers.dev/?https://njyj-social.njyjgl.cn/spp_grid_social/answerQuestionController/saveAnswers'
const [api, contextHolder] = notification.useNotification();
const loadingRunAll = ref(false)
const chunkFast = ref(false)
const qrDataObj = reactive(qrData.map((_,index) => {
  _.status = 'blank'
  _.task = () => {
    return new Promise(async (resolve, reject) => {
      qrDataObj[index].status = 'loading'
      try {
        await axios(REQUEST_URL, {
          timeout: 30000,
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          data: {
            "answer": {
              "answer_a": "0",
              "file_a": [],
              "answer_b": "0",
              "file_b": [],
              "answer_c": "0",
              "file_c": [],
              "answer_d": "1",
              "file_d": [],
              "answer_e": "1",
              "file_e": [],
              "answer_f": "1",
              "file_f": []
            },
            "phone": "18105166078",
            "placeId": _.value
          }
        })
        // success
        qrDataObj[index].status = 'success'
        resolve()
      } catch (error) {
        // error
        qrDataObj[index].status = 'error'
        console.error(error)
        reject(error)
      }
    })
  }
  _.testTask = ()=>{
    return new Promise((resolve,reject)=>{
      qrDataObj[index].status = 'loading'
      setTimeout(() => {
        qrDataObj[index].status = 'success'
        resolve()
      }, Math.random()*2000);
    })
  }

  return _
}))

function concurrentRequest(promises,concurrentCount){
  let index = 0;
  let doneCount = 0
  const res = []
  if(promises.length === 0 ){
    return []
  }
  return new Promise((resolve,reject)=>{
    async function next() {
    const currentIndex = index
    const promise = promises[currentIndex]
    index++
    try {
      const r = await promise()
      res[currentIndex] = r
    } catch (error) {
      res[currentIndex] = error
    }finally{
      doneCount++
      if(doneCount >= promises.length){
        resolve(res)
      }
      if(index < promises.length){
        next()
      }else{
        return
      }
    }
  }

    for(let i=0;i<Math.min(concurrentCount,promises.length);i++){
      next()
    }
  })
}
async function runAll() {
  loadingRunAll.value = true
  const chunks = chunkFast.value ? 10 : 5
  await concurrentRequest(qrDataObj.map(_ => _.task), chunks)

  loadingRunAll.value = false
  const successCount = qrDataObj.filter(_ => _.status === 'success').length
  const errorCount = qrDataObj.filter(_ => _.status === 'error').length
  api.success({
    message: '执行成功',
    description: `成功${successCount}个，失败${errorCount}个`
  })
}


</script>
<style scoped lang="scss">
.container-app {
  width: 100%;
  height: 100%;
  padding-bottom: 20px;
  box-sizing: border-box;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
}

table {
  width: 80vw;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  border-right: 0;
  border-bottom: 0;

  td,
  th {
    border: 1px solid #d5d5d5;
    border-left: 0;
    border-top: 0;
    padding: 10px;
  }

  td {
    text-align: center;
  }
}

.header {
  background-color: #f3f3f3;
  padding: 10px;
  width: 100%;
  position: sticky;
  top: 0;
  // bottom shadow
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .1);
  z-index: 2;
}
</style>