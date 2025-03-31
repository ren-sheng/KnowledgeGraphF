<template>
  <div class="container">
    <el-container class="search-container">
      <div>
        <el-autocomplete v-model="searchInput" :fetch-suggestions="querySearch" placeholder="请输入学者名称(两个字符起)"
                         @select="handleSelect" class="autocomplete" suffix-icon="el-icon-search">
          <template v-slot:default="{ item }">
            <div class="suggestion-item">
              <span>{{ item.value }}</span>
              <span class="affiliation">{{ item.affiliation }}</span>
            </div>
          </template>
        </el-autocomplete>
      </div>
    </el-container>
    <el-container v-if="hasSelectedExpert">
      <el-main>
        <el-row :gutter="10">
          <el-col :span="14">
            <el-card style="width: 100%; height: 350px;">
              <el-form-item>
                <el-col :span="4" style="margin-top: 20px;">
                  <div class="avatar" :style="avatarStyle">
                    {{ authorInitials }}
                  </div>
                </el-col>
                <el-col :span="20" style="margin-top: 20px;">
                  <div class="author-details">
                    <strong style="font-size: 32px;">{{ authorName }}</strong>
                    <div class="icon-text-inline">
                      <el-icon>
                        <OfficeBuilding/>
                      </el-icon>
                      <p>{{ affiliation }}</p>
                    </div>
                    <div class="fields">
                      <span v-for="field in fields" :key="field" style="background: #f5f5f5;color:#777777">
                        {{ field }}
                      </span>
                    </div>
                  </div>
                </el-col>
              </el-form-item>
              <el-form-item style="background: #f9fafc ;height: 150px;width: 100%">
                <el-col :span="8">
                  <div class="stat">
                    <strong style="font-size: 24px">{{ paperCount }}</strong>
                    <p>论文</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat">
                    <strong>{{ citationCount }}</strong>
                    <p>被引次数</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat">
                    <strong>{{ kqi }}</strong>
                    <p>KQI</p>
                  </div>
                </el-col>
              </el-form-item>
            </el-card>
          </el-col>
          <el-col :span="10">
            <el-card style="width: 100%; height: 350px;">
              <div class="icon-text-inline">
                <el-icon style="font-size: 20px">
                  <Share/>
                </el-icon>
                <strong style="font-size: 20px">&nbsp&nbsp学者地图</strong>
              </div>
              <div style="width: 100%; height: 350px;">
                <RelationGraph ref="graphRef" :options="graphOptions" @node-click="onNodeClick"
                               @line-click="onLineClick"/>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <br>
        <template v-for="paper in papers" :key="paper" style="width: 100%">
          <el-card>
            <div slot="header" class="clearfix">
              <strong style="font-size: 24px;">{{ paper.title }}</strong>
              <el-button style="float: right; padding: 3px 0" type="text" @click="handleCite">&nbsp&nbsp Cite
              </el-button>
              <el-button style="float: right; padding: 3px 0" type="text" @click="handleSave">Save</el-button>
            </div>
            <div>
              <p><strong>Authors:</strong> {{ paper.authors.join(', ') }}</p>
              <p><strong>Year:</strong> {{ paper.year }}</p>
            </div>
          </el-card>
          <br>
        </template>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-main style="text-align: center;">
        <el-empty description="请输入学者名称进行搜索">
          <!-- <img src="@/assets/images/search.png" style="width: 200px; height: 200px;" /> -->
        </el-empty>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>

import {OfficeBuilding, Share} from "@element-plus/icons-vue";
// 从Vue中解构出需要的函数和方法
import {computed, onMounted, ref} from 'vue';
import RelationGraph from 'relation-graph-vue3';
import {useRoute} from 'vue-router'
import { searchAuthors, getAuthorDetails, getAuthorPapers, getAuthorNetwork } from '@/api/author.js';

const route = useRoute()
const expertId = ref('')
const hasSelectedExpert = ref(false);

const papers = ref([]);
const searchInput = ref(''); 
const authorName = ref(''); 

// 专家详细信息
const affiliation = ref('');
const fields = ref([]);
const paperCount = ref(0);
const citationCount = ref(0);
const kqi = ref(0);

// 图谱相关
const graphRef = ref(null);
const graphOptions = {
  debug: false,
  defaultNodeBorderWidth: 0,
  allowSwitchLineShape: true,
  allowSwitchJunctionPoint: true,
  defaultLineShape: 1,
  layout: {
    layoutName: 'force'
  },
  defaultJunctionPoint: 'border'
};

// 计算作者首字母
const authorInitials = computed(() => {
  const name = authorName.value || '';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else {
    return name.substring(0, 2).toUpperCase();
  }
});

// 生成头像背景色
const getBackgroundColor = (initials) => {
  const colors = [
    '#4285F4', '#DB4437', '#F4B400', '#0F9D58', 
    '#AB47BC', '#00ACC1', '#FF7043', '#9E9E9E'
  ];
  const charSum = initials.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return '#409eff';
};

