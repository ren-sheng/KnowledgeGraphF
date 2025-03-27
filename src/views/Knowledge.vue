<template>
  <div class="knowledge-container">
    <!-- <div class="header">
      <h2>学科知识发展脉络</h2>
      <p class="subtitle">选择您感兴趣的研究领域，探索其发展历程</p>
    </div> -->

    <div class="main-content">
      <el-row :gutter="20">
        <!-- 左侧领域树 -->
        <el-col :span="6">
          <el-card class="tree-card">
            <template #header>
              <div class="card-header">
                <span>学科领域</span>
              </div>
            </template>
            <el-tree
                ref="treeRef"
                :data="fields"
                :props="defaultProps"
                @node-click="handleNodeClick"
                :highlight-current="true"
                node-key="id"
            />
          </el-card>
        </el-col>

        <!-- 右侧选中的领域信息 -->
        <el-col :span="18">
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <span>{{ selectedField ? selectedField.label : '学科知识发展脉络' }}</span>
              </div>
            </template>
            <div class="field-info">
              <template v-if="selectedField">
                <template v-if="isComputerScience">
                  <p class="field-description">{{ selectedField.description }}</p>
                  <div class="field-stats" v-if="selectedField.stats">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="stat-item">
                          <div class="stat-value">{{ selectedField.stats.papers }}</div>
                          <div class="stat-label">相关论文</div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="stat-item">
                          <div class="stat-value">{{ selectedField.stats.researchers }}</div>
                          <div class="stat-label">活跃研究者</div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="stat-item">
                          <div class="stat-value">{{ selectedField.stats.institutions }}</div>
                          <div class="stat-label">研究机构</div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <!-- 修改知识图谱部分的结构，参考Expert组件 -->
                  <el-card style="width: 100%; height: 500px; margin-top: 20px;">
                    <div class="icon-text-inline" style="margin-bottom: 16px;">
                      <el-icon style="font-size: 20px">
                        <Share/>
                      </el-icon>
                      <strong style="font-size: 20px">&nbsp;&nbsp;知识发展图谱</strong>
                    </div>
                    <div style="width: 100%; height: 400px;">
                      <RelationGraph
                          ref="graphRef"
                          :options="graphOptions"
                          @node-click="onNodeClick"
                          @line-click="onLineClick"
                      />
                    </div>
                  </el-card>
                </template>
                <template v-else>
                  <p class="field-description">{{ selectedField.description }}</p>
                  <div class="field-stats" v-if="selectedField.stats">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <div class="stat-item">
                          <div class="stat-value">{{ selectedField.stats.papers }}</div>
                          <div class="stat-label">相关论文</div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="stat-item">
                          <div class="stat-value">{{ selectedField.stats.researchers }}</div>
                          <div class="stat-label">活跃研究者</div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="stat-item">
                          <div class="stat-value">{{ selectedField.stats.institutions }}</div>
                          <div class="stat-label">研究机构</div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="organizing-content">
                    <el-empty description="该学科信息正在整理中..."/>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="welcome-content">
                  <h3>欢迎探索学科知识发展脉络</h3>
                  <p>请从左侧选择感兴趣的学科领域，了解其发展历程和研究现状。</p>
                  <ul>
                    <li>浏览不同学科分类</li>
                    <li>查看详细学科信息</li>
                    <li>探索学科发展轨迹</li>
                    <li>了解研究数据统计</li>
                  </ul>
                </div>
              </template>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import RelationGraph from 'relation-graph-vue3'
import {Share} from '@element-plus/icons-vue'

const router = useRouter()
const selectedField = ref(null)

