<script setup>
import {computed, ref} from 'vue';

import {useRoute} from 'vue-router';
import {
  Cpu,
  Expand,
  Fold,
  Grid,
  Guide,
  OfficeBuilding,
  Search as SearchIcon,
  Share,
  User
} from "@element-plus/icons-vue";


const route = useRoute();
const pageName = ref(route.name);

// 定义响应式数据
const isCollapse = ref(false); // 默认不收缩
const asideWidth = ref('200px');
const collapseIcon = ref('el-icon-s-fold');

// 控制收缩菜单按钮的方法
const handleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  // 控制收缩的大小
  asideWidth.value = isCollapse.value ? '64px' : '200px';
  collapseIcon.value = isCollapse.value ? 'el-icon-s-unfold' : 'el-icon-s-fold';
};

// 计算属性，用于设置容器的宽度样式
const containerWidth = computed(() => ({
  transition: 'margin-left 0.3s ease',
  marginLeft: isCollapse.value ? '64px' : '200px',
}));
</script>

<template>
  <div>
    <el-container>
      <!-- 侧边栏 -->
      <!-- 侧边栏使用了固定定位 (position: fixed;)，overflow-y: auto; 可确保侧边栏内容超视窗高度时能滚动 -->
      <el-aside :width="asideWidth" style="height: 100% ;background-color:#3d495c;position: fixed;overflow-y: auto;">
        <div
            style="height: 60px;line-height: 60px; color:white;display: flex;align-items: center;justify-content: center">
          <img src="@/assets/gyroscope.png" alt="" style="width: 40px;height: 40px">
          <span class="logo-title" v-show="!isCollapse">ESI知识图谱平台</span>
        </div>
        <!-- collapse指是否折叠 router作用为可点击菜单里按钮然后跳转页面 :default-active="$route.path是指点哪个菜单哪个高亮，注意只对一级菜单生效 -->
        <el-menu :collapse="isCollapse" :collapse-transition="false" router style="border: none"
                 :default-active="route.path" background-color="#3d495c" text-color="rgba(255,255,255,0.65)"
                 active-text-color="#fff">
          <!-- 一级菜单 index指路由 -->
          <el-menu-item index="/ai">
            <el-icon>
              <Cpu/>
            </el-icon>
            <span slot="title"> DeepSeek赋能</span></el-menu-item>
          <el-menu-item index="/search">
            <el-icon>
              <SearchIcon/>
            </el-icon>
            <span slot="title"> 平台搜索</span></el-menu-item>
          <el-menu-item index="/area">
            <el-icon>
              <Guide/>
            </el-icon>
            <span slot="title"> 研究领域</span></el-menu-item>
          <el-menu-item index="/expert/0">
            <el-icon>
              <User/>
            </el-icon>
            <span slot="title"> 学术专家</span></el-menu-item>
          <el-menu-item index="/institution">
            <el-icon>
              <OfficeBuilding/>
            </el-icon>
            <span slot="title"> 机构信息</span>
          </el-menu-item>
          <el-menu-item index="/knowledge">
            <el-icon><Share /></el-icon>
            <span slot="title"> 知识脉络</span>
          </el-menu-item>
<!--           <el-menu-item index="/algorithm">-->
<!--            <el-icon>-->
<!--              <Share/>-->
<!--            </el-icon>-->
<!--            <span slot="title"> 算法消歧</span>-->
<!--          </el-menu-item>-->
          <el-menu-item index="/local_knowledge">
            <el-icon>
              <Grid/>
            </el-icon>
            <span slot="title"> 本地知识</span>
          </el-menu-item>
          <el-menu-item index="/RegularDisambiguationID">
            <el-icon>
              <Checked/>
            </el-icon>
            <span slot="title"> 规则消歧</span>
          </el-menu-item>
<!--          <el-menu-item index="/RegularDisambiguationCo">-->
<!--            <el-icon>-->
<!--              <List/>-->
<!--            </el-icon>-->
<!--            <span slot="title"> 合作者规则消歧</span>-->
<!--          </el-menu-item>-->
          <!-- 二级菜单 -->
          <!-- <el-submenu>
            <template>
              <i class="el-icon-menu"></i>
              <span slot="title">一级菜单名字</span>
            </template>
            <el-menu-item>二级菜单名字</el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>

      <el-container :style="containerWidth">
        <!-- 头部区域 -->
        <el-header>
          <el-icon v-if="isCollapse" style="font-size: 22px" @click="handleCollapse">
            <Expand/>
          </el-icon>
          <el-icon v-else style="font-size: 22px" @click="handleCollapse">
            <Fold/>
          </el-icon>
          <!-- 面包屑，应该就是头部的那几个局部排版 -->
          <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 10px">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: $route.path }">{{ route.meta.name }}</el-breadcrumb-item>
          </el-breadcrumb>

          <div style="flex: 1;width: 0;display: flex;align-items: center;justify-content: flex-end">
            <span style="font-size: 15px"><router-link to="/e">登录</router-link></span>
          </div>
        </el-header>

        <!-- 主体区域，使用了<router-view/>，然后在index.js里写相关的children然后附上地址即可 -->
        <el-main>
          <router-view/>
        </el-main>

        <!-- 页尾  -->
        <el-footer style="position: fixed; bottom: 0; width: 100%;">
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.logo-title {
  font-size: 19px;
  color: #66b5f6;
  transition: 0s ease; /*0.3s的意思*/
}

.el-menu-item {
  /*width: 142px!important;*/
  font-size: 17px !important;
  height: 50px !important;
  line-height: 50px !important;
  /*设置两边隔开一点*/
  margin: 4px !important;

  &:hover {
    color: #fff !important;
    /*设置圆角*/
    border-radius: 5px !important;
  }

  &.is-active {
    /*设置选中时颜色变化*/
    background-color: #2073b8 !important;
    color: #ffffff !important;
    /*设置圆角*/
    border-radius: 5px !important;
    /*设置两边隔开一点*/
    margin: 4px !important;
  }
}

.el-aside {
  transition: width .3s;
  box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  padding: 0;
  margin: 0;
}

.el-header {
  box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
  display: flex;
  align-items: center;
}

.el-container {
  padding: 0;
  margin: 0;
}
</style>
