<template>
  <!--给出两个选项，选择知识图谱则展示图谱组件，选择问答结果展示本界面写好的另一部分内容-->
  <div>
    <el-radio-group v-model="radio" @change="changeRadio">
      <el-radio label="graph">知识图谱</el-radio>
      <el-radio label="result">问答结果</el-radio>
    </el-radio-group>
    <div v-if="radio === 'graph'">
      <Graph/>
    </div>
    <div v-else-if="radio === 'result'">
      结果
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import Graph from '../components/Graph.vue';

const radio = ref('graph');

const changeRadio = (val) => {
  console.log(val);
};

</script>


<style scoped>

</style>
