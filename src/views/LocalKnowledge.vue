<template>
  <div class="container">
    <!-- 搜索栏 -->
    <div class="search-container">
      <div class="search-bar">
        <el-input
            v-model="query"
            placeholder="输入查询内容"
            class="search-input"
            @keyup.enter="startQuery"
        ></el-input>
        <el-button
            @click="startQuery"
            type="primary"
            class="search-button"
            :loading="loading"
        >查询</el-button>
      </div>
    </div>

    <!-- 结果展示区域 -->
    <div class="result-container">
      <!-- 流式文本结果卡片 -->
      <el-card class="text-result-card">
        <template #header>
          <div class="card-header">
            <span>查询结果</span>
          </div>
        </template>
        <div class="response-content">
          <p v-for="(chunk, index) in responseChunks" :key="index">{{ chunk }}</p>
        </div>
      </el-card>

      <!-- 知识图谱卡片 -->
      <el-card v-if="showGraph" class="graph-result-card">
        <template #header>
          <div class="card-header">
            <span>知识图谱</span>
            <el-button @click="toggleGraph" type="text">切换视图</el-button>
          </div>
        </template>
        <relation-graph-vue3
            :options="graphOptions"
            :nodes="graphData.nodes"
            :links="graphData.links"
            class="graph-content"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RelationGraphVue3 from 'relation-graph-vue3';

// 流式数据相关
const query = ref('');
const responseChunks = ref([]);
const loading = ref(false);
const responseData = '这是一段模拟的查询结果，用于展示流式输出的效果。我们将逐步输出这段文本，模拟后端流式传输的过程。';

// 知识图谱相关
const showGraph = ref(true);
const graphData = ref({
  nodes: [
    { id: 1, text: '中心节点' },
    { id: 2, text: '子节点1' },
    { id: 3, text: '子节点2' },
    { id: 4, text: '子节点3' }
  ],
  links: [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 }
  ]
});

const graphOptions = {
  defaultNodeShape: 1,
  defaultLineShape: 1,
  layouts: [
    {
      label: '自动布局',
      layoutName: 'force',
      layoutClassName: 'seeks-layout-center'
    }
  ]
};

const startQuery = () => {
  responseChunks.value = [];
  loading.value = true;
  let index = 0;
  const intervalId = setInterval(() => {
    if (index < responseData.length) {
      const chunk = responseData.slice(index, index + 10);
      responseChunks.value.push(chunk);
      index += 10;
    } else {
      clearInterval(intervalId);
      loading.value = false;
    }
  }, 200);
};

const toggleGraph = () => {
  showGraph.value = !showGraph.value;
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  padding: 15px;
}

.search-bar {
  display: flex;
  gap: 10px;
  max-width: 800px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
}

.result-container{
  /*内部组件左右布局*/
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.text-result-card,
.graph-result-card {
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.08); /* 减弱阴影效果 */
  width: 50%;
  margin-bottom: 20px;
  height: auto;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.response-content {
  line-height: 1.8;
  min-height: 200px;
  padding: 20px;
}

.graph-content {
  width: 100%;
  height: 600px;
  background: #fff;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .graph-content {
    height: 400px;
  }
}
</style>
