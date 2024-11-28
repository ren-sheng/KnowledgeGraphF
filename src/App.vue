<script setup>

</script>

<template>
  <div>
    <router-view />
  </div>
</template>

<style scoped>

</style>

<!-- test -->
<!--<script setup>-->
<!--// 从Vue中解构出需要的函数和方法-->
<!--import {onMounted, ref} from 'vue';-->
<!--import RelationGraph from 'relation-graph-vue3';-->

<!--// 定义graphRef，这里不再有类型约束，直接初始化为null-->
<!--const graphRef = ref(null);-->

<!--// 定义graphOptions，同样不再有类型约束-->
<!--const graphOptions = {-->
<!--  debug: false,-->
<!--  defaultNodeBorderWidth: 0,-->
<!--  allowSwitchLineShape: true,-->
<!--  allowSwitchJunctionPoint: true,-->
<!--  defaultLineShape: 1,-->
<!--  layout: {-->
<!--    layoutName: 'force'-->
<!--  },-->
<!--  defaultJunctionPoint: 'border'-->
<!--};-->

<!--// 挂载后执行的函数-->
<!--onMounted(() => {-->
<!--  showGraph();-->
<!--});-->

<!--// 展示图形的函数-->
<!--const showGraph = async () => {-->
<!--  const __graph_json_data = {-->
<!--    rootId: 'a',-->
<!--    nodes: [-->
<!--      { id: 'a', text: 'root' },-->
<!--      { id: 'b', text: 'b' },-->
<!--      { id: 'b1', text: 'b1' },-->
<!--      { id: 'b1-1', text: 'b1-1' },-->
<!--      { id: 'b1-2', text: 'b1-2' },-->
<!--      { id: 'b1-3', text: 'b1-3' },-->
<!--      { id: 'b1-4', text: 'b1-4' },-->
<!--      { id: 'b1-5', text: 'b1-5' },-->
<!--      { id: 'b1-6', text: 'b1-6' },-->
<!--      { id: 'b2', text: 'b2' },-->
<!--      { id: 'b2-1', text: 'b2-1' },-->
<!--      { id: 'b2-2', text: 'b2-2' },-->
<!--      { id: 'b2-3', text: 'b2-3' },-->
<!--      { id: 'b2-4', text: 'b2-4' }-->
<!--    ],-->
<!--    lines: [-->
<!--      { from: 'a', to: 'b' },-->
<!--      { from: 'b', to: 'b1' },-->
<!--      { from: 'b1', to: 'b1-1' },-->
<!--      { from: 'b1', to: 'b1-2' },-->
<!--      { from: 'b1', to: 'b1-3' },-->
<!--      { from: 'b1', to: 'b1-4' },-->
<!--      { from: 'b1', to: 'b1-5' },-->
<!--      { from: 'b1', to: 'b1-6' },-->
<!--      { from: 'b', to: 'b2' },-->
<!--      { from: 'b2', to: 'b2-1' },-->
<!--      { from: 'b2', to: 'b2-2' },-->
<!--      { from: 'b2', to: 'b2-3' },-->
<!--      { from: 'b2', to: 'b2-4' }-->
<!--    ]-->
<!--  };-->

<!--  const graphInstance = graphRef.value.getInstance();-->
<!--  if (graphInstance) {-->
<!--    await graphInstance.setJsonData(__graph_json_data);-->
<!--    await graphInstance.moveToCenter();-->
<!--    // await graphInstance.zoomToFit();-->
<!--    await graphInstance.setZoom(30);-->
<!--  }-->
<!--};-->

<!--// 节点点击事件处理函数-->
<!--const onNodeClick = (nodeObject, $event) => {-->
<!--  console.log('onNodeClick:', nodeObject);-->
<!--};-->

<!--// 连线点击事件处理函数-->
<!--const onLineClick = (lineObject, linkObject, $event) => {-->
<!--  console.log('onLineClick:', lineObject);-->
<!--};-->
<!--</script>-->

