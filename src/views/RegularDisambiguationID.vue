<template>
  <div>
    <el-container>
      <el-main>
        <!-- 搜索区域 -->
        <el-form :model="form" label-width="0px">
          <h2>个体相似程度</h2>
          <h1>输入两个作者/机构的名字，点击搜索按钮，以图谱形式显现出来二者之间的关系</h1>
          <el-form-item>
            <el-input v-model="form.searchText1" placeholder="请输入搜索内容" style="width: 350px;margin-right: 20px">
            </el-input>
            <el-input v-model="form.searchText2" placeholder="请输入搜索内容" style="width: 350px;margin-right: 20px">
            </el-input>
            <el-select v-model="form.searchType" placeholder="请选择搜索类型" style="width: 100px;margin-right: 20px">
              <el-option label="姓名" value="name"></el-option>
              <el-option label="机构名称" value="institutionName"></el-option>
<!--              <el-option label="SC" value="SC"></el-option>-->
<!--              <el-option label="RI" value="RI"></el-option>-->
<!--              <el-option label="OI" value="OI"></el-option>-->
            </el-select>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="primary" @click="openDrawer">查看相似度直方图</el-button>
            <el-button type="primary" @click="openSettingsDrawer">导入csv文件</el-button>
          </el-form-item>
        </el-form>
        <el-table v-if="result.length > 0" :data="result" stripe>
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
        </el-table>
        <!-- 图谱展示区域 -->
        <div class="graph">
          <div style="border: 1px solid #efefef; height: 60vh; width: 100%; position: relative;">
            <relation-graph ref="graphRef$" :options="options" @node-click="handleNodeClick" @line-click="handleLineClick">
              <template #node="{node}">
                <div class="c-round" style="" v-if="node.text!=form.searchText1 && node.text!=form.searchText2">
                  <el-icon color="#3372b7" :size="45" v-if="node.type==='author_id'"><User  /></el-icon>
                  <el-icon color="#16a34a" :size="45" v-if="node.type==='author_name'"><UserFilled  /></el-icon>
                  <el-icon color="#16a34a" :size="45" v-if="node.type==='name'"><UserFilled  /></el-icon>
                  <el-icon color="#64748b" :size="45" v-if="node.type==='institution'"><LocationFilled  /></el-icon>
                  <el-icon color="#64748b" :size="45" v-if="node.type==='institution_name'"><LocationFilled  /></el-icon>
                  <el-icon color="#3372b7" :size="45" v-if="node.type==='institution_id'"><Location  /></el-icon>
                  <el-icon color="#71b4f5" :size="45" v-if="node.type==='sc'"><Search  /></el-icon>
                  <el-icon color="#db2777" :size="45" v-if="node.type==='ri'"><Aim  /></el-icon>
                  <el-icon color="#80082d" :size="45" v-if="node.type==='oi'"><Pointer  /></el-icon>
                </div>
                <div class="c-round" v-else> <el-icon color="#66ccff" :size="50"><StarFilled /></el-icon> </div>
                <div class="c-node-name" :style="{color:node.fontcolor}" v-if="node.text!=form.searchText1 && node.text!=form.searchText2">{{node.text}}</div>
                <div class="c-node-name" :style="{color:'#66ccff'}" v-else>{{node.text}}</div>
              </template>
            </relation-graph>
            <!-- 显示点击内容的区域 -->
            <div class="clicked-content" v-if="clickedText">
              {{chineseMap[clickedText2]}}  :  {{ clickedText }}
            </div>
            <!-- 按 searchType 筛选节点区域 -->
            <div v-if="isAu" style="position:absolute;z-index:700;left:20px;top:60px;height:60px;padding-top:6px;padding-left: 30px;padding-right:30px;border: #efefef solid 1px;color: #555555;border-radius: 10px;background-color: rgba(255,255,255,0.79);font-size: 12px;">
              <div style="">
                <div style="line-height: 20px;">节 点 筛 选 分 类 器 :</div>
                <el-select v-model="selectedSearchType" placeholder="全部" @change="doFilter">
                  <el-option label="全部">全部</el-option>
                  <el-option label="作者姓名" value="name"></el-option>
                  <el-option label="作者ID" value="author_id"></el-option>
                  <el-option label="机构名称" value="institution"></el-option>
                  <el-option label="研究方向" value="sc"></el-option>
                  <el-option label="RI" value="ri"></el-option>
                  <el-option label="OI" value="oi"></el-option>
                </el-select>
              </div>
            </div>
            <div v-else style="position:absolute;z-index:700;left:20px;top:60px;height:60px;padding-top:6px;padding-left: 30px;padding-right:30px;border: #efefef solid 1px;color: #555555;border-radius: 10px;background-color: rgba(255,255,255,0.79);font-size: 12px;">
              <div style="">
                <div style="line-height: 20px;">节 点 筛 选 分 类 器 :</div>
                <el-select v-model="selectedSearchType" placeholder="全部" @change="doFilter">
                  <el-option label="全部">全部</el-option>
                  <el-option label="作者姓名" value="author_name"></el-option>
                  <el-option label="机构名称" value="institution_name"></el-option>
                  <el-option label="机构ID" value="institution_id"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!-- 图例区域 -->
          <div class="legend">
            <div class="legend-item">
              <el-icon :size="20" v-if="isAu" ><User  /></el-icon>
              <el-icon :size="20" v-else ><Location  /></el-icon>
              <span class="legend-label">{{ isAu ? "作者ID" : "机构ID" }}</span>
            </div>
            <div class="legend-item">
              <el-icon :size="20"><UserFilled  /></el-icon>
              <span class="legend-label">作者名</span>
            </div>
            <div class="legend-item">
              <el-icon :size="20"><Search  /></el-icon>
              <span class="legend-label">研究方向</span>
            </div>
            <div class="legend-item">
              <el-icon :size="20"><LocationFilled  /></el-icon>
              <span class="legend-label">机构名</span>
            </div>
            <div class="legend-item">
              <el-icon :size="20"><Aim  /></el-icon>
              <span class="legend-label">RI</span>
            </div>
            <div class="legend-item">
              <el-icon :size="20"><Pointer  /></el-icon>
              <span class="legend-label">OI</span>
            </div>
            <div class="legend-item">
              <el-icon :size="20"><StarFilled  /></el-icon>
              <span class="legend-label">搜索词</span>
            </div>
          </div>
        </div>
      </el-main>
      <!-- 右侧弹出的侧边栏用于显示相似度直方图 -->
      <el-drawer v-model="drawerVisible" direction="rtl" title="相似度直方图" size="50%" destroy-on-close>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>消歧实体变化</h2>
          <h1>作者实体变化</h1>
          {{ subAupre }} 个 -> {{ subAunow }} 个
          <h1>机构实体变化</h1>
          {{ subInpre }} 个 -> {{ subInnow }} 个
        </div>
        <div v-for="(chart, index) in charts" :key="index" style="margin-bottom: 20px;">
          <h3>{{ chart.step }}</h3>
          <Bar :data="chart.chartData" :options="chartOptions" v-if="chart.chartData.labels.length > 0" />
        </div>
      </el-drawer>
      <!-- 原有的设置抽屉 -->
      <el-drawer v-model="settingsDrawerVisible" direction="rtl" title="设置" :close-on-click-modal="false">
        <div class="sidebar">
          <!-- 上传文件区域 -->
          <div class="upload-section">
            <input type="file" id="fileInput" @change="handleFileChange">
            <el-button type="primary" @click="uploadSelectedFile">上传csv文件</el-button>
          </div>
          <!-- 设置阈值和权值区域 -->
          <div class="settings-section">
            <el-form :model="settingsForm" label-width="100px">
              <el-form-item label="机构阈值">
                <el-input v-model="settingsForm.institution_threshold" type="number"></el-input>
              </el-form-item>
              <el-form-item label="作者阈值">
                <el-input v-model="settingsForm.author_threshold" type="number"></el-input>
              </el-form-item>
              <el-form-item label="名称权重">
                <el-input v-model="settingsForm.name_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="SC 权重">
                <el-input v-model="settingsForm.sc_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="合作权重">
                <el-input v-model="settingsForm.collaboration_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="机构权重">
                <el-input v-model="settingsForm.institution_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="setThresholdsAndWeights">设置阈值和权值</el-button>
              </el-form-item>
            </el-form>
          </div>
