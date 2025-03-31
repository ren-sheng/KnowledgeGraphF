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
              <!--              <div v-else>-->
              <!--                <pre>{{ streamingText }}</pre>-->
              <!--              </div>-->
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
const responseData = 'SUCCESS: Local Search Response:\n' +
    '### Analysis of ZHANG, YONG\'s Potential Aliases\n' +
    '\n' +
    'After reviewing the provided data, there is no evidence to suggest that **ZHANG, YONG** uses any aliases. The entity records consistently refer to this researcher under the same name across multiple affiliations and research contributions. Below is a detailed breakdown of the supporting evidence:\n' +
    '\n' +
    '#### Consistency in Name and Research Focus\n' +
    '- The name **ZHANG, YONG** appears uniformly across all records, with no variations or alternative spellings noted [Data: Entities (5395)].\n' +
    '- The researcher\'s work spans **computer vision, artificial intelligence, and image processing**, with affiliations at institutions such as the **University of Science and Technology of China (USTC)** and the **Chinese Academy of Sciences (ICT-CAS)** [Data: Entities (5395)].\n' +
    '- A single **Researcher ID (ADH-3314-2022)** and email (**zhyd73@ustc.edu.cn**) are provided, further confirming a unified academic identity [Data: Entities (5395)].\n' +
    '\n' +
    '#### Lack of Contradictory Indicators\n' +
    '- No conflicting ORCIDs, Researcher IDs, or email addresses are associated with this name in the dataset.\n' +
    '- The research focus and institutional ties are logically connected, with no abrupt shifts that might suggest multiple identities.\n' +
    '\n' +
    '### Conclusion\n' +
    'Based on the available data, **ZHANG, YONG** does not appear to have any aliases. The records present a coherent academic profile without discrepancies in naming or identity. If additional evidence emerges (e.g., alternate names or conflicting identifiers), this conclusion may need reevaluation.\n' +
    '\n' +
    'For reference, the analysis draws from the following data:\n' +
    '[Data: Entities (5395); Sources (1916, 381)].\n' +
    '\n' +
    '---\n' +
    '*Note: If you have additional context or records not included in the provided tables, please share them for further verification.*\n';
const streamingText = ref('');

const startQuery = () => {
  welcome.value = false;
  streamingText.value = '';
  loading.value = true;
  let index = 0;
  let shouldScroll = true;

  const outputInterval = 1 // 每个字符间隔时间（毫秒）

  const intervalId = setInterval(() => {
    if (index < responseData.length) {
      streamingText.value += responseData.slice(index, index + 1);
      index++;
      shouldScroll = true;
    } else {
      clearInterval(intervalId);
      loading.value = false;
    }
    // 自动滚动到底部
    const container = document.querySelector('.response-content');
    if (container && shouldScroll) {
      container.scrollTop = container.scrollHeight;
      shouldScroll = false;
    }
  }, outputInterval);

  // 使用requestAnimationFrame优化渲染性能
  requestAnimationFrame(intervalId);
};

// 将 Markdown 转换为 HTML
const renderedMarkdown = computed(() => {
  return marked(streamingText.value);
});
// //动态样式，当welcome为true时，response-content的子组件垂直居中
// const responseContentStyle = computed(() => {
//   if (welcome.value) {
//     return {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100%',
//     }
//   }
// });

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

.response-graph{
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
