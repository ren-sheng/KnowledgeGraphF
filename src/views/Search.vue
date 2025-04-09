<template>
  <div class="search">
    <!-- 搜索界面 -->
    <div v-if="!isSearched" class="search-interface">
      <!-- <div class="header">
        <div class="menu">
          <a href="https://scholar.google.com.hk/scholar?scilib=1&hl=zh-CN&as_sdt=0,5" style="color: #666;">
            ✎ 我的个人学术档案
          </a>
          <a href="https://scholar.google.com.hk/scholar?scilib=1&hl=zh-CN&as_sdt=0,5" style="color: #666;">
            ✦ 我的图书馆
          </a>
        </div>
      </div> -->
      <div class="search-container">
        <div class="logo">ESI知识图谱平台 学术搜索</div>
        <div class="search-bar">
          <input type="text" class="search-input" placeholder="" v-model="searchQuery"/>
          <button class="search-button" @click="search">搜索</button>
        </div>
        <div class="options">
          <label>
            <input type="radio" name="language" value="all" v-model="languageOption"/> 不限语言
          </label>
          <label>
            <input type="radio" name="language" value="chinese" v-model="languageOption"/> 中文网页
          </label>
          <label>
            <input type="radio" name="language" value="simplified" v-model="languageOption"/> 简体中文网页
          </label>
        </div>
      </div>
      <div class="footer">
        <div class="slogan">站在巨人的肩膀上</div>
      </div>
    </div>

    <!-- 搜索结果界面 -->
    <div v-else class="results-interface">
      <!-- 顶部搜索栏 -->
      <div class="top-search-bar">
        <div class="logo-small">ESI知识图谱平台</div>
        <div class="search-bar-small">
          <input type="text" class="search-input-small" v-model="searchQuery"/>
          <button class="search-button-small" @click="search">搜索</button>
        </div>
      </div>
      <!-- 结果数量显示 -->
     <div class="results-count">
       找到 {{ totalResults }} 条结果
    </div>
      <!-- 使用新的隔离组件 -->
      <div class="results-content">
        <IsolatedHtml :html="searchResults" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { searchPages } from '@/api/pages.js'
import IsolatedHtml from '@/components/IsolatedHtml.vue'

const searchQuery = ref('')
const languageOption = ref('all')
const searchResults = ref('')
const isSearched = ref(false)
const totalResults = ref(0)  // 添加结果数量的响应式变量

const search = async () => {
  console.log(`搜索: ${searchQuery.value}，语言选项: ${languageOption.value}`)
  try {
    let response = await searchPages(searchQuery.value)
    
    // 从返回的HTML中提取结果数量
    const countMatch = response.data.match(/<span id="result-count"[^>]*>(\d+)<\/span>/);
    if (countMatch) {
      totalResults.value = parseInt(countMatch[1]);
      console.log('找到结果数量:', totalResults.value);
    } else {
      console.log('未找到结果数量标记，HTML:', response.data.substring(0, 200));
      // 如果找不到标记，尝试计算li元素数量
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = response.data;
      const resultItems = tempDiv.querySelectorAll('li');
      totalResults.value = resultItems.length;
    }
    
    // 处理HTML中的链接和摘要
    let processedHtml = response.data
      // 处理专家链接
      .replace(/<a href="\/expert\/(\d+)"/g, '<a href="#" data-expert-id="$1"')
      // 处理摘要容器
      .replace(/<div class="abstract">/g, '<div class="abstract-container"><div class="abstract-content">');

    // 关闭摘要内容div
    processedHtml = processedHtml.replace(/<\/div>(?=\s*<\/li>)/g, '</div></div>');
    
    searchResults.value = processedHtml;
    isSearched.value = true;

    // 在下一个 tick 中添加事件监听器
    nextTick(() => {
      // 移除旧的事件监听器
      const oldLinks = document.querySelectorAll('a[data-expert-id]');
      oldLinks.forEach(link => {
        link.removeEventListener('click', handleExpertClick);
      });

      // 添加新的事件监听器
      const links = document.querySelectorAll('a[data-expert-id]');
      links.forEach(link => {
        link.addEventListener('click', handleExpertClick);
      });
    });
  } catch (error) {
    console.error('搜索出错:', error)
    searchResults.value = '<div class="error">搜索出错，请稍后重试</div>'
    totalResults.value = 0
  }
}