// 学科领域数据
const fields = [
  {
    id: '01',
    label: '哲学',
    description: '研究人类思维、认知和价值观的基础学科。',
    children: [
      {
        id: '0101',
        label: '哲学',
        description: '探讨人类思维、存在、知识、价值、心灵等根本问题的学科。',
        isLeaf: true,
        stats: {
          papers: '50,000+',
          researchers: '20,000+',
          institutions: '500+'
        }
      }
    ]
  },
  {
    id: '02',
    label: '经济学',
    description: '研究经济活动规律和经济关系的社会科学。',
    children: [
      {
        id: '0201',
        label: '理论经济学',
        description: '研究经济运行基本规律和一般性原理的经济学分支。',
        isLeaf: true,
        stats: {
          papers: '80,000+',
          researchers: '30,000+',
          institutions: '800+'
        }
      },
      {
        id: '0202',
        label: '应用经济学',
        description: '研究经济理论在实际问题中的应用。',
        isLeaf: true,
        stats: {
          papers: '100,000+',
          researchers: '40,000+',
          institutions: '900+'
        }
      }
    ]
  },
  {
    id: '03',
    label: '法学',
    description: '研究法律规范、法律现象和法律关系的社会科学。',
    children: [
      {
        id: '0301',
        label: '法学',
        description: '研究法律体系和法律实践的基础学科。',
        isLeaf: true,
        stats: {
          papers: '70,000+',
          researchers: '25,000+',
          institutions: '600+'
        }
      },
      {
        id: '0302',
        label: '政治学',
        description: '研究政治制度、政治行为和政治思想的学科。',
        isLeaf: true,
        stats: {
          papers: '60,000+',
          researchers: '20,000+',
          institutions: '500+'
        }
      },
      {
        id: '0303',
        label: '社会学',
        description: '研究人类社会结构和社会行为的学科。',
        isLeaf: true,
        stats: {
          papers: '65,000+',
          researchers: '22,000+',
          institutions: '550+'
        }
      },
      {
        id: '0304',
        label: '民族学',
        description: '研究民族问题和民族关系的学科。',
        isLeaf: true,
        stats: {
          papers: '40,000+',
          researchers: '15,000+',
          institutions: '400+'
        }
      },
      {
        id: '0305',
        label: '马克思主义理论',
        description: '研究马克思主义基本原理及其发展的学科。',
        isLeaf: true,
        stats: {
          papers: '55,000+',
          researchers: '18,000+',
          institutions: '450+'
        }
      },
      {
        id: '0306',
        label: '公安学',
        description: '研究公共安全理论与实践的学科。',
        isLeaf: true,
        stats: {
          papers: '35,000+',
          researchers: '12,000+',
          institutions: '300+'
        }
      }
    ]
  },
  {
    id: '04',
    label: '教育学',
    description: '研究教育现象、教育问题和教育规律的学科。',
    children: [
      {
        id: '0401',
        label: '教育学',
        description: '研究教育基本理论和实践的学科。',
        isLeaf: true,
        stats: {
          papers: '75,000+',
          researchers: '28,000+',
          institutions: '700+'
        }
      },
      {
        id: '0402',
        label: '心理学',
        description: '研究人类心理现象和行为规律的学科。',
        isLeaf: true,
        stats: {
          papers: '85,000+',
          researchers: '32,000+',
          institutions: '750+'
        }
      },
      {
        id: '0403',
        label: '体育学',
        description: '研究体育运动和身体教育的学科。',
        isLeaf: true,
        stats: {
          papers: '45,000+',
          researchers: '16,000+',
          institutions: '400+'
        }
      }
    ]
  },
  {
    id: '05',
    label: '文学',
    description: '研究语言文字及其文化表现形式的学科。',
    children: [
      {
        id: '0501',
        label: '中国语言文学',
        description: '研究中国语言、文字和文学的学科。',
        isLeaf: true,
        stats: {
          papers: '90,000+',
          researchers: '35,000+',
          institutions: '800+'
        }
      },
      {
        id: '0502',
        label: '外国语言文学',
        description: '研究外国语言和文学的学科。',
        isLeaf: true,
        stats: {
          papers: '85,000+',
          researchers: '32,000+',
          institutions: '750+'
        }
      },
      {
        id: '0503',
        label: '新闻传播学',
        description: '研究新闻传播理论与实践的学科。',
        isLeaf: true,
        stats: {
          papers: '70,000+',
          researchers: '25,000+',
          institutions: '600+'
        }
      }
    ]
  },
  {
    id: '06',
    label: '历史学',
    description: '研究人类社会历史发展的学科。',
    children: [
      {
        id: '0601',
        label: '考古学',
        description: '研究人类历史文化遗存的学科。',
        isLeaf: true,
        stats: {
          papers: '45,000+',
          researchers: '15,000+',
          institutions: '400+'
        }
      },
      {
        id: '0602',
        label: '中国史',
        description: '研究中国历史发展进程的学科。',
        isLeaf: true,
        stats: {
          papers: '95,000+',
          researchers: '38,000+',
          institutions: '850+'
        }
      },
      {
        id: '0603',
        label: '世界史',
        description: '研究世界各国历史发展的学科。',
        isLeaf: true,
        stats: {
          papers: '80,000+',
          researchers: '30,000+',
          institutions: '700+'
        }
      }
    ]
  },
  {
    id: '07',
    label: '理学',
    description: '研究自然现象和规律的基础科学。',
    children: [
      {
        id: '0701',
        label: '数学',
        description: '研究数量关系和空间形式的科学。',
        isLeaf: true,
        stats: {
          papers: '150,000+',
          researchers: '50,000+',
          institutions: '1,000+'
        }
      },
      {
        id: '0702',
        label: '物理学',
        description: '研究物质的基本结构、相互作用及其运动规律的科学。',
        isLeaf: true,
        stats: {
          papers: '180,000+',
          researchers: '60,000+',
          institutions: '1,200+'
        }
      },
      {
        id: '0703',
        label: '化学',
        description: '研究物质的组成、结构、性质及其变化规律的科学。',
        isLeaf: true,
        stats: {
          papers: '170,000+',
          researchers: '55,000+',
          institutions: '1,100+'
        }
      },
      {
        id: '0704',
        label: '天文学',
        description: '研究宇宙天体、现象及其发展规律的科学。',
        isLeaf: true,
        stats: {
          papers: '40,000+',
          researchers: '12,000+',
          institutions: '300+'
        }
      },
      {
        id: '0705',
        label: '地理学',
        description: '研究地球表层自然和人文现象的科学。',
        isLeaf: true,
        stats: {
          papers: '65,000+',
          researchers: '22,000+',
          institutions: '550+'
        }
      },
      {
        id: '0706',
        label: '大气科学',
        description: '研究大气现象和规律的科学。',
        isLeaf: true,
        stats: {
          papers: '45,000+',
          researchers: '15,000+',
          institutions: '400+'
        }
      },
      {
        id: '0707',
        label: '海洋科学',
        description: '研究海洋现象和规律的科学。',
        isLeaf: true,
        stats: {
          papers: '50,000+',
          researchers: '18,000+',
          institutions: '450+'
        }
      },
      {
        id: '0708',
        label: '地球物理学',
        description: '研究地球物理现象和规律的科学。',
        isLeaf: true,
        stats: {
          papers: '55,000+',
          researchers: '20,000+',
          institutions: '500+'
        }
      },
      {
        id: '0709',
        label: '地质学',
        description: '研究地球的物质组成、结构和演化的科学。',
        isLeaf: true,
        stats: {
          papers: '60,000+',
          researchers: '22,000+',
          institutions: '550+'
        }
      },
      {
        id: '0710',
        label: '生物学',
        description: '研究生命现象和规律的科学。',
        isLeaf: true,
        stats: {
          papers: '200,000+',
          researchers: '70,000+',
          institutions: '1,500+'
        }
      },
      {
        id: '0711',
        label: '系统科学',
        description: '研究系统的结构、功能和演化规律的科学。',
        isLeaf: true,
        stats: {
          papers: '45,000+',
          researchers: '15,000+',
          institutions: '400+'
        }
      },
      {
        id: '0712',
        label: '科学技术史',
        description: '研究科学技术发展历史的学科。',
        isLeaf: true,
        stats: {
          papers: '30,000+',
          researchers: '10,000+',
          institutions: '300+'
        }
      },
      {
        id: '0713',
        label: '生态学',
        description: '研究生物与环境相互关系的科学。',
        isLeaf: true,
        stats: {
          papers: '80,000+',
          researchers: '28,000+',
          institutions: '700+'
        }
      },
      {
        id: '0714',
        label: '统计学',
        description: '研究数据收集、分析和推断的科学。',
        isLeaf: true,
        stats: {
          papers: '70,000+',
          researchers: '25,000+',
          institutions: '600+'
        }
      }
    ]
  },
  {
    id: '08',
    label: '工学',
    description: '应用自然科学原理解决实际工程问题的学科。',
    children: [
      {
        id: '0801',
        label: '力学',
        description: '研究物体运动和变形规律的学科。',
        isLeaf: true,
        stats: {
          papers: '120,000+',
          researchers: '40,000+',
          institutions: '900+'
        }
      },
      {
        id: '0802',
        label: '机械工程',
        description: '研究机械设计、制造和应用的工程学科。',
        isLeaf: true,
        stats: {
          papers: '180,000+',
          researchers: '65,000+',
          institutions: '1,200+'
        }
      },
      {
        id: '0803',
        label: '光学工程',
        description: '研究光学系统设计和应用的工程学科。',
        isLeaf: true,
        stats: {
          papers: '90,000+',
          researchers: '30,000+',
          institutions: '700+'
        }
      },
      {
        id: '0804',
        label: '仪器科学与技术',
        description: '研究测量仪器设计和应用的学科。',
        isLeaf: true,
        stats: {
          papers: '85,000+',
          researchers: '28,000+',
          institutions: '650+'
        }
      },
      {
        id: '0805',
        label: '材料科学与工程',
        description: '研究材料性能和应用的工程学科。',
        isLeaf: true,
        stats: {
          papers: '200,000+',
          researchers: '70,000+',
          institutions: '1,300+'
        }
      },
      {
        id: '0806',
        label: '冶金工程',
        description: '研究金属冶炼和加工的工程学科。',
        isLeaf: true,
        stats: {
          papers: '95,000+',
          researchers: '32,000+',
          institutions: '750+'
        }
      },
      {
        id: '0807',
        label: '动力工程及工程热物理',
        description: '研究能量转换和利用的工程学科。',
        isLeaf: true,
        stats: {
          papers: '110,000+',
          researchers: '38,000+',
          institutions: '850+'
        }
      },
      {
        id: '0808',
        label: '电气工程',
        description: '研究电能转换和应用的工程学科。',
        isLeaf: true,
        stats: {
          papers: '150,000+',
          researchers: '50,000+',
          institutions: '1,000+'
        }
      },
      {
        id: '0809',
        label: '电子科学与技术',
        description: '研究电子器件和系统的工程学科。',
        isLeaf: true,
        stats: {
          papers: '180,000+',
          researchers: '60,000+',
          institutions: '1,100+'
        }
      },
      {
        id: '0810',
        label: '信息与通信工程',
        description: '研究信息传输和处理的工程学科。',
        isLeaf: true,
        stats: {
          papers: '190,000+',
          researchers: '65,000+',
          institutions: '1,200+'
        }
      },
      {
        id: '0811',
        label: '控制科学与工程',
        description: '研究系统控制理论和技术的工程学科。',
        isLeaf: true,
        stats: {
          papers: '160,000+',
          researchers: '55,000+',
          institutions: '1,000+'
        }
      },
      {
        id: '0812',
        label: '计算机科学与技术',
        description: '研究计算机系统的设计、开发和应用的综合性学科。',
        children: [
          {
            id: '081201',
            label: '计算机视觉',
            description: '研究如何使计算机理解和处理数字图像和视频的领域。',
            isLeaf: true,
            stats: {
              papers: '150,000+',
              researchers: '50,000+',
              institutions: '1,000+'
            }
          },
          {
            id: '081202',
            label: '自然语言处理',
            description: '研究计算机与人类语言交互的技术。',
            isLeaf: true,
            stats: {
              papers: '180,000+',
              researchers: '55,000+',
              institutions: '1,100+'
            }
          }
        ]
      },
      {
        id: '0835',
        label: '软件工程',
        description: '研究软件开发方法、工具和管理的工程学科。',
        isLeaf: true,
        stats: {
          papers: '170,000+',
          researchers: '58,000+',
          institutions: '1,050+'
        }
      }
    ]
  },
  {
    id: '09',
    label: '农学',
    description: '研究农业生产和发展的综合性学科。',
    children: [
      {
        id: '0901',
        label: '作物学',
        description: '研究作物栽培和育种的学科。',
        isLeaf: true,
        stats: {
          papers: '85,000+',
          researchers: '30,000+',
          institutions: '700+'
        }
      },
      {
        id: '0902',
        label: '园艺学',
        description: '研究园艺植物栽培和育种的学科。',
        isLeaf: true,
        stats: {
          papers: '75,000+',
          researchers: '25,000+',
          institutions: '600+'
        }
      },
      {
        id: '0903',
        label: '农业资源与环境',
        description: '研究农业资源利用和环境保护的学科。',
        isLeaf: true,
        stats: {
          papers: '90,000+',
          researchers: '32,000+',
          institutions: '750+'
        }
      },
      {
        id: '0904',
        label: '植物保护',
        description: '研究植物病虫害防治的学科。',
        isLeaf: true,
        stats: {
          papers: '80,000+',
          researchers: '28,000+',
          institutions: '650+'
        }
      },
      {
        id: '0905',
        label: '畜牧学',
        description: '研究家畜饲养和育种的学科。',
        isLeaf: true,
        stats: {
          papers: '95,000+',
          researchers: '35,000+',
          institutions: '800+'
        }
      },
      {
        id: '0906',
        label: '兽医学',
        description: '研究动物疾病防治的学科。',
        isLeaf: true,
        stats: {
          papers: '88,000+',
          researchers: '30,000+',
          institutions: '700+'
        }
      },
      {
        id: '0907',
        label: '林学',
        description: '研究森林培育和保护的学科。',
        isLeaf: true,
        stats: {
          papers: '70,000+',
          researchers: '25,000+',
          institutions: '600+'
        }
      },
      {
        id: '0908',
        label: '水产',
        description: '研究水产养殖和捕捞的学科。',
        isLeaf: true,
        stats: {
          papers: '65,000+',
          researchers: '22,000+',
          institutions: '550+'
        }
      },
      {
        id: '0909',
        label: '草学',
        description: '研究草地资源利用和保护的学科。',
        isLeaf: true,
        stats: {
          papers: '45,000+',
          researchers: '15,000+',
          institutions: '400+'
        }
      }
    ]
  },
  {
    id: '10',
    label: '医学',
    description: '研究人体健康、疾病预防和治疗的科学。',
    children: [
      {
        id: '1001',
        label: '基础医学',
        description: '研究人体结构、功能和疾病发生机制的医学基础学科。',
        isLeaf: true,
        stats: {
          papers: '180,000+',
          researchers: '60,000+',
          institutions: '1,200+'
        }
      },
      {
        id: '1002',
        label: '临床医学',
        description: '研究疾病的诊断、治疗和预防的医学分支。',
        isLeaf: true,
        stats: {
          papers: '250,000+',
          researchers: '80,000+',
          institutions: '1,500+'
        }
      },
      {
        id: '1003',
        label: '口腔医学',
        description: '研究口腔疾病的预防和治疗的医学分支。',
        isLeaf: true,
        stats: {
          papers: '90,000+',
          researchers: '30,000+',
          institutions: '700+'
        }
      },
      {
        id: '1004',
        label: '公共卫生与预防医学',
        description: '研究人群健康和疾病预防的医学分支。',
        isLeaf: true,
        stats: {
          papers: '120,000+',
          researchers: '40,000+',
          institutions: '900+'
        }
      },
      {
        id: '1005',
        label: '中医学',
        description: '研究中医理论和实践的传统医学。',
        isLeaf: true,
        stats: {
          papers: '150,000+',
          researchers: '50,000+',
          institutions: '1,000+'
        }
      },
      {
        id: '1006',
        label: '中西医结合',
        description: '研究中医与西医结合应用的医学分支。',
        isLeaf: true,
        stats: {
          papers: '100,000+',
          researchers: '35,000+',
          institutions: '700+'
        }
      }
    ]
  },
  {
    id: '11',
    label: '军事学',
    description: '研究军事理论和实践的综合性学科。',
    children: [
      {
        id: '1101',
        label: '军事思想及军事历史',
        description: '研究军事理论发展和历史经验的学科。',
        isLeaf: true,
        stats: {
          papers: '45,000+',
          researchers: '15,000+',
          institutions: '300+'
        }
      },
      {
        id: '1102',
        label: '战略学',
        description: '研究军事战略理论和实践的学科。',
        isLeaf: true,
        stats: {
          papers: '40,000+',
          researchers: '12,000+',
          institutions: '250+'
        }
      },
      {
        id: '1103',
        label: '战役学',
        description: '研究军事战役指挥和实施的学科。',
        isLeaf: true,
        stats: {
          papers: '35,000+',
          researchers: '10,000+',
          institutions: '200+'
        }
      },
      {
        id: '1104',
        label: '战术学',
        description: '研究军事战术运用的学科。',
        isLeaf: true,
        stats: {
          papers: '38,000+',
          researchers: '11,000+',
          institutions: '220+'
        }
      }
    ]
  },
  {
    id: '12',
    label: '管理学',
    description: '研究组织管理理论和实践的综合性学科。',
    children: [
      {
        id: '1201',
        label: '管理科学与工程',
        description: '研究管理理论和方法的综合性学科。',
        isLeaf: true,
        stats: {
          papers: '120,000+',
          researchers: '40,000+',
          institutions: '900+'
        }
      },
      {
        id: '1202',
        label: '工商管理',
        description: '研究企业经营管理的学科。',
        isLeaf: true,
        stats: {
          papers: '150,000+',
          researchers: '50,000+',
          institutions: '1,000+'
        }
      },
      {
        id: '1203',
        label: '农林经济管理',
        description: '研究农林业经济管理的学科。',
        isLeaf: true,
        stats: {
          papers: '80,000+',
          researchers: '25,000+',
          institutions: '600+'
        }
      },
      {
        id: '1204',
        label: '公共管理',
        description: '研究公共事务管理的学科。',
        isLeaf: true,
        stats: {
          papers: '100,000+',
          researchers: '35,000+',
          institutions: '800+'
        }
      }
    ]
  },
  {
    id: '13',
    label: '艺术学',
    description: '研究艺术创作和理论的综合性学科。',
    children: [
      {
        id: '1301',
        label: '艺术学理论',
        description: '研究艺术基础理论的学科。',
        isLeaf: true,
        stats: {
          papers: '60,000+',
          researchers: '20,000+',
          institutions: '500+'
        }
      },
      {
        id: '1302',
        label: '音乐与舞蹈学',
        description: '研究音乐和舞蹈艺术的学科。',
        isLeaf: true,
        stats: {
          papers: '70,000+',
          researchers: '25,000+',
          institutions: '600+'
        }
      },
      {
        id: '1303',
        label: '戏剧与影视学',
        description: '研究戏剧和影视艺术的学科。',
        isLeaf: true,
        stats: {
          papers: '75,000+',
          researchers: '28,000+',
          institutions: '650+'
        }
      },
      {
        id: '1304',
        label: '美术学',
        description: '研究美术创作和理论的学科。',
        isLeaf: true,
        stats: {
          papers: '65,000+',
          researchers: '22,000+',
          institutions: '550+'
        }
      }
    ]
  },
  {
    id: '14',
    label: '交叉学科',
    description: '跨越传统学科界限的新兴研究领域。',
    children: [
      {
        id: '1401',
        label: '集成电路科学与工程',
        description: '研究集成电路设计和制造的交叉学科。',
        isLeaf: true,
        stats: {
          papers: '140,000+',
          researchers: '45,000+',
          institutions: '900+'
        }
      },
      {
        id: '1402',
        label: '国家安全学',
        description: '研究国家安全理论和实践的交叉学科。',
        isLeaf: true,
        stats: {
          papers: '50,000+',
          researchers: '18,000+',
          institutions: '400+'
        }
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}

// 处理节点点击
const handleNodeClick = (data) => {
  selectedField.value = data
}

// 查看发展脉络
const viewEvolution = () => {
  if (selectedField.value && selectedField.value.isLeaf) {
    // 这里可以跳转到具体的发展脉络页面
    router.push(`/knowledge/evolution/${selectedField.value.id}`)
  }
}

// 判断是否为计算机科学与技术相关节点
const isComputerScience = computed(() => {
  if (!selectedField.value) return false
  // 检查是否为计算机科学与技术(0812)或其子节点
  return selectedField.value.id === '0812' ||
      selectedField.value.id.startsWith('0812')
})

// 图谱配置
const graphRef = ref(null)
const graphOptions = {
  debug: false,
  defaultNodeBorderWidth: 2,
  allowSwitchLineShape: true,
  allowSwitchJunctionPoint: true,
  defaultLineShape: 1,
  layout: {
    layoutName: 'force',
    force: {
      edgeLength: [200, 250],
      gravity: 0.1,
      repulsion: 1000,
      nodeStrength: 30,
      edgeStrength: 0.1,
      layoutWidth: 800,
      layoutHeight: 400
    }
  },
  defaultJunctionPoint: 'border',
  defaultNodeWidth: 100,
  defaultNodeHeight: 40,
  defaultNodeFontSize: 14,
  defaultLineWidth: 2,
  defaultNodeShape: 0
}

// 计算机视觉知识图谱数据
const __graph_json_data = {
  rootId: 'kaiming',
  nodes: [
    // 核心人物（橙色）
    {id: 'kaiming', text: 'He Kaiming', color: 'orange'}, // ResNet/Mask R-CNN
    {id: 'lecun', text: 'Yann LeCun', color: 'orange'},    // CNN先驱
    {id: 'hinton', text: 'Geoffrey Hinton', color: 'orange'}, // AlexNet顾问
    {id: 'feifei', text: 'Fei-Fei Li', color: 'orange'},   // ImageNet

    // 关键技术（蓝色）
    {id: 'alexnet', text: 'AlexNet', color: '#6fa8dc'},
    {id: 'resnet', text: 'ResNet', color: '#6fa8dc'},
    {id: 'gan', text: 'GAN', color: '#6fa8dc'},
    {id: 'vit', text: 'ViT', color: '#6fa8dc'},

    // 经典论文（绿色）
    {id: 'paper1', text: 'ImageNet Classification...', color: '#93c47d'}, // AlexNet论文
    {id: 'paper2', text: 'Deep Residual Learning...', color: '#93c47d'}, // ResNet论文

    // 数据集（紫色）
    {id: 'imagenet', text: 'ImageNet', color: '#b4a7d6'},

    // 理论/方向（灰色）
    {id: 'marr', text: 'Marr Theory', color: '#cccccc'}, // David Marr理论
    {id: 'multimodal', text: 'Multimodal', color: '#cccccc'} // 多模态方向
  ],
  lines: [
    // 人物-技术关系
    {from: 'kaiming', to: 'resnet'},
    {from: 'lecun', to: 'alexnet'},
    {from: 'hinton', to: 'alexnet'},
    {from: 'feifei', to: 'imagenet'},

    // 技术-论文关系
    {from: 'alexnet', to: 'paper1'},
    {from: 'resnet', to: 'paper2'},

    // 技术衍生关系
    {from: 'alexnet', to: 'resnet'},
    {from: 'resnet', to: 'vit'},
    {from: 'gan', to: 'multimodal'},

    // 理论基础
    {from: 'marr', to: 'alexnet'}
  ]
};

// 修改图谱初始化时机
watch(() => selectedField.value, async (newField) => {
  if (newField && isComputerScience.value) {
    await nextTick()
    showGraph()
  }
})

// 修改showGraph函数
const showGraph = async () => {
  try {
    const graphInstance = graphRef.value?.getInstance()
    if (graphInstance) {
      await graphInstance.setJsonData(__graph_json_data)

      // 延迟执行布局调整
      setTimeout(async () => {
        await graphInstance.moveToCenter()
        await graphInstance.setZoom(1) // 调整缩放比例
      }, 300)
    }
  } catch (error) {
    console.error('Error showing graph:', error)
  }
}

// 节点点击事件
const onNodeClick = (nodeObject, $event) => {
  console.log('Node clicked:', nodeObject)
}

// 连线点击事件
const onLineClick = (lineObject, linkObject, $event) => {
  console.log('Line clicked:', lineObject)
}

// 在计算机视觉相关页面加载时显示图谱
onMounted(() => {
  if (isComputerScience.value) {
    nextTick(() => {
      showGraph()
    })
  }
})
</script>

<style scoped>
.knowledge-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 120px);
  box-sizing: border-box;
  overflow: hidden;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  color: #409EFF;
  font-size: 28px;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.main-content {
  height: 100%;
  box-sizing: border-box;
}

.el-row {
  height: 100%;
  margin: 0 !important;
}

.el-col {
  height: 100%;
  padding: 0 10px !important;
}

.tree-card, .info-card {
  height: 100%;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 调整树形组件容器 */
:deep(.el-tree) {
  height: auto !important; /* 移除固定高度 */
  min-height: 0; /* 允许内容自适应 */
  padding: 10px;
  overflow: auto;
}

/* 调整卡片内容区域 */
.tree-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.info-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-info {
  padding: 20px;
}

.field-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.field-stats {
  margin-top: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

:deep(.el-tree-node) {
  white-space: nowrap;
}

:deep(.el-tree-node__content) {
  height: 40px;
  font-size: 16px;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #ecf5ff;
  color: #409EFF;
}

.welcome-content {
  padding: 20px;
  text-align: center;
}

.welcome-content h3 {
  color: #409EFF;
  margin-bottom: 20px;
  font-size: 24px;
}

.welcome-content p {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.6;
}

.welcome-content ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.welcome-content li {
  background-color: #f8f9fa;
  padding: 15px 25px;
  border-radius: 8px;
  color: #666;
  font-size: 16px;
}

.organizing-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  margin-top: 30px;
  border-top: 1px solid #ebeef5;
  padding-top: 30px;
}

.icon-text-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 添加图谱节点样式 */
:deep(.relation-graph-node) {
  background-color: #fff;
  border: 2px solid;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  line-height: 1.2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.relation-graph-node:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

:deep(.relation-graph-line) {
  transition: all 0.3s ease;
}

:deep(.relation-graph-line:hover) {
  stroke-width: 3px;
}
</style>