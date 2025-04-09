<template>
  <div>
    <el-container>
      <el-header><!-- 搜索栏 -->
        <div class="search-container">
          <div class="search-bar">
            <el-select v-model="selectedSearchMethod" placeholder="选择搜索方法" class="search-select">
              <el-option label="基本搜索" value="basic_search_streaming"></el-option>
              <el-option label="漂移搜索" value="drift_search_streaming"></el-option>
              <el-option label="本地搜索" value="local_search_streaming"></el-option>
              <el-option label="全局搜索" value="global_search_streaming"></el-option>
            </el-select>
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
                   :body-style="{height: '83%'}"
                   :header="{height:'20%'}">
            <template #header>
              <div class="card-header">
                <span>查询结果</span>
              </div>
            </template>
            <div class="response-content">
              <div v-if="welcome" class="welcome-message">
                <h2>欢迎使用知识图谱查询系统</h2>
                <p>请输入查询内容，点击查询按钮获取本地知识库推理结果。</p>
                <small>本地知识库使用GraphRAG和deepseek建立</small>
              </div>
              <div v-else v-html="renderedMarkdown"></div>
            </div>
          </el-card>

          <!-- 知识图谱卡片 -->
          <el-card class="graph-result-card"
                   :body-style="{height: '83%'}"
                   :header="{height:'20%'}">
            <template #header>
              <div class="card-header">
                <span>知识图谱</span>
              </div>
            </template>
            <div class="response-graph">
              <relation-graph ref="graphRef$" :options="options"/>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import RelationGraph from 'relation-graph-vue3';
import {marked} from 'marked';

const welcome = ref(true);
const query = ref('');
const loading = ref(false);
const streamingText = ref('');
const selectedSearchMethod = ref('local_search_streaming'); // 默认选择本地搜索

const startQuery = async () => {
  welcome.value = false;
  streamingText.value = '';
  loading.value = true;

  try {
    if (!query.value) {
      alert('请输入查询内容');
      loading.value = false;
      return;
    }
    //消息体
    const message = {
      community_level: 2,
      dynamic_community_selection: false,
      response_type: 'Multiple Paragraphs',
      query: query.value,
      callbacks: null
    };
    // 根据选择的搜索方法进行查询
    let searchMethod = selectedSearchMethod.value;
    if (searchMethod === 'basic_search_streaming') {
      searchMethod = 'http://localhost:8000/basic_search_streaming';
    } else if (searchMethod === 'drift_search_streaming') {
      searchMethod = 'http://localhost:8000/drift_search_streaming';
    } else if (searchMethod === 'global_search_streaming') {
      searchMethod = 'http://localhost:8000/global_search_streaming';
      message.community_level = 0;
      message.dynamic_community_selection = true;
    } else {
      searchMethod = 'http://localhost:8000/local_search_streaming';
    }
    const response = await fetch(searchMethod, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let shouldScroll = true;

    while (true) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, {stream: true});
      streamingText.value += chunk;

      // 自动滚动到底部
      const container = document.querySelector('.response-content');
      if (container && shouldScroll) {
        container.scrollTop = container.scrollHeight;
        shouldScroll = false;
      }
    }
  } catch (error) {
    console.error('查询过程中出现错误:', error);
    streamingText.value = `查询过程中出现错误: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

// 将 Markdown 转换为 HTML
const renderedMarkdown = computed(() => {
  return marked(streamingText.value);
});

// 知识图谱相关
const graphRef$ = ref();
const options = {
  defaultExpandHolderPosition: 'right',
  allowSwitchLineShape: true,
  allowSwitchJunctionPoint: true,
}
onMounted(() => {
  const jsonData = {
    rootId: 'a',
    nodes: [
      {id: 'a', text: 'a',},
      {id: 'b', text: 'b',},
      {id: 'c', text: 'c',},
      {id: 'd', text: 'd',},
      {id: 'e', text: 'e',},
      {id: 'f', text: 'f',},
    ],
    lines: [
      {from: 'a', to: 'b',},
      {from: 'a', to: 'c',},
      {from: 'a', to: 'd',},
      {from: 'a', to: 'e',},
      {from: 'a', to: 'f',},
    ],
  }
  graphRef$.value.setJsonData(jsonData)
})
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

  .search-select {
    width: 130px;
  }
}

.search-input {
  flex: 1;
}

.welcome-message {
  padding-top: 20%;
  text-align: center;
  font-size: 18px;
  color: #333;
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
  height: 70vh;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.response-graph {
  line-height: 1.8;
  height: 100%;
}

.response-content {
  line-height: 1.8;
  height: 100%;
  overflow: auto;
}

.response-content pre {
  white-space: pre-wrap; /* 保留换行同时自动换行 */
  word-wrap: break-word; /* 允许长单词换行 */
  font-family: inherit;
  font-size: 14px;
  color: #606266;
}

</style>