// 处理专家链接点击事件
const handleExpertClick = (event) => {
  event.preventDefault();
  const expertId = event.target.getAttribute('data-expert-id');
  if (expertId) {
    window.location.href = `/expert/${expertId}`;
  }
};
</script>

<style scoped>
.search {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  height: 87vh; /* 改用固定高度而不是最小高度 */
  background-color: #fff;
  overflow: hidden; /* 防止出现滚动条 */
}

.search-interface {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 15vh; /* 减小顶部间距 */
}

.search-container {
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.logo {
  font-size: 40px;
  color: #4285f4;
  margin-bottom: 40px;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  width: 600px;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #dfe1e5;
  border-right: none;
  border-radius: 24px 0 0 24px;
  outline: none;
  transition: box-shadow 0.3s;
}

.search-input:focus {
  box-shadow: 0 1px 6px rgba(32,33,36,0.28);
}

.search-button {
  padding: 0 24px;
  font-size: 16px;
  background-color: #4285f4;
  color: white;
  border: 1px solid #4285f4;
  border-radius: 0 24px 24px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #3367d6;
}

.options {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 24px;
}

.options label {
  color: #666;
  cursor: pointer;
}

/* 调整页脚位置 */
.footer {
  margin-top: auto;
  padding-bottom: 45vh; /* 减小底部间距 */
  text-align: center;
  color: #4285f4;
  font-size: 18px;
}

/* 搜索结果界面样式 */
.results-interface {
  height: 100vh; /* 改用固定高度 */
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden; /* 防止整体出现滚动条 */
}

.top-search-bar {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background-color: white;
  border-bottom: 1px solid #dfe1e5;
}

.logo-small {
  font-size: 20px;
  color: #4285f4;
  margin-right: 40px;
  white-space: nowrap;
}

.search-bar-small {
  display: flex;
  flex: 1;
  max-width: 600px;
}

.search-input-small {
  flex: 1;
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid #dfe1e5;
  border-right: none;
  border-radius: 24px 0 0 24px;
  outline: none;
}

.search-button-small {
  padding: 0 20px;
  font-size: 14px;
  background-color: #4285f4;
  color: white;
  border: 1px solid #4285f4;
  border-radius: 0 24px 24px 0;
  cursor: pointer;
}

.results-count {
  padding: 12px 24px;
  color: #70757a;
  font-size: 14px;
  border-bottom: 1px solid #dfe1e5;
}

.results-content {
  flex: 1;
  padding: 20px 0; /* 移除左右内边距，只保留上下内边距 */
  overflow-y: auto;
  background-color: #fff;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.results-content :deep(.search-results) {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 150px; /* 使用更大的左右边距来控制内容宽度 */
}

.results-content :deep(.search-results li) {
  width: 100%;
  margin-bottom: 25px; /* 增加结果之间的间距 */
  padding: 0; /* 移除内边距 */
  border: none;
  border-radius: 0;
  background-color: transparent;
  box-shadow: none;
}

.results-content :deep(.search-results li:hover) {
  box-shadow: none;
}

.results-content :deep(.search-results h3) {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #1a0dab;
}

.results-content :deep(.search-results .abstract) {
  margin-top: 10px;
  color: #4d5156;
  font-size: 14px;
  line-height: 1.5;
}

.results-content :deep(.search-results .abstract-container) {
  margin-top: 10px;
}

.results-content :deep(.search-results .abstract-content) {
  display: none;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-top: 5px;
}

.results-content :deep(.search-results .abstract-container.expanded .abstract-content) {
  display: block;
}

.results-content :deep(.search-results .abstract-toggle) {
  color: #1a73e8;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.results-content :deep(.search-results .abstract-toggle:hover) {
  text-decoration: underline;
}

.results-content :deep(.search-results .authors) {
  color: #006621;
  font-size: 14px;
  margin: 5px 0;
}

.results-content :deep(.search-results .source) {
  color: #006621;
  font-size: 14px;
  margin: 5px 0;
}

.results-content :deep(.search-results .year) {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.results-content :deep(.search-results .citations) {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

/* 隐藏滚动条但保持功能 */
.results-content {
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}

.results-content::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}
</style>