// 计算头像样式
const avatarStyle = computed(() => {
  const backgroundColor = getBackgroundColor(authorInitials.value);
  return {
    backgroundColor,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: '500',
    textTransform: 'uppercase'
  };
});

// 加载专家数据
const loadExpertData = async (id) => {
  try {
    const [detailsResponse, papersResponse, networkResponse] = await Promise.all([
      getAuthorDetails(id),
      getAuthorPapers(id),
      getAuthorNetwork(id)
    ]);

    // 设置专家详细信息
    const details = detailsResponse.data;
    authorName.value = details.name;
    affiliation.value = details.affiliation;
    fields.value = details.fields;
    paperCount.value = details.paperCount;
    citationCount.value = details.citationCount;
    kqi.value = details.kqi;

    // 设置论文列表
    papers.value = papersResponse.data;

    // 设置关系图数据
    if (graphRef.value) {
      const graphInstance = graphRef.value.getInstance();
      await graphInstance.setJsonData(networkResponse.data);
      await graphInstance.moveToCenter();
      await graphInstance.setZoom(30);
    }

    hasSelectedExpert.value = true;
  } catch (error) {
    console.error('加载专家数据失败:', error);
  }
};

// 组件挂载时加载数据
onMounted(() => {
  expertId.value = route.params.id;
  if (expertId.value && expertId.value !== '0') {
    loadExpertData(expertId.value);
  }
});

// 搜索建议
const querySearch = async (queryString, cb) => {
  if (queryString.length >= 2) {
    try {
      const response = await searchAuthors(queryString);
      const suggestions = response.data.map(author => ({
        value: author.name,
        id: author.id,
        affiliation: author.affiliation
      }));
      cb(suggestions);
    } catch (error) {
      console.error('搜索作者失败:', error);
      cb([]);
    }
  } else {
    cb([]);
  }
};

// 选择专家
const handleSelect = async (item) => {
  resetData();
  await loadExpertData(item.id);
  window.history.pushState({}, '', `/expert/${item.id}`);
  searchInput.value = '';
};

// 重置数据
const resetData = () => {
  authorName.value = '';
  affiliation.value = '';
  fields.value = [];
  paperCount.value = 0;
  citationCount.value = 0;
  kqi.value = 0;
  papers.value = [];
};

// 图谱节点点击事件
const onNodeClick = (nodeObject, $event) => {
  console.log('onNodeClick:', nodeObject);
};

// 图谱连线点击事件
const onLineClick = (lineObject, linkObject, $event) => {
  console.log('onLineClick:', lineObject);
};
</script>


<style scoped>
.author-details {
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.author-profile {
  display: flex;
  flex-direction: column;
}

.author-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  user-select: none; /* 防止文字被选中 */
}

.fields {
  display: flex;
}

.fields span {
  margin-right: 10px;
}


.stat {
  text-align: center;

  strong {
    font-size: 24px;
    text-align: center;
  }
}

.citation-trend {
  margin-top: 20px;
}

.search-container {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
}

/* 修改 el-autocomplete 组件内部的输入框样式 */
.autocomplete {
  /* 添加你想要修改的样式属性 */
  height: 60px;
  width: 500px;

}

/*不知道原理，但是用/deep/很有用*/
.autocomplete :deep(.el-input__inner) {
  height: 50px !important;
  line-height: 32px !important;
  font-size: 16px;
  border: 1.5px solid #D528BE80;
}

.autocomplete :deep(.el-input__inner:hover) {
  border: 1.5px solid #FF40A06E;
}

/* 修改输入框聚焦时的样式 */
.autocomplete :deep(.el-input__inner:focus) {
  border-color: #FF40DF5E;
  box-shadow: 0 0 3px #FF40A06E;
}

.el-card1-div1 {
  padding: 5px 5px 10px 10px;
  background-color: rgba(99, 185, 253, 0.43);
  border-bottom: 1px solid #ebeef5;
  border-radius: 5px;
}

.el-card1-div2 {
  padding: 5px 5px 10px 10px;
  background-color: rgba(102, 180, 245, 0.50);
  border-bottom: 1px solid #ebeef5;
  border-radius: 5px;
}

.table1 {
  font-size: 14px;
  font-family: Arial;
  color: #3f6480;
  padding: 0px 0px 0px 10px;
}

.table2 {
  font-size: 14px;
  font-family: Arial;
  color: #3f6480;
  padding: 0px 0px 0px 10px;
}

.subject_author {
  font-family: 'sans-serif';
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
}

.icon-text-inline {
  display: flex;
  align-items: center;
}

.icon-text-inline p {
  margin-left: 5px;
  /* 调整图标和文本之间的间距 */
}

/* 添加搜索建议项的样式 */
.suggestion-item {
  display: flex;
  flex-direction: column;
  padding: 5px 0;
}

.suggestion-item .affiliation {
  font-size: 12px;
  color: #999;
}
</style>
