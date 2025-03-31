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
import { ref } from 'vue'
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
    
    // 处理HTML
    const processedHtml = response.data.replace(
      /<a href="\/expert\/(\d+)"/g,
      '<a href="/expert/$1"'
    )
    searchResults.value = processedHtml
    isSearched.value = true
  } catch (error) {
    console.error('搜索出错:', error)
    searchResults.value = '<div class="error">搜索出错，请稍后重试</div>'
    totalResults.value = 0
  }
}
</script>

<style scoped>
.search {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0; /* 移除上边距 */
}

.header {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 20px 0 0 20px; /* 增加左侧padding */
  box-sizing: border-box;
  position: absolute; /* 使用绝对定位 */
  left: 0; /* 靠左对齐 */
  top: 0;
}

.menu {
  display: flex;
  flex-direction: column; /* 改为垂直排列 */
  gap: 20px; /* 调整间距 */
  margin-right: 0;
  font-size: 16px;
}

.menu a {
  text-decoration: none;
  transition: color 0.3s;
}

.menu a:hover {
  color: #4285f4 !important;
}

.login {
  cursor: pointer;
  margin-left: auto; /* 将登录按钮推到右边 */
}

.search-container {
  margin: 100px auto 0; /* 修改上边距，使用auto实现水平居中 */
}

.logo {
  font-size: 40px;
  color: #4285f4;
  margin-bottom: 20px;
  text-align: center; /* 添加文字居中 */
  width: 100%; /* 确保占满容器宽度 */
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-input {
  width: 600px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-right: none; /* Remove border from the right side */
  border-radius: 5px 0 0 5px; /* Round the left side */
}

.search-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4285f4;
  color: white;
  border: 1px solid #4285f4;
  border-left: none; /* Remove border from the left side */
  border-radius: 0 5px 5px 0; /* Round the right side */
  cursor: pointer;
}

.options {
  margin-bottom: 20px;
  text-align: center; /* 添加文字居中 */
  width: 100%; /* 确保占满容器宽度 */
  display: flex;
  justify-content: center; /* 水平居中 */
  gap: 20px; /* 选项之间的间距 */
}

.footer {
  margin-top: auto;
  width: 100%;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
}

.slogan {
  color: #4285f4;
  font-size: 18px;
}

.search-results {
  width: 800px;
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.search-results) {
  font-family: Arial, sans-serif;
}

:deep(.error) {
  color: red;
  text-align: center;
  padding: 20px;
}

.results-interface {
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-search-bar {
  position: static;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  flex-shrink: 0;
}

.logo-small {
  font-size: 20px;
  color: #4285f4;
  margin-right: 20px;
}

.search-bar-small {
  display: flex;
  align-items: center;
}

.search-input-small {
  width: 400px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.search-button-small {
  padding: 8px 16px;
  font-size: 14px;
  background-color: #4285f4;
  color: white;
  border: 1px solid #4285f4;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.results-count {
  padding: 10px 20px;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #eee;
  background-color: white;
  flex-shrink: 0;
}

.results-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f8f9fa;
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>