<template>
  <div class="container1">
    <!-- 搜索框-->
    <el-container class="search-container">
      <el-form class="demo-dynamic">
        <el-form-item>
          <!-- 默认有 24 个栅格 -->
          <el-col :span="3" :offset="0">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button type="primary" style="width: 100px">
                {{ thesisInf }}
                <el-icon class="el-icon--right">
                  <arrow-down/>
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="a">论文名称</el-dropdown-item>
                  <el-dropdown-item command="b">作者</el-dropdown-item>
                  <el-dropdown-item command="c">出版年份</el-dropdown-item>
                  <el-dropdown-item command="d">文献摘要</el-dropdown-item>
                  <el-dropdown-item command="e">DOI</el-dropdown-item>
                  <el-dropdown-item command="f">期刊</el-dropdown-item>
                  <el-dropdown-item command="g">文献类型</el-dropdown-item>
                  <el-dropdown-item command="h">出版社</el-dropdown-item>
                  <el-dropdown-item command="i">学科领域</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
          <el-col :span="15" :offset="0">
            <el-autocomplete
                v-model="searchQuery"
                :fetch-suggestions="querySearch"
                placeholder="请输入搜索内容："
                suffix-icon="el-icon-search"
                class="searchBox"
                @select="handleSelect"
            >
              <!-- 用来自定义提示项的显示的插槽 -->
              <template v-slot:default="{ item }">
                <span>{{ item.TI }}</span>
              </template>
            </el-autocomplete>
          </el-col>
          <el-col :span="6" :offset="0">
            <el-button
                type="primary"
                plain
                @click="submitForm('dynamicValidateForm')"
                style="margin-left: 20px;"
            >在结果中搜索
            </el-button>

            <el-button
                type="primary"
                plain
                @click="submitForm('dynamicValidateForm')"
            >重新搜索
            </el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-container>
    <!--        <el-container>-->
    <!--          <div class="searchContinue">-->
    <!--            <div class="limited-width">{{ thesisInf }}:{{ searchQuery }}</div>-->
    <!--          </div>-->
    <!--        </el-container>-->
    <el-container>

      <el-main>
        <!-- 此处用于展示某一论文与之相关的引文网络 -->

        <div class="drag-container" ref="container">
          <el-card class="left-panel" style="width: 35%;height: 100%" always>
            <el-table :data="nodes" style="width: 100%" :row-class-name="tableRowClassName"
                      @row-click="handleRowClick"
                      @row-mouseover="handleRowMouseover"
                      @row-mouseout="handleRowMouseout"
                      max-height="100vh">
              <el-table-column class="thead" label="搜索结果">
                <template #default="scope">
                  <div>
                    <div class="paper-title">{{ scope.row.TI }}</div>
                    <div class="paper-authors">{{ scope.row.AU }}</div>
                    <div class="paper-meta">{{ scope.row.PY }}</div>
                    <div class="abstract-container" :class="{ expanded: scope.row.isExpanded }">
                      <div class="abstract-content">{{ scope.row.AB }}</div>
                      <button class="abstract-toggle" @click.stop="toggleAbstract(scope.row)">
                        {{ scope.row.isExpanded ? '收起摘要' : '展开摘要' }}
                      </button>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <!-- 此处用于展示论文知识图谱 -->
          <el-card class="graph-panel" style="width: 63%;height: 100%" always>
            <div style="width:100%;height:calc(100vh);">
              <RelationGraph ref="graphRef" :options="graphOptions" @node-click="onNodeClick"
                             @line-click="onLineClick"/>
            </div>
          </el-card>
        </div>
        <div id="graph-container"></div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
// 从Vue中解构出需要的函数和方法
import {onMounted, ref} from "vue";
import {ArrowDown} from "@element-plus/icons-vue";
import RelationGraph from "relation-graph-vue3";

