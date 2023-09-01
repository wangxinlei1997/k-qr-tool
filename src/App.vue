<!--
 * @Author: 王欣磊
 * @Date: 2023-09-01 14:56:47
 * @LastEditors: 王欣磊
 * @LastEditTime: 2023-09-01 17:35:37
 * @Description: 
 * @FilePath: /qrTool/src/App.vue
-->
<template>
  <div class="container-app" flex-column align-center>
    <context-holder />
    <div flex-row flex-center class="header">
      <a-button type="primary">
        <template #icon>
          <CaretRightOutlined />
        </template>
        执行
      </a-button>
    </div>
    <table m-t-10 cellspacing="0">
      <thead>
        <tr>
          <th>地点</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in qrDataObj" :key="i.name">
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
            <a-button size="small" type="primary">重试</a-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import qrData from '@/assets/data/qrData.json'
import '@/assets/styles/common.scss'
import { CaretRightOutlined, MinusCircleTwoTone, LoadingOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons-vue';
import axios from 'axios'
const qrDataObj = reactive(qrData.slice(0, 2).map(_ => {
  _.status = 'blank'
  _.task = axios({
    // https://njyj-social.njyjgl.cn
    url: 'https://njyj-social.njyjgl.cn/spp_grid_social/answerQuestionController/saveAnswers'.replace('https://njyj-social.njyjgl.cn', 'https://xiaob.work'),
    method: 'POST',
    contentType: 'application/json;charset=utf-8',
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
  return _
}))



</script>
<style scoped lang="scss">
.container-app {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  overflow-y: auto;
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

  td:nth-child(n+2) {
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
}
</style>