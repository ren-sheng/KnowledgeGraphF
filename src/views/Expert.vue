<template>
  <div class="container">
    <el-container class="search-container">
      <div>
        <el-autocomplete v-model="authorName" :fetch-suggestions="querySearch" placeholder="请输入学者名称："
                         @select="handleSelect" class="autocomplete" suffix-icon="el-icon-search">
          <template v-slot:default="{ item }">
            <span>{{ item }}</span>
          </template>
        </el-autocomplete>
      </div>
    </el-container>
    <el-container>
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

  </div>
</template>

<script setup>

import {OfficeBuilding, Share} from "@element-plus/icons-vue";
// 从Vue中解构出需要的函数和方法
import {computed, onMounted, ref} from 'vue';
import RelationGraph from 'relation-graph-vue3';
import {useRoute} from 'vue-router'

const route = useRoute()
const expertId = ref('')

const papers = ref([
  {
    id: 1,
    title: 'Exploring Plain Vision Transformer Backbones for Object Detection',
    authors: ['Yanghao Li', 'Hanzi Mao', 'Ross B. Girshick', 'Kaiming He'],
    year: 2022
  },
  {
    id: 2,
    title: 'Exploring Simple Siamese Representation Learning',
    authors: ['Xinlei Chen', 'Kaiming He'],
    year: 2021
  },
  {
    id: 3,
    title: 'An Empirical Study of Training Self-Supervised Visual Transformers',
    authors: ['Xinlei Chen', 'Saining Xie', 'Kaiming He'],
    year: 2021
  },
]);

// 模拟数据
const authorName = ref('Kaiming He');
const affiliation = ref('Microsoft, Facebook');
const fields = ref(['Computer science', 'Artificial intelligence', 'Pattern recognition', 'Machine learning', 'Computer vision']);
const paperCount = ref(151);
const citationCount = ref(233433);
const kqi = ref(2.94);

// 定义graphRef，这里不再有类型约束，直接初始化为null
const graphRef = ref(null);

// 定义graphOptions，同样不再有类型约束
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
    // 如果有姓和名，取两个首字母
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else {
    // 如果只有一个词，取前两个字母
    return name.substring(0, 2).toUpperCase();
  }
});

// 生成随机但固定的背景色
const getBackgroundColor = (initials) => {
  const colors = [
    '#4285F4', // Google Blue
    '#DB4437', // Google Red
    '#F4B400', // Google Yellow
    '#0F9D58', // Google Green
    '#AB47BC', // Purple
    '#00ACC1', // Cyan
    '#FF7043', // Deep Orange
    '#9E9E9E'  // Grey
  ];

  // 使用首字母的 ASCII 码来选择颜色，确保同一个名字总是得到相同的颜色
  const charSum = initials.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  // return colors[charSum % colors.length];
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

// 挂载后执行的函数
onMounted(() => {
  // 从路由参数中获取专家ID
  expertId.value = route.params.id
  if (expertId.value == null) {
    expertId.value = '1'
  }
  // 根据ID加载专家详情
  loadExpertDetails(expertId.value)
  showGraph();
});

// 展示图形的函数
const showGraph = async () => {
  const __graph_json_data = {
    rootId: 'kaiming',
    nodes: [
      {
        id: "kaiming",
        text: "kaiming",
        color: "orange",
      },
      {id: 'coauthor1', text: 'Co-author 1'},
      {id: 'coauthor2', text: 'Co-author 2'},
      {id: 'coauthor3', text: 'Co-author 3'},
      {id: 'coauthor4', text: 'Co-author 4'},
      {id: 'coauthor5', text: 'Co-author 5'},
      {id: 'coauthor6', text: 'Co-author 6'},
      {id: 'coauthor7', text: 'Co-author 7'},
      {id: 'coauthor8', text: 'Co-author 8'},
      {id: 'coauthor9', text: 'Co-author 9'},
      {id: 'coauthor10', text: 'Co-author 10'},
      {id: 'coauthor11', text: 'Co-author 11'},
      {id: 'coauthor12', text: 'Co-author 12'},
      {id: 'coauthor13', text: 'Co-author 13'},
      {id: 'coauthor14', text: 'Co-author 14'},
      {id: 'coauthor15', text: 'Co-author 15'},
      {id: 'coauthor16', text: 'Co-author 16'},
      {id: 'coauthor17', text: 'Co-author 17'},
      {id: 'coauthor18', text: 'Co-author 18'},
      {id: 'coauthor19', text: 'Co-author 19'},
      {id: 'coauthor20', text: 'Co-author 20'}
    ],
    lines: [
      {from: 'kaiming', to: 'coauthor1'},
      {from: 'kaiming', to: 'coauthor2'},
      {from: 'kaiming', to: 'coauthor3'},
      {from: 'kaiming', to: 'coauthor4'},
      {from: 'kaiming', to: 'coauthor5'},
      {from: 'kaiming', to: 'coauthor6'},
      {from: 'kaiming', to: 'coauthor7'},
      {from: 'kaiming', to: 'coauthor8'},
      {from: 'kaiming', to: 'coauthor9'},
      {from: 'kaiming', to: 'coauthor10'},
      {from: 'coauthor1', to: 'coauthor11'},
      {from: 'coauthor2', to: 'coauthor12'},
      {from: 'coauthor3', to: 'coauthor13'},
      {from: 'coauthor4', to: 'coauthor14'},
      {from: 'coauthor5', to: 'coauthor15'},
      {from: 'coauthor6', to: 'coauthor16'},
      {from: 'coauthor7', to: 'coauthor17'},
      {from: 'coauthor8', to: 'coauthor18'},
      {from: 'coauthor9', to: 'coauthor19'},
      {from: 'coauthor10', to: 'coauthor20'},
      {from: 'coauthor11', to: 'coauthor12'},
      {from: 'coauthor13', to: 'coauthor14'},
      {from: 'coauthor15', to: 'coauthor16'},
      {from: 'coauthor17', to: 'coauthor18'},
      {from: 'coauthor19', to: 'coauthor20'}
    ]
  };
  const graphInstance = graphRef.value.getInstance();
  if (graphInstance) {
    await graphInstance.setJsonData(__graph_json_data);
    await graphInstance.moveToCenter();
    // await graphInstance.zoomToFit();
    await graphInstance.setZoom(30);
  }
};

// 节点点击事件处理函数
const onNodeClick = (nodeObject, $event) => {
  console.log('onNodeClick:', nodeObject);
};

// 连线点击事件处理函数
const onLineClick = (lineObject, linkObject, $event) => {
  console.log('onLineClick:', lineObject);
};

const loadExpertDetails = async (id) => {
  // 加载专家详情的逻辑
  if (id == '1') {
    authorName.value = 'Kaiming He'
  } else if (id == '2') {
    authorName.value = 'Xinlei Chen'
  } else if (id == '3') {
    authorName.value = 'Ross B. Girshick'
  }
}
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
</style>