// 响应式数据
const thesisInf = ref("论文名称");
const searchQuery = ref("");
const leftPanelVisible = ref(true);
const rightPanelVisible = ref(true);
const leftFlex = ref("35%");
const middleFlex = ref("65%");
const rightFlex = ref("28%");
const nodes = ref([
  {
    id: 1,
    nodeCircle: 20,
    nodeOpacity: 1,
    isExpanded: false,
    TI: "Symptom Resolution and Recurrence Outcomes after Partial Versus Total Laparoscopic Adrenalectomy: 13 years of Experience with Medium-Long Term Follow up",
    AU: "Knochel, AD; Jordan, AM",
    PY: "2021",
    Z9: "90",
    AB: "Mill defines utilitarianism as the combination of a theory of life and a moral claim: only pleasure and freedom from pain are desirable as ends, and the promotion of happiness is the sole goal of moral action. So defined, utilitarianism is open to ad hominem pessimistic objection: a theory of life which entails the impossibility of happiness fits poorly with a morality centered on its promotion. The first two challenges Mill confronts in Utilitarianism share this pessimistic structure. Interestingly, however, these challenges paint inverted pictures of the best utilitarian life: one suggests this life is satisfying but ignoble, the other that it is noble but unsatisfying. I explain Mill's treatment of both challenges as genuinely pessimistic interpretations of utilitarianism's theory of life. Read through the lens of Mill's engagement with pessimism, these challenges point to distinctive conceptions of dignity and satisfaction that play a significant role in Mill's ethics.",
    DT: "Journal Article",
    PU: "Springer",
    WC: "Computer Science",
    CR: "Smith, J. et al. (2020). A Study on Artificial Intelligence.",
    DI: "10.1007/s11280-020-00776-5"
  },
  {
    id: 2,
    nodeCircle: 5,
    nodeOpacity: 0.6,
    isExpanded: false,
    TI: "Symptom Resolution and Recurrence Outcomes after Partial Versus Total Laparoscopic Adrenalectomy: 13 years of Experience with Medium-Long Term Follow up",
    AU: "Knochel, AD; Jordan, AM",
    PY: "2021",
    Z9: "90",
    AB: "Mill defines utilitarianism as the combination of a theory of life and a moral claim: only pleasure and freedom from pain are desirable as ends, and the promotion of happiness is the sole goal of moral action. So defined, utilitarianism is open to ad hominem pessimistic objection: a theory of life which entails the impossibility of happiness fits poorly with a morality centered on its promotion. The first two challenges Mill confronts in Utilitarianism share this pessimistic structure. Interestingly, however, these challenges paint inverted pictures of the best utilitarian life: one suggests this life is satisfying but ignoble, the other that it is noble but unsatisfying. I explain Mill's treatment of both challenges as genuinely pessimistic interpretations of utilitarianism's theory of life. Read through the lens of Mill's engagement with pessimism, these challenges point to distinctive conceptions of dignity and satisfaction that play a significant role in Mill's ethics.",
    DT: "Journal Article",
    PU: "Springer",
    WC: "Computer Science",
    CR: "Smith, J. et al. (2020). A Study on Artificial Intelligence.",
    DI: "10.1007/s11280-020-00776-5"
  },
  {
    id: 4,
    nodeCircle: 25,
    nodeOpacity: 0.8,
    isExpanded: false,
    TI: "Introducing the POPVESL Score for Intrarenal Vascular Complications of Percutaneous Nephrolithotomy: Experience from a Single high-volume Referral Center",
    AU: "Knochel, AD; Jordan, AM",
    PY: "2021",
    Z9: "90",
    AB: "Mill defines utilitarianism as the combination of a theory of life and a moral claim: only pleasure and freedom from pain are desirable as ends, and the promotion of happiness is the sole goal of moral action. So defined, utilitarianism is open to ad hominem pessimistic objection: a theory of life which entails the impossibility of happiness fits poorly with a morality centered on its promotion. The first two challenges Mill confronts in Utilitarianism share this pessimistic structure. Interestingly, however, these challenges paint inverted pictures of the best utilitarian life: one suggests this life is satisfying but ignoble, the other that it is noble but unsatisfying. I explain Mill's treatment of both challenges as genuinely pessimistic interpretations of utilitarianism's theory of life. Read through the lens of Mill's engagement with pessimism, these challenges point to distinctive conceptions of dignity and satisfaction that play a significant role in Mill's ethics.",
    DT: "Journal Article",
    PU: "Springer",
    WC: "Computer Science",
    CR: "Smith, J. et al. (2020). A Study on Artificial Intelligence.",
    DI: "10.1007/s11280-020-00776-5"
  },
  {
    id: 5,
    nodeCircle: 15,
    nodeOpacity: 0.8,
    isExpanded: false,
    TI: "Introducing the POPVESL Score for Intrarenal Vascular Complications of Percutaneous Nephrolithotomy: Experience from a Single high-volume Referral Center",
    AU: "Zhou, J; He, JZ; Zhu, F",
    PY: "2021",
    Z9: "90",
    AB: "Mill defines utilitarianism as the combination of a theory of life and a moral claim: only pleasure and freedom from pain are desirable as ends, and the promotion of happiness is the sole goal of moral action. So defined, utilitarianism is open to ad hominem pessimistic objection: a theory of life which entails the impossibility of happiness fits poorly with a morality centered on its promotion. The first two challenges Mill confronts in Utilitarianism share this pessimistic structure. Interestingly, however, these challenges paint inverted pictures of the best utilitarian life: one suggests this life is satisfying but ignoble, the other that it is noble but unsatisfying. I explain Mill's treatment of both challenges as genuinely pessimistic interpretations of utilitarianism's theory of life. Read through the lens of Mill's engagement with pessimism, these challenges point to distinctive conceptions of dignity and satisfaction that play a significant role in Mill's ethics.",
    DT: "Journal Article",
    PU: "Springer",
    WC: "Computer Science",
    CR: "Smith, J. et al. (2020). A Study on Artificial Intelligence.",
    DI: "10.1007/s11280-020-00776-5"
  },
  {
    id: 6,
    nodeCircle: 10,
    nodeOpacity: 0.6,
    isExpanded: false,
    TI: "A Simplified Management of Transverse Testicular Ectopia in Patients with Persistent Mullerian Duct Syndrome",
    AU: "Zhou, J; He, JZ; Zhu, F",
    PY: "2021",
    Z9: "90",
    AB: "Mill defines utilitarianism as the combination of a theory of life and a moral claim: only pleasure and freedom from pain are desirable as ends, and the promotion of happiness is the sole goal of moral action. So defined, utilitarianism is open to ad hominem pessimistic objection: a theory of life which entails the impossibility of happiness fits poorly with a morality centered on its promotion. The first two challenges Mill confronts in Utilitarianism share this pessimistic structure. Interestingly, however, these challenges paint inverted pictures of the best utilitarian life: one suggests this life is satisfying but ignoble, the other that it is noble but unsatisfying. I explain Mill's treatment of both challenges as genuinely pessimistic interpretations of utilitarianism's theory of life. Read through the lens of Mill's engagement with pessimism, these challenges point to distinctive conceptions of dignity and satisfaction that play a significant role in Mill's ethics.",
    DT: "Journal Article",
    PU: "Springer",
    WC: "Computer Science",
    CR: "Smith, J. et al. (2020). A Study on Artificial Intelligence.",
    DI: "10.1007/s11280-020-00776-5"
  },
  {
    id: 7,
    nodeCircle: 10,
    nodeOpacity: 0.9,
    isExpanded: false,
    TI: "A Simplified Management of Transverse Testicular Ectopia in Patients with Persistent Mullerian Duct Syndrome",
    AU: "Zhou, J; He, JZ; Zhu, F",
    PY: "2021",
    Z9: "90",
    AB: "Mill defines utilitarianism as the combination of a theory of life and a moral claim: only pleasure and freedom from pain are desirable as ends, and the promotion of happiness is the sole goal of moral action. So defined, utilitarianism is open to ad hominem pessimistic objection: a theory of life which entails the impossibility of happiness fits poorly with a morality centered on its promotion. The first two challenges Mill confronts in Utilitarianism share this pessimistic structure. Interestingly, however, these challenges paint inverted pictures of the best utilitarian life: one suggests this life is satisfying but ignoble, the other that it is noble but unsatisfying. I explain Mill's treatment of both challenges as genuinely pessimistic interpretations of utilitarianism's theory of life. Read through the lens of Mill's engagement with pessimism, these challenges point to distinctive conceptions of dignity and satisfaction that play a significant role in Mill's ethics.",
    DT: "Journal Article",
    PU: "Springer",
    WC: "Computer Science",
    CR: "Smith, J. et al. (2020). A Study on Artificial Intelligence.",
    DI: "10.1007/s11280-020-00776-5"

  },
  {
    id: 3,
    nodeCircle: 10,
    nodeOpacity: 0.7,
    isExpanded: false,
    TI: "A Simplified Management of Transverse Testicular Ectopia in Patients with Persistent Mullerian Duct Syndrome",
    AU: "Zhou, J; He, JZ; Zhu, F",
    PY: "2021",
    Z9: "90",
    AB: "Mill defines utilitarianism as the combination of a theory of life and a moral claim: only pleasure and freedom from pain are desirable as ends, and the promotion of happiness is the sole goal of moral action. So defined, utilitarianism is open to ad hominem pessimistic objection: a theory of life which entails the impossibility of happiness fits poorly with a morality centered on its promotion. The first two challenges Mill confronts in Utilitarianism share this pessimistic structure. Interestingly, however, these challenges paint inverted pictures of the best utilitarian life: one suggests this life is satisfying but ignoble, the other that it is noble but unsatisfying. I explain Mill's treatment of both challenges as genuinely pessimistic interpretations of utilitarianism's theory of life. Read through the lens of Mill's engagement with pessimism, these challenges point to distinctive conceptions of dignity and satisfaction that play a significant role in Mill's ethics.",
    DT: "Journal Article",
    PU: "Springer",
    WC: "Computer Science",
    CR: "Smith, J. et al. (2020). A Study on Artificial Intelligence.",
    DI: "10.1007/s11280-020-00776-5"
  },
    //
  {
    id: 10,
    nodeCircle: 20,
    nodeOpacity: 1,
    isExpanded: false,
    TI: "Symptom Resolution and Recurrence Outcomes after Partial Versus Total Laparoscopic Adrenalectomy: 13 years of Experience with Medium-Long Term Follow up",
    AU: "Knochel, AD; Jordan, AM",
    PY: "2021",
    Z9: "90",
    AB: "Mill defines utilitarianism as the combination of a theory of life and a moral claim: only pleasure and freedom from pain are desirable as ends, and the promotion of happiness is the sole goal of moral action. So defined, utilitarianism is open to ad hominem pessimistic objection: a theory of life which entails the impossibility of happiness fits poorly with a morality centered on its promotion. The first two challenges Mill confronts in Utilitarianism share this pessimistic structure. Interestingly, however, these challenges paint inverted pictures of the best utilitarian life: one suggests this life is satisfying but ignoble, the other that it is noble but unsatisfying. I explain Mill's treatment of both challenges as genuinely pessimistic interpretations of utilitarianism's theory of life. Read through the lens of Mill's engagement with pessimism, these challenges point to distinctive conceptions of dignity and satisfaction that play a significant role in Mill's ethics.",
    DT: "Journal Article",
    PU: "Springer",
    WC: "Computer Science",
    CR: "Smith, J. et al. (2020). A Study on Artificial Intelligence.",
    DI: "10.1007/s11280-020-00776-5"
  },{
    id: 11,
    nodeCircle: 20,
    nodeOpacity: 1,
    isExpanded: false,
    TI: "Symptom Resolution and Recurrence Outcomes after Partial Versus Total Laparoscopic Adrenalectomy: 13 years of Experience with Medium-Long Term Follow up",
    AU: "Knochel, AD; Jordan, AM",
    PY: "2021",
    Z9: "90",
    AB: "Mill defines utilitarianism as the combination of a theory of life and a moral claim: only pleasure and freedom from pain are desirable as ends, and the promotion of happiness is the sole goal of moral action. So defined, utilitarianism is open to ad hominem pessimistic objection: a theory of life which entails the impossibility of happiness fits poorly with a morality centered on its promotion. The first two challenges Mill confronts in Utilitarianism share this pessimistic structure. Interestingly, however, these challenges paint inverted pictures of the best utilitarian life: one suggests this life is satisfying but ignoble, the other that it is noble but unsatisfying. I explain Mill's treatment of both challenges as genuinely pessimistic interpretations of utilitarianism's theory of life. Read through the lens of Mill's engagement with pessimism, these challenges point to distinctive conceptions of dignity and satisfaction that play a significant role in Mill's ethics.",
    DT: "Journal Article",
    PU: "Springer",
    WC: "Computer Science",
    CR: "Smith, J. et al. (2020). A Study on Artificial Intelligence.",
    DI: "10.1007/s11280-020-00776-5"
  },{
    id: 12,
    nodeCircle: 20,
    nodeOpacity: 1,
    isExpanded: false,
    TI: "Symptom Resolution and Recurrence Outcomes after Partial Versus Total Laparoscopic Adrenalectomy: 13 years of Experience with Medium-Long Term Follow up",
    AU: "Knochel, AD; Jordan, AM",
    PY: "2021",
    Z9: "90",
    AB: "Mill defines utilitarianism as the combination of a theory of life and a moral claim: only pleasure and freedom from pain are desirable as ends, and the promotion of happiness is the sole goal of moral action. So defined, utilitarianism is open to ad hominem pessimistic objection: a theory of life which entails the impossibility of happiness fits poorly with a morality centered on its promotion. The first two challenges Mill confronts in Utilitarianism share this pessimistic structure. Interestingly, however, these challenges paint inverted pictures of the best utilitarian life: one suggests this life is satisfying but ignoble, the other that it is noble but unsatisfying. I explain Mill's treatment of both challenges as genuinely pessimistic interpretations of utilitarianism's theory of life. Read through the lens of Mill's engagement with pessimism, these challenges point to distinctive conceptions of dignity and satisfaction that play a significant role in Mill's ethics.",
    DT: "Journal Article",
    PU: "Springer",
    WC: "Computer Science",
    CR: "Smith, J. et al. (2020). A Study on Artificial Intelligence.",
    DI: "10.1007/s11280-020-00776-5"
  },
]);
const links = ref([
  {source: 1, target: 2},
  {source: 2, target: 3},
  {source: 3, target: 1},
  {source: 4, target: 2},
  {source: 6, target: 1},
  {source: 0, target: 3},
  {source: 0, target: 1},
  {source: 0, target: 2},
  {source: 1, target: 5},
  {source: 2, target: 6},
]);
const hoverNodeInfo = ref(null);
const displayedNodeInfo = ref(null);
const simulation = ref(null);
const showFull = ref(false);

