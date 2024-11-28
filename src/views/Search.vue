<template>
  <div class="search">
    <div class="header">
      <div class="menu">
        <a href="https://scholar.google.com.hk/scholar?scilib=1&hl=zh-CN&as_sdt=0,5" style="color: #666;">
          ✎ 我的个人学术档案
        </a>
        <a href="https://scholar.google.hk/scholar?scilib=1&hl=zh-CN&as_sdt=0,5" style="color: #666;">
          ✦ 我的图书馆
        </a>
      </div>
      <!--      <div class="login">登录</div>-->
    </div>
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
<!--      <div class="slogan">张在栩嘉的装上</div>-->
      <div class="slogan">站在巨人的肩膀上</div>
    </div>

  </div>
</template>

<script setup>
import {ref} from 'vue'

const searchQuery = ref('')
const languageOption = ref('all')

const search = () => {
  console.log(`搜索: ${searchQuery.value}，语言选项: ${languageOption.value}`)
  //
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
  justify-content: flex-start; /* 确保菜单项靠左对齐 */
  width: 100%;
  padding: 0; /* 移除内边距 */
  box-sizing: border-box;
}

.menu {
  display: flex;
  gap: 50px; /* 调整菜单项之间的间距 */
  margin-right: 0; /* 将菜单项推到左边 */
  font-size: 16px;
}

.menu span {
  cursor: pointer;
}

.login {
  cursor: pointer;
  margin-left: auto; /* 将登录按钮推到右边 */
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 上边界 */
  margin: 100px 0;
}

.logo {
  font-size: 40px;
  color: #4285f4;
  margin-bottom: 20px;
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
</style>