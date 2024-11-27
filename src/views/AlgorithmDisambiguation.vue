<template>
  <!--给出两个选项，选择知识图谱则展示图谱组件，选择问答结果展示本界面写好的另一部分内容-->
  <div>
    <el-radio-group v-model="radio" @change="changeRadio">
      <el-radio label="graph">知识图谱</el-radio>
      <el-radio label="result">消歧结果</el-radio>
      <el-radio label="example">消歧示例</el-radio>
    </el-radio-group>
    <div class="content">
      <div v-if="radio === 'graph'">
        <Graph/>
      </div>
      <div v-else-if="radio === 'result'">
        <!--嵌入markdown-->
        <div class="markdown-body">
          <div v-html="renderedMarkdown"></div>
        </div>
      </div>
      <div v-else-if="radio === 'example'">
        <div class="markdown-body">
          <div v-html="renderedMarkdown"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import Graph from '../components/Graph.vue';
import {marked} from 'marked';
import {computed} from 'vue';

const radio = ref('graph');

const data1 = ref({})
data1.value = "消歧总体结果:\n" +
    "\nSUCCESS: Global Search Response:\n" +
    "\n成功: 全局搜索响应:\n" +
    "### Disambiguation of Author Entities Across Communities\n" +
    "### 跨社区作者实体消歧\n" +
    "\n" +
    "#### Ambiguous Author Entities\n" +
    "#### 有歧义的作者实体\n" +
    "The analysis across all communities identified a total of 10 ambiguous author entities [Data: Reports (1, 2, 3, +more)]. These ambiguous entities either share the same name or have author aliases, making it difficult to distinguish between them without additional context.\n" +
    "\n对所有社区的分析总共确定了 10 个模棱两可的作者实体 [数据：报告（1、2、3、+更多）]。这些不明确的实体要么共享相同的名称，要么具有作者别名，因此在没有其他上下文的情况下很难区分它们。\n" +
    "\n" +
    "#### Disambiguation Process\n" +
    "#### 消歧过程\n" +
    "After resolving these ambiguities, 15 author entities were successfully disambiguated [Data: Reports (1, 2, 3, +more)], ensuring that each author is uniquely represented within the communities. Additionally, 5 author entities were eliminated due to insufficient information or duplication [Data: Reports (1, 2, 3, +more)], reducing the overall number of ambiguous entities.\n" +
    "\n在解决这些模棱两可的情况后，成功消除了 15 个作者实体 [数据：报告（1、2、3、+更多）]，确保每个作者在社区中都有唯一的表示。此外，由于信息不足或重复，还消除了 5 个作者实体 [数据：报告（1、2、3、+更多）]，从而减少了总体模棱两可实体的数量。\n" +
    "\n" +
    "#### Disambiguated Author Entity Names\n" +
    "#### 消除歧义的作者实体名称\n" +
    "The disambiguated author entity names include:\n" +
    "\n消除歧义的作者实体名称包括：\n" +
    "- Jia, Chun-ping\n" +
    "- Lv, Jian-lin\n" +
    "- Xu, Zi-hao\n" +
    "- Zhou, Shuang\n" +
    "- Wang, Hao\n" +
    "- Nadjafi-Semnani, Mohammad\n" +
    "- Pouria Mohammadparast Tabas\n" +
    "- Nickavar, Azar\n" +
    "- Safaeian, Baranak\n" +
    "- Davoodi, Homa\n" +
    "- Valavi, Ehsan\n" +
    "- Farzad Allameh\n" +
    "- DADPOUR, MEHDI\n" +
    "- VALIPOUR, REZA\n" +
    "- RADFAR, MOHAMMAD HADI\n" +
    "- Mohammad-Rahimi, Hossein\n" +
    "- Omrani, Mir Davood\n" +
    "- Taheri, Mohammad\n" +
    "- Fallahian, Milad\n" +
    "- Noroozi, Rezvan\n" +
    "- Dialameh, Hossein\n" +
    "- Yasseri, Alimohammad Fakhr\n" +
    "- Saatchi, Mohammad\n" +
    "- Ghahestani, Seyyed Mohammad\n" +
    "- Karimi, Sara\n" +
    "\n" +
    "These names represent the unique author entities after the disambiguation process [Data: Reports (1, 2, 3, +more)].\n" +
    "\n这些名称代表了消歧过程后的唯一作者实体 [数据：报告（1、2、3、+更多）]。"

const data2 = ref({})
data2.value = "消歧示例:\n" +
    "\nSUCCESS: Global Search Response:\n" +
    "\n成功: 全局搜索响应:\n" +
    "### Disambiguation Results of Author Entities\n" +
    "### 作者实体的消歧结果\n" +
    "\n" +
    "#### Author Entity: 'Nadjafi-Semnani, Mohammad'\n" +
    "#### 作者实体: 'Nadjafi-Semnani, Mohammad'\n" +
    "- **Disambiguation Result**: The author entity 'Nadjafi-Semnani, Mohammad' is disambiguated to two instances:\n" +
    "- **消歧结果**: 作者实体 'Nadjafi-Semnani, Mohammad' 被消歧为两个实例：\n" +
    "  - One instance is affiliated with **Birjand University of Medical Sciences** [Data: Reports (13, 14)].\n" +
    "  - 另一个实例隶属于 **Birjand University of Medical Sciences** [数据：报告（13, 14）]。\n" +
    "  - The other instance is affiliated with **Zahedan University of Medical Sciences** [Data: Reports (14)].\n" +
    "  - 另一个实例隶属于 **Zahedan University of Medical Sciences** [数据：报告（14）]。\n" +
    "- **Implication**: This indicates that there are two ambiguous author entities with the same name or alias.\n" +
    "- **含义**: 这表明有两个具有相同名称或别名的模棱两可的作者实体。\n" +
    "\n" +
    "#### Author Entity: 'Nadjafi-Semnani, Ali'\n" +
    "#### 作者实体: 'Nadjafi-Semnani, Ali'\n" +
    "- **Disambiguation Result**: The author entity 'Nadjafi-Semnani, Ali' is disambiguated to one instance affiliated with **Zahedan University of Medical Sciences** [Data: Reports (14)].\n" +
    "- **消歧结果**: 作者实体 'Nadjafi-Semnani, Ali' 被消歧为一个隶属于 **Zahedan University of Medical Sciences** 的实例 [数据：报告（14）]。\n" +
    "- **Implication**: This indicates that there is no ambiguity for this author entity.\n" +
    "- **含义**: 这表明该作者实体没有歧义。\n" +
    "\n" +
    "### Summary\n" +
    "### 总结\n" +
    "- **Ambiguous Author Entities**: Two ambiguous author entities were found under the name or alias 'Nadjafi-Semnani, Mohammad'.\n" +
    "- **模棱两可的作者实体**: 在名称或别名 'Nadjafi-Semnani, Mohammad' 下找到了两个模棱两可的作者实体。\n" +
    "- **Disambiguated Instances**:\n" +
    "- **消歧实例**:\n" +
    "  - 'Nadjafi-Semnani, Mohammad' has two instances, one each at Birjand University of Medical Sciences and Zahedan University of Medical Sciences.\n" +
    "  - 'Nadjafi-Semnani, Mohammad' 有两个实例，分别在 Birjand University of Medical Sciences 和 Zahedan University of Medical Sciences。\n" +
    "  - 'Nadjafi-Semnani, Ali' has one instance at Zahedan University of Medical Sciences.\n" +
    "  - 'Nadjafi-Semnani, Ali' 在 Zahedan University of Medical Sciences 有一个实例。\n"


// markdown渲染,根据radio的值来判断渲染的内容
const renderedMarkdown = computed(() => {
  if (radio.value === 'result') {
    return marked(data1.value);
  } else if (radio.value === 'example') {
    return marked(data2.value);
  }
});
const changeRadio = (val) => {
  console.log(val);
};

</script>


<style scoped>
.content {
  border: 1px solid #ebeef5;
}
</style>