<!--          插入md-->
          <el-popover
              class="box-item"
              title=""
              content="Left Center prompts info"
              placement="left-start"
              :width="1000"
              trigger="click"
          >
            <template #reference>
              <el-button class="mt-3 mb-3">csv格式要求</el-button>
            </template>
            <h1>csv格式要求</h1>
            <el-table :data="tableData" stripe>
              <el-table-column prop="columnName" label="列名"></el-table-column>
              <el-table-column prop="dataType" label="数据类型"></el-table-column>
              <el-table-column prop="description" label="描述"></el-table-column>
              <el-table-column prop="example" label="示例"></el-table-column>
            </el-table>
          </el-popover>
          <el-popover
              class="box-item"
              title=""
              content="Left Center prompts info"
              placement="left-start"
              :width="1000"
              trigger="click"
          >
            <template #reference>
              <el-button class="mt-3 mb-3">阈值权值说明</el-button>
            </template>
            <div style="width: 1000px;">
              <h1>阈值权值说明</h1>
              <p>阈值：用于判断两个节点是否相似的阈值，范围在0到1之间。</p>
              <p>权值：用于计算相似度的权重，范围在0到1之间，所有权重之和必须为1。</p>
              <p>名称权重：作者姓名的权重。</p>
              <p>SC 权重：研究方向的权重。</p>
              <p>合作权重：合作论文的权重。</p>
              <p>机构权重：机构名称的权重。</p>
            </div>
          </el-popover>
          <el-popover
              class="box-item"
              title=""
              content="Left Center prompts info"
              placement="left-start"
              :width="1000"
              trigger="click"
          >
            <template #reference>
              <el-button class="mt-3 mb-3">阈值权值算法</el-button>
            </template>
            <div>
              <h1>机构与作者处理算法流程</h1>
              <h2>机构处理流程</h2>
              <p>当处理CSV文件中的机构名称时，首先判断该机构名称是否已在 <code>seen_institutions</code> 集合中出现过。若未出现，将其添加到集合，并使机构计数加1。</p>
              <p>尝试从数据库 <code>institutionname</code> 表中查询该机构名称对应的 <code>institution_name_id</code>。若能查到，继续查询对应的 <code>institution_id</code>；若未查到，插入该机构名称到 <code>institutionname</code> 表，并获取新插入记录的 <code>institution_name_id</code>。</p>
              <p>计算新机构名称与数据库中已存在机构名称的编辑距离相似度（使用 <code>edit_distance_similarity_institution</code> 函数），相关结果存入 <code>results</code> 和 <code>similarity_results</code>。若相似度大于 <strong>机构阈值</strong>（当前设置及可调整的值），则将新机构记录合并到相似的已有机构记录。若未找到相似且满足阈值条件的机构，则为新机构生成新的 <code>institution_id</code> 并插入到 <code>institution</code> 表。</p>
              <h2>作者处理流程</h2>
              <p>遍历CSV文件每行中的作者，判断作者名字是否在 <code>seen_authors</code> 集合中出现过。若未出现，将其添加到集合，并使作者计数加1。</p>
              <p>尝试从数据库 <code>name</code> 表中查询该作者名字对应的 <code>name_id</code>。若未查到，插入作者名字到 <code>name</code> 表，并获取新插入记录的 <code>name_id</code>。</p>
              <p>根据作者的Researcher Ids（RI）或ORCIDs（OI），尝试在数据库 <code>author</code> 表中查找对应的 <code>author_id</code>。若找到，进行合并操作并更新相关标识（RI或OI）。</p>
              <p>若无法通过RI或OI合并：</p>
              <ul>
                <li>计算作者名字与数据库中已存在名字的编辑距离相似度（<code>edit_distance_similarity</code> 函数）。</li>
                <li>获取与已有作者相关的专业领域信息，计算专业领域加权Jaccard相似度（<code>weighted_jaccard_similarity</code> 函数）。</li>
                <li>计算当前作者的合作者与已有作者的合作者之间的Jaccard相似度（<code>jaccard_similarity</code> 函数）。</li>
                <li>若存在机构信息，计算当前作者与已有作者关联机构的Jaccard相似度（<code>jaccard_similarity</code> 函数）。</li>
                <li>根据 <strong>名称权重</strong>、<strong>SC权重</strong>、<strong>合作权重</strong>、<strong>机构权重</strong>，计算作者综合相似度。若综合相似度大于 <strong>作者阈值</strong>，则将当前作者记录合并到相似的已有作者记录。</li>
              </ul>
              <p>若未找到相似且满足阈值条件的作者记录，则插入新的作者记录到 <code>author</code> 表，并在相关表（如 <code>ownership</code>、<code>involvement</code>、<code>collaboration</code>、<code>authorship</code>、<code>affiliation</code>）中插入关联记录。</p>
            </div>
          </el-popover>

        </div>
      </el-drawer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {
  Aim,
  Location,
  LocationFilled,
  Pointer,
  User,
  UserFilled,
  Search,
  StarFilled,
  Compass
} from "@element-plus/icons-vue";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
import { ref, computed, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import {searchAuthor, transformData, transformData2} from '../api/Disambiguation.js';
import {uploadFile, setThresholdsWeights, getEntityCountComparison} from '../api/flask.js';
import RelationGraph, { RGJsonData, RGOptions, RGNode, RGLine, RGLink, RGUserEvent, RelationGraphComponent } from 'relation-graph-vue3';
import { ElDrawer, ElMessage, ElLoading } from 'element-plus';
import CircumIcon from "@klarr-agency/circum-icons-vue/src/CircumIcons.vue";
import MarkdownIt from 'markdown-it';
// import {useMarkdown} from '@vueuse/core';

// 控制两个抽屉的显示状态
const drawerVisible = ref(false);
const settingsDrawerVisible = ref(false);

const uploadResult = ref(null);

const isAu = ref(true);
const clickedText = ref('');
const clickedText2 = ref('');


const tableData = ref([
  {
    columnName: 'Author Full Names',
    dataType: '字符串',
    description: '作者的全名，多个作者之间用 `; ` 分隔',
    example: 'John Doe; Jane Smith'
  },
  {
    columnName: 'Article Title',
    dataType: '字符串',
    description: '文章的标题',
    example: 'The Impact of AI in Healthcare'
  },
  {
    columnName: 'Reprint Addresses',
    dataType: '字符串',
    description: '地址',
    example: 'University of Example'
  },
  {
    columnName: 'Researcher Ids',
    dataType: '字符串',
    description: '研究者ID，格式为 `作者姓名/ID`，多个ID之间用 `; ` 分隔',
    example: 'John Doe/12345; Jane Smith/67890'
  },
  {
    columnName: 'ORCIDs',
    dataType: '字符串',
    description: 'ORCID（开放研究者与贡献者身份识别码），格式为 `作者姓名/ORCID`，多个ORCID之间用 `; ` 分隔',
    example: 'John Doe/0000-0001-8829-2719; Jane Smith/0000-0002-1234-5678'
  },
  {
    columnName: 'Research Areas',
    dataType: '字符串',
    description: '研究领域，多个领域之间用 `; ` 分隔',
    example: 'Artificial Intelligence; Machine Learning'
  }
]);

//中文置换表
const chineseMap = {
  'author_id': '作者ID',
  'name': '作者姓名',
  'author_name': '作者姓名',
  'sc': '研究方向',
  'ri': 'RI',
  'oi': 'OI',
  'institution_id': '机构ID',
  'institution': '机构名称',
  'institution_name': '机构名称',
  'line': '合作论文'
};


// 按 searchType 筛选相关
const selectedSearchType = ref('');

const subAupre=ref(0)
const subAunow=ref(0)
const subInpre=ref(0)
const subInnow=ref(0)

// 打开相似度直方图抽屉的方法
const openDrawer = async () => {
  drawerVisible.value = true;
  // 延迟 1 秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (jsonArray.value) {
    charts.value = [];
    uniqueSteps.value.forEach(step => {
      const stepData = jsonArray.value.filter(item => item.step === step);
      const chartData = generateFrequencyHistogramData(stepData);
      if (chartData.labels.length > 0) {
        charts.value.push({
          step,
          chartData
        });
      }
    });
  }
};