// 定义用于引用中间面板div的ref
const middlePanelRef = ref(null);
// 定义用于引用svg容器的ref
const svgContainerRef = ref(null);

// 方法定义
const handleCommand = (command) => {
  if (command === "a") {
    thesisInf.value = "论文名称";
  } else if (command === "b") {
    thesisInf.value = "作者";
  } else if (command === "c") {
    thesisInf.value = "出版年份";
  } else if (command === "d") {
    thesisInf.value = "文献摘要";
  } else if (command === "e") {
    thesisInf.value = "DOI";
  } else if (command === "f") {
    thesisInf.value = "期刊";
  } else if (command === "g") {
    thesisInf.value = "文献类型";
  } else if (command === "h") {
    thesisInf.value = "出版社";
  } else if (command === "i") {
    thesisInf.value = "学科领域";
  }
};

const querySearch = (queryString, ab) => {
  const results = queryString
      ? nodes.filter((item) =>
          item.TI.toLowerCase().includes(queryString.toLowerCase())
      )
      : nodes;
  ab(results);
};

const handleSelect = (item) => {
  // 当用户选择机构时，将其显示在输入框中
  searchQuery.value = item.TI;
  // 当用户选择机构时，可在此添加发送给后端的逻辑（原代码中被注释掉了）
  // this.sendToBackend(item);
};

