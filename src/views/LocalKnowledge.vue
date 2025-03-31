<template>
  <div>
    <el-container>
      <el-header><!-- 搜索栏 -->
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
            >查询
            </el-button>
          </div>
        </div>
      </el-header>

      <el-main style="height: 75vh">
        <!-- 结果展示区域 -->
        <div class="result-container">
          <!-- 流式文本结果卡片 -->
          <el-card class="text-result-card"
                   :body-style="{height: '82%'}">
            <template #header>
              <div class="card-header">
                <span>查询结果</span>
              </div>
            </template>
            <div class="response-content">
              <pre>{{ streamingText }}</pre>
            </div>
          </el-card>

          <!-- 知识图谱卡片 -->
          <el-card class="graph-result-card"
                   :body-style="{height: '82%'}">
            <template #header>
              <div class="card-header">
                <span>知识图谱</span>
              </div>
            </template>
            <div class="response-graph">
              <!--              <div style="display: flex; align-items: center; justify-content: center;">-->
              <relation-graph-vue3
                  :options="graphOptions"
                  :nodes="graphData.nodes"
                  :links="graphData.links"
                  class="graph-content"/>
              <!--              </div>-->
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import RelationGraphVue3 from 'relation-graph-vue3';

const query = ref('');
const loading = ref(false);
const responseData = '这是一段模拟的查询结果，用于展示流式输出的效果。我们将逐步输出这段文本，模拟后端流式传输的过程。';
const streamingText = ref('');

const startQuery = () => {
  streamingText.value = '';
  loading.value = true;
  let index = 0;

  const streamChunk = () => {
    if (index < responseData.length) {
      // 改为逐个字符追加（可根据需要调整每次追加的字符数）
      streamingText.value += responseData.slice(index, index + 1);
      index++;

      // 自动滚动到底部
      const container = document.querySelector('.response-content');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }

      requestAnimationFrame(streamChunk);
    } else {
      loading.value = false;
    }
  };

  // 使用requestAnimationFrame优化渲染性能
  requestAnimationFrame(streamChunk);
};

// 知识图谱相关
const showGraph = ref(true);
const graphData = ref({
  nodes: [
    {id: 1, text: '中心节点'},
    {id: 2, text: '子节点1'},
    {id: 3, text: '子节点2'},
    {id: 4, text: '子节点3'}
  ],
  links: [
    {from: 1, to: 2},
    {from: 1, to: 3},
    {from: 1, to: 4}
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

const toggleGraph = () => {
  showGraph.value = !showGraph.value;
};
</script>

<style scoped>
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

.result-container {
  /*内部组件左右布局*/
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
}

.text-result-card,
.graph-result-card {
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.08); /* 减弱阴影效果 */
  width: 50%;
  height: 65vh;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.response-graph,
.response-content {
  line-height: 1.8;
  height: 100%;
}

.graph-content {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
}

.response-content pre {
  white-space: pre-wrap; /* 保留换行同时自动换行 */
  word-wrap: break-word; /* 允许长单词换行 */
  margin: 0;
  font-family: inherit;
  font-size: 14px;
  color: #606266;
}

/*@media (max-width: 768px) {
  .graph-content {
    height: 400px;
  }
}*/
</style>