// 打开设置抽屉的方法
const openSettingsDrawer = () => {
  settingsDrawerVisible.value = true;
};

// 上传文件相关逻辑
const selectedFile = ref<File | null>(null);
const handleFileChange = (e: any) => {
  const file = e.target.files[0];
  selectedFile.value = file;
};

const uploadSelectedFile = async () => {
  if (selectedFile.value) {
    let loadingInstance;
    try {
      // 显示加载圈
      loadingInstance = ElLoading.service({
        lock: true,
        text: '文件上传中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const res = await uploadFile(selectedFile.value);
      console.log('文件上传成功');
      ElMessage.success('文件上传成功');
      uploadResult.value = res;
      console.log(uploadResult.value);

      if (uploadResult.value) {
        const processedData = processRawData(uploadResult.value);
        console.log(processedData);

        jsonArray.value = processedData;
      }

      //获取一下消除了多少实体
      //  const tmp=null;
       const tmp = await getEntityCountComparison();
        subAupre.value=tmp.author.pre_disambiguation;
        subAunow.value=tmp.author.post_disambiguation;
        subInpre.value=tmp.institution.pre_disambiguation;
        subInnow.value=tmp.institution.post_disambiguation;
       // console.log(tmp.value);

    } catch (error) {
      console.error('文件上传失败:', error);
      ElMessage.error('文件上传失败，请稍后重试');
    } finally {
      // 隐藏加载圈
      if (loadingInstance) {
        loadingInstance.close();
      }
    }
  } else {
    console.error('请选择一个文件');
    return;
  }
};

// 设置阈值和权值相关逻辑
const settingsForm = ref({
  name_weight: 0.3,
  sc_weight: 0.2,
  collaboration_weight: 0.2,
  institution_weight: 0.3,
  institution_threshold: 0.8,
  author_threshold: 0.7
});
const setThresholdsAndWeights = async () => {
  const { name_weight, sc_weight, collaboration_weight, institution_weight, institution_threshold, author_threshold } = settingsForm.value;
  const weightSum = name_weight + sc_weight + collaboration_weight + institution_weight;
  if (weightSum !== 1) {
    console.error('权重值之和必须为 1');
    return;
  }
  try {
    await setThresholdsWeights(name_weight, sc_weight, collaboration_weight, institution_weight, institution_threshold, author_threshold);
    console.log('阈值和权值设置成功');
  } catch (error) {
    console.error('阈值和权值设置失败:', error);
  }
};

// 搜索功能逻辑
const form = ref({
  searchText1: '',
  searchText2: '',
  searchType: 'name'
});

const result1 = ref([]);
const result2 = ref([]);
const result = ref([]);


const search = async () => {
  try {
    const response1 = await searchAuthor(form.value.searchText1, form.value.searchType);
    const response2 = await searchAuthor(form.value.searchText2, form.value.searchType);
    //将response1和response2的数据合并,相同的数据只显示一次
    result1.value = response1.data; // 假设返回的数据在 response.data 中
    result2.value = response2.data; // 假设返回的数据在 response.data 中
    console.log('搜索结果:', result1.value);
    console.log('搜索结果:', result2.value);
    let finalResult1=null;
    let finalResult2=null;
    if (form.value.searchType === 'name') {
      finalResult1 = transformData(result1.value.data);
      finalResult2 = transformData(result2.value.data);
    } else {
      finalResult1 = transformData2(result1.value.data);
      finalResult2 = transformData2(result2.value.data);
    }
    // const finalResult1 = transformData(result1.value.data);
    // const finalResult2 = transformData(result2.value.data);
    console.log('转换后的数据:', finalResult1);
    console.log('转换后的数据:', finalResult2);

    // 合并 nodes
    const combinedNodes = [];
    const textMap = new Map();
    finalResult1.nodes.forEach((node) => {
      combinedNodes.push(node);
      textMap.set(node.text, node.id);
    });
    finalResult2.nodes.forEach((node) => {
      if (!textMap.has(node.text)) {
        combinedNodes.push(node);
        textMap.set(node.text, node.id);
      }
    });

    // 合并 lines 并更新 from 和 to 的 id
    const combinedLines = [];

    const updateLineIds = (lines) => {
      lines.forEach((line) => {
        const fromNode1 = finalResult1.nodes.find((node) => node.id === line.from);
        const fromNode2 = finalResult2.nodes.find((node) => node.id === line.from);
        const toNode1 = finalResult1.nodes.find((node) => node.id === line.to);
        const toNode2 = finalResult2.nodes.find((node) => node.id === line.to);

        const newFromId = textMap.get(fromNode1 ? fromNode1.text : fromNode2.text);
        const newToId = textMap.get(toNode1 ? toNode1.text : toNode2.text);

        const isDuplicate = combinedLines.some((existingLine) => {
          // 检查头尾节点是否一致或者头尾互换是否一致
          return (
              (existingLine.from === newFromId && existingLine.to === newToId) ||
              (existingLine.from === newToId && existingLine.to === newFromId)
          );
        });

        if (!isDuplicate) {
          combinedLines.push({
            ...line,
            from: newFromId,
            to: newToId
          });
        }
      });
    };
    updateLineIds(finalResult1.lines);
    updateLineIds(finalResult2.lines);

    const combinedResult = {
      nodes: combinedNodes,
      lines: combinedLines
    };
    isAu.value = form.value.searchType === 'name';
    graphOn(combinedResult);



  } catch (error) {
    console.error('搜索失败:', error);
  }
};

const graphRef$ = ref<RelationGraph>();
const options : RGOptions = {
  backgrounImageNoRepeat: true,
  moveToCenterWhenRefresh: true,
  zoomToFitWhenRefresh: true,
  placeOtherGroup: true,
  defaultNodeWidth: 60,
  defaultNodeHeight: 60,
  defaultLineWidth: 1,
  defaultLineShape: 5,
  lineUseTextPath: true,
  defaultLineFontColor: 'rgba(0, 0, 0, 0.6)',
  layouts: [
    {
      label: "中心",
      layoutName: "center",
      centerOffset_x: 0,
      centerOffset_y: 0,
      distance_coefficient: 1
    }
  ]
};

const ansco = ref<boolean>(false);

const graphOn = (finalResult) => {
  ansco.value = !ansco.value;

  // 为匹配搜索关键词的节点添加特殊样式
  const searchText = form.value.searchText1;
  const searchText2 = form.value.searchText2;
  if (searchText) {
    finalResult.nodes.forEach(node => {
      if (node.text === searchText) {
        node.color = 'transparent';
        node.borderWidth = 3;
        node.borderColor = 'transparent';
        node.fontColor = '#3372b7';
      }
    });
    console.log(finalResult.nodes);
  }
  if (searchText2) {
    finalResult.nodes.forEach(node => {
      if (node.text === searchText2) {
        node.color = 'transparent';
        node.borderWidth = 3;
        node.borderColor = 'transparent';
        node.fontColor = '#3372b7';
      }
    });
    console.log(finalResult.nodes);
  }
  graphRef$.value?.setJsonData(finalResult);
  const finalJson = JSON.stringify(finalResult, null, 2);
  console.log(finalJson);
};

// 处理节点点击事件
const handleNodeClick = (node: any) => {
  clickedText.value = node.text;
  clickedText2.value=node.type;
  console.log(clickedText2.value);
};

// 处理连线点击事件
const handleLineClick = (line: any) => {
  clickedText.value = line.text;
  if (line.text) {
    clickedText2.value = 'line';
  }
  // clickedText2.value = line;
  console.log(clickedText2.value);
};

// 图表数据处理逻辑
interface Item {
  step: string;
  similarity: number;
}

const jsonArray = ref<Item[]>([
]);

function processRawData(rawData) {
  // 定义允许的 step 类型
  const allowedSteps = [
    'author_name_similarity',
    'author_sc_similarity',
    'author_collaboration_similarity',
    'author_institution_similarity',
    'author_overall_similarity',
    'institution_similarity'
  ];

  // 过滤掉包含 status 字段的项，只保留包含 similarity 和 step 字段的项
  const relevantData = rawData.filter(item => !item.status && item.similarity!== undefined && item.step);

  // 进一步过滤 step 字段，只保留指定的六种类型
  const finalData1 = relevantData.filter(item => allowedSteps.includes(item.step));
  const finalData = finalData1.filter(item => item.similarity!==0 && item.similarity!==1);

  // 去掉 json 里多余的标签，只保留 step 和 similarity 字段
  const result = finalData.map(item => ({
    step: item.step,
    similarity: item.similarity
  }));

  // 定义英文到中文的映射
  const stepTranslation = {
    'author_name_similarity': '作者姓名相似度统计',
    'author_sc_similarity': '作者研究方向相似度统计',
    'author_collaboration_similarity': '作者合作者相似度统计',
    'author_institution_similarity': '作者从属机构相似度统计',
    'author_overall_similarity': '作者总相似度统计',
    'institution_similarity': '机构相似度统计'
  };

  // 将 step 替换为中文描述
  const translatedResult = result.map(item => ({
    step: stepTranslation[item.step],
    similarity: item.similarity
  }));

  return translatedResult;
}

function generateFrequencyHistogramData(data, numBins = 6) {
  if (data.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: '相似度频率',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  }

  const minSimilarity = Math.max(0, Math.min(...data.map(item => item.similarity)));
  const maxSimilarity = Math.min(1, Math.max(...data.map(item => item.similarity)));

  // 判断最大和最小相似度是否一致
  if (minSimilarity === maxSimilarity) {
    return {
      labels: [],
      datasets: [{
        label: '相似度频率',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  }

  const binWidth = (maxSimilarity - minSimilarity) / numBins;

  const bins = Array.from({ length: numBins }, (_, i) => ({
    start: minSimilarity + i * binWidth,
    end: minSimilarity + (i + 1) * binWidth,
    count: 0
  }));

  data.forEach(item => {
    for (let i = 0; i < bins.length; i++) {
      if (i === bins.length - 1) {
        // 最后一个区间为闭区间
        if (item.similarity >= bins[i].start && item.similarity <= bins[i].end) {
          bins[i].count++;
          break;
        }
      } else {
        // 其他区间为左闭右开
        if (item.similarity >= bins[i].start && item.similarity < bins[i].end) {
          bins[i].count++;
          break;
        }
      }
    }
  });

  const chartData = {
    labels: bins.map(bin => `${bin.start.toFixed(2)}-${bin.end.toFixed(2)}`),
    datasets: [
      {
        label: '相似度频率',
        data: bins.map(bin => bin.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  return chartData;
}

const charts = ref<{ step: string; chartData: any }[]>([]);
const uniqueSteps = computed(() => {
  if (jsonArray.value) {
    return [...new Set(jsonArray.value.map((item: Item) => item.step))];
  }
  return [];
});

const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const doFilter = () => {
  const graphInstance = graphRef$.value!.getInstance();
  const _all_nodes = graphInstance.getNodes();

  _all_nodes.forEach(thisNode => {
    let _isHideThisLine = false;
    if (selectedSearchType.value) {
      if (thisNode["type"] !== selectedSearchType.value) {
        _isHideThisLine = true;
      }
    }
    thisNode.opacity = _isHideThisLine? 0.5 : 1;
  });


  graphInstance.dataUpdated();
//

};



</script>

<style scoped>
/* 样式可以根据需要进行调整 */
.el-form-item {
  display: flex;
  align-items: center;
}

.el-button {
  margin-left: 10px;
}

.upload-section {
  margin-bottom: 20px;
}

.settings-section {
  margin-bottom: 20px;
}

.sidebar {
  padding: 15px;
  background-color: #f4f4f4;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.legend-color {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.legend-label {
  font-size: 14px;
}

.clicked-content {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ffffff; /* 白色背景 */
  border-radius: 8px; /* 圆角边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影效果 */
  padding: 10px 15px; /* 内边距 */
  z-index: 10;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 字体 */
  font-size: 14px;
  color: #333333; /* 文字颜色 */
  transition: all 0.3s ease; /* 过渡效果 */
}

.clicked-content:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* 鼠标悬停时阴影加深 */
  transform: translateY(-2px); /* 鼠标悬停时轻微上移 */
}

::v-deep(.relation-graph) {
  .c-rg-line,.c-rg-line-path {
    filter: drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px);
    stroke: rgb(0, 0, 0) !important;
    stroke-dasharray: 1148.41;
    stroke-dashoffset: 99px;
    animation-name: myAnimation;
    animation-duration: 3s;
    animation-iteration-count: infinite;
  }
}

.c-round {

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 60px;
  height: 60px;

  border-radius: 50%;

  //background-color: #f5f5f5;

  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);

  font-size: 4px;
  color: #333;

}

h1 {
  color: #4285f4;

}

h2 {
  color: #4285f4;

}
</style>