const showFullLabel = () => {
  showFull.value = true;
};

const hideFullLabel = () => {
  showFull.value = false;
};

const submitForm = (formName) => {
  const formRef = ref(null);
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        alert("submit!");
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }
};

const tableRowClassName = ({row, rowIndex}) => {
  if (hoverNodeInfo.value && hoverNodeInfo.value.id === row.id) {
    return "hover-row";
  }
  return "";
};

const handleRowClick = (row) => {
  displayedNodeInfo.value = row;
};

const handleRowMouseover = (row) => {
  displayedNodeInfo.value = row;
};

const handleRowMouseout = () => {
  displayedNodeInfo.value = null;
};

// const createGraph = () => {
//   const svg = d3.select(svgContainerRef.value);
//   svg.attr("width", "100%").attr("height", "500px");
//
//   simulation.value = d3
//       .forceSimulation(nodes)
//       .force(
//           "link",
//           d3
//               .forceLink(links)
//               .distance(100)
//               .strength((d) => 0.5)
//       )
//       .force("charge", d3.forceManyBody().strength(-300))
//       .force(
//           "center",
//           d3.forceCenter(
//               svg.node().getBoundingClientRect().width / 2,
//               250
//           )
//       );
// }
//
// // //鼠标滚轮控制缩放
// // svg.call(d3.zoom().on("zoom",function(){
// //   svg.attr("transform",d3.event.transform);
// // }));
//
// // const link = svg
// //     .append("g")
// //     .attr("class", "links")
// //     .selectAll("line")
// //     .data(links)
// //     .enter()
// //     .append("line")
// //     .attr("stroke-width", (d) => 1)
// //     .attr("stroke", "#999")
// //     .attr("stroke-opacity", 0.5);
// //
// // const node = svg
// //     .append("g")
// //     .attr("class", "nodes")
// //     .selectAll("circle")
// //     .data(nodes)
// //     .enter()
// //     .append("circle")
// //     .attr("r", (d) => d.nodeCircle)
// //     .attr("fill", "#8cd4f3")
// //     .attr("opacity", (d) => d.nodeOpacity)
// //     .on("mouseover", (event, d) => {
// //       hoverNodeInfo.value = d;
// //       displayedNodeInfo.value = d;
// //     })
// //     .on("mouseout", (event, d) => {
// //       hoverNodeInfo.value = null;
// //     })
// //     .call(
// //         d3
// //             .drag()
// //             .on("start", (event, d) => dragstarted(event, d))
// //             .on("drag", (event, d) => dragged(event, d))
// //             .on("end", (event, d) => dragended(event, d))
// //     );
// //
// // const labels = svg
// //     .append("g")
// //     .selectAll("text")
// //     .data(nodes)
// //     .enter()
// //     .append("text")
// //     .text((d) => d.AU + ", " + d.PY)
// //     .style('font-size', '10px')
// //     .style('opacity', '0.7')
// //     .attr("x", 15)
// //     .attr("y", 4);
// //
// // simulation.value.on("tick", () => {
// //   link
// //       .attr("x1", (d) => d.source.x)
// //       .attr("y1", (d) => d.source.y)
// //       .attr("x2", (d) => d.target.x)
// //       .attr("y2", (d) => d.target.y);
// //
// //   node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
// //
// //   labels.attr("x", (d) => d.x + 15).attr("y", (d) => d.y + 4);
// // });
// //
// // const dragstarted = (event, d) => {
// //   if (!event.active) simulation.value.alphaTarget(0.3).restart();
// //   d.fx = d.x;
// //   d.fy = d.y;
// // };
// //
// // const dragged = (event, d) => {
// //   d.fx = event.x;
// //   d.fy = event.y;
// // };
// //
// // const dragended = (event, d) => {
// //   if (!event.active) simulation.value.alphaTarget(0);
// //   d.fx = null;
// //   d.fy = null;
// // };
//
// // 生命周期钩子
// // onMounted(() => {
// //   drawGraph(nodes.value, links.value);
// // });

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

