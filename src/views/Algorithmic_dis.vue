<template>
  <div>
    <div style="border: #efefef solid 1px; height: calc(100vh - 100px);width: 100%;">
      <relation-graph ref="graphRef$" :options="options"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import RelationGraph from 'relation-graph-vue3'
import data from '../resource/graph_data.json'

const graphRef$ = ref<RelationGraph>()
const options = {
  "backgroundImageNoRepeat": true,
  "moveToCenterWhenRefresh": false,
  "layouts": [
    {
      "label": "中心",
      "layoutName": "center",
      "centerOffset_x": 0,
      "centerOffset_y": 0,
      "distance_coefficient": 1
    }
  ]
}
onMounted(() => {
  //导入json文件数据,路径为src/assets/data/algorithmic_dis.json
  console.log(data)
  console.log(data)
  graphRef$.value.setJsonData(data)
})
</script>