// 挂载后执行的函数
onMounted(() => {
  showGraph();
});

// 展示图形的函数
const showGraph = async () => {
  const __graph_json_data = {
    rootId: 'a',
    nodes: [
      {id: 'a', text: 'root'},
      {id: 'b', text: 'b'},
      {id: 'b1', text: 'b1'},
      {id: 'b1-1', text: 'b1-1'},
      {id: 'b1-2', text: 'b1-2'},
      {id: 'b1-3', text: 'b1-3'},
      {id: 'b1-4', text: 'b1-4'},
      {id: 'b1-5', text: 'b1-5'},
      {id: 'b1-6', text: 'b1-6'},
      {id: 'b2', text: 'b2'},
      {id: 'b2-1', text: 'b2-1'},
      {id: 'b2-2', text: 'b2-2'},
      {id: 'b2-3', text: 'b2-3'},
      {id: 'b2-4', text: 'b2-4'}
    ],
    lines: [
      {from: 'a', to: 'b'},
      {from: 'b', to: 'b1'},
      {from: 'b1', to: 'b1-1'},
      {from: 'b1', to: 'b1-2'},
      {from: 'b1', to: 'b1-3'},
      {from: 'b1', to: 'b1-4'},
      {from: 'b1', to: 'b1-5'},
      {from: 'b1', to: 'b1-6'},
      {from: 'b', to: 'b2'},
      {from: 'b2', to: 'b2-1'},
      {from: 'b2', to: 'b2-2'},
      {from: 'b2', to: 'b2-3'},
      {from: 'b2', to: 'b2-4'}
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
const onNodeClick = (node) => {
  console.log('onNodeClick:', node);
};

// 连线点击事件处理函数
const onLineClick = (line) => {
  console.log('onLineClick:', line);
};

const toggleAbstract = (row) => {
  row.isExpanded = !row.isExpanded;
};

</script>

<style scoped>
.container1 {
  height: 87vh;
  display: flex;
  flex-direction: column;
}

.drag-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 60px);
  padding: 10px;
}

.left-panel, .graph-panel {
  overflow: hidden;
  border-radius: 4px;
}

.graph-panel {
  flex-grow: 1;
}

.card {
  width: 600px;
  height: 100%;
}

.demo-dynamic {
  width: 1000px;
  justify-content: center; /* 水平居中 */
}

.search-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.searchBox {
  display: flex;
  padding-right: 10px;
}

/* 输入框样式 */
.searchBox /deep/ .el-input__inner {
  padding: 8px;
  width: 100%;
  border: 1px solid #53bfe9;
  border-radius: 4px;
  font-size: 16px;
}

/* 下拉菜单样式 */
.searchBox /deep/ .el-autocomplete-suggestion {
  list-style-type: none;
  margin: 0;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
}

.searchBox /deep/ .el-autocomplete-suggestion li {
  padding: 8px;
  cursor: pointer;
}

.searchBox /deep/ .el-autocomplete-suggestion li:hover {
  background-color: #f0f0f0;
}

/* 提示项样式 */
.searchBox /deep/ .el-autocomplete-suggestion li span {
  display: block;
  font-size: 16px;
  color: #c23434;
}

.searchContinue {
  margin: 0 auto; /* 设置左右外边距为 auto */
}

.label-container {
  position: relative;
  display: inline-block;
  max-width: 120px; /* 设置 label 最大宽度，超过部分将被截断 */
  overflow: hidden;
  text-overflow: ellipsis; /* 当内容溢出时以省略号表示 */
  white-space: nowrap; /* 防止文字换行 */
  cursor: pointer; /* 添加指针样式，表示可以触发事件 */
}

.limited-width {
  max-width: 600px; /* 设置最大宽度 */
  overflow: hidden; /* 隐藏超出范围的内容 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /* 不换行 */
  font-size: 16px;
}

.limited-width:hover {
  overflow: visible; /* 悬停时显示完整文本 */
  white-space: normal; /* 悬停时允许换行 */
  z-index: 1000; /* 确保悬停框位于其他内容之上 */
  position: absolute; /* 让悬停框脱离文档流，可以覆盖其他元素 */
  background-color: white; /* 可根据需要调整背景色 */
  border: 1px solid #ccc; /* 可根据需要调整边框样式 */
  padding: 10px; /* 可根据需要调整内边距 */
}

/* .box::-webkit-scrollbar {
  width: 0;
} */
.drag-item1::-webkit-scrollbar {
  overflow: hidden;
}

.drag-item2::-webkit-scrollbar {
  overflow: hidden;
}

.el-table .hide-label {
  font-size: 15px;
  color: #913bb5;
}

.el-table thead.is-opacity th.gutter,
.el-table thead th.gutter {
  border-bottom: 0;
}

.el-table .hide-label .cell {
  display: none;
}

.containertable {
  display: flex;
  overflow: hidden; /* 如果超出一行范围则隐藏溢出部分 */
}

.box1 {
  font-family: Arial, sans-serif;
  font-size: 16px;
}

.box2 {
  opacity: 0.7;
}

.box3 {
  text-align: right;
  opacity: 0.7;
}

.box2,
.box3 {
  flex: 3; /* 均分空间 */
  white-space: nowrap; /* 防止内容换行 */
}

.dropdown-col {
  text-align: right; /* 右对齐 */
  position: relative; /* 设置相对定位 */
}

.el-dropdown1 {
  text-align: right;
  position: relative;

}

.el-dropdown-link {
  cursor: pointer;
  font-size: 16px;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.TL-inf {
  font-family: Arial, sans-serif;
  font-size: 20px;
  font-weight: bold;
}

.AU-inf {
  font-family: Arial, sans-serif;
  font-size: 16px;
  opacity: 0.7;
}

.PY-inf {
  font-family: Arial, sans-serif;
  font-size: 16px;
  opacity: 0.7;
}

.Z9-inf {
  font-family: Arial, sans-serif;
  font-size: 16px;
  opacity: 0.7;
}

.AB-inf {
  font-family: Arial, sans-serif;
  font-size: 16px;
}

.panel-enter-active,
.panel-leave-active {
  transition: flex-basis 0.5s;
}

.panel-enter,
.panel-leave-to {
  flex-basis: 0%;
}

.drag-container {
  display: flex;
  //height: 600px;
  height: 77vh;
  justify-content: space-between; /* 或者 space - around */
//overflow: hidden; /* 隐藏滚动条 */
}

.drag-item1 {
  position: relative;
  border: 1px solid #ebeef5;
  overflow: auto;
}

.drag-item2 {
  position: relative;
  border: 2px solid #ebeef5;
  padding-left: 20px;
  padding-right: 20px;
  overflow: auto;
}

.hover-row {
  background-color: #f0f0f0; /* 悬停时的背景颜色 */
}

.paper-title {
  font-size: 18px;
  line-height: 1.4;
  margin-bottom: 4px;
  color: black;
  cursor: pointer;
  font-weight: normal;
}

.paper-title:hover {
  text-decoration: underline;
}

.paper-authors {
  font-size: 13px;
  color: #545454;
  margin: 4px 0;
}

.paper-meta {
  color: #666;
  font-size: 13px;
  margin: 4px 0;
}

.abstract-container {
  position: relative;
  margin-top: 8px;
}

.abstract-content {
  font-size: 14px;
  color: #545454;
  line-height: 1.6;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease-out;
}

.abstract-container.expanded .abstract-content {
  max-height: 1000px;
  margin-bottom: 8px;
}

.abstract-toggle {
  color: #1a73e8;
  cursor: pointer;
  font-size: 14px;
  background: none;
  border: none;
  padding: 0;
  text-align: left;
}

.abstract-toggle:hover {
  text-decoration: underline;
}
</style>
