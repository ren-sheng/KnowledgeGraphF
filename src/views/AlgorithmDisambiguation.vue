<template>
  <!--给出两个选项，选择知识图谱则展示图谱组件，选择问答结果展示本界面写好的另一部分内容-->
  <div>
    <el-radio-group v-model="radio" @change="changeRadio">
      <el-radio label="graph">知识图谱</el-radio>
      <el-radio label="result">消歧结果</el-radio>
    </el-radio-group>
    <div v-if="radio === 'graph'">
      <Graph/>
    </div>
    <div v-else-if="radio === 'result'">
      <!--嵌入markdown-->
      <div class="markdown-body">
        <div v-html="renderedMarkdown">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import Graph from '../components/Graph.vue';
import { marked } from 'marked';
import { computed } from 'vue';

const radio = ref('graph');
const markdown = ref('');

markdown.value = "SUCCESS: Global Search Response:\n" +
"### Author Entity Disambiguation Examples\n" +
"\n" +
"Entity disambiguation is a critical process in research communities to ensure that the contributions and affiliations of authors are accurately represented. This prevents confusion and misattribution of research work. Below are several examples illustrating the importance of disambiguating authors based on their full names and affiliations.\n" +
"\n" +
"#### Example 1: Mohammad-Rahimi, Hossein\n" +
"In the 'Prostate Cancer Risk Prediction Research Community', there are multiple authors named Mohammad-Rahimi, Hossein. Each is affiliated with different institutions, such as Shahid Beheshti University of Medical Sciences, Amirkabir University of Technology, and Jagiellonian University. Proper disambiguation ensures that the contributions of each author are accurately attributed [Data: Reports (0)].\n" +
"\n" +
"#### Example 2: Dialameh, Hossein\n" +
"In the 'University of Tehran Medical Sciences and Renal Stone Research' community, researchers like Dialameh, Hossein, Yasseri, Alimohammad Fakhr, and Saatchi, Mohammad are all affiliated with the University of Tehran Medical Sciences. Disambiguating these authors by their full names and affiliations helps in accurately attributing their contributions to specific studies [Data: Reports (17)].\n" +
"\n" +
"#### Example 3: Mohammad\n" +
"The author 'Mohammad' is associated with multiple institutions, including Birjand University of Medical Sciences and Zahedan University of Medical Sciences, indicating potential ambiguity in author identification [Data: Reports (13, 14)].\n" +
"\n" +
"#### Example 4: John Smith\n" +
"In the context of a research paper on 'Greenlight laser techniques,' the 'John Smith' referred to is likely the urologist John Smith affiliated with the University of California, San Francisco, not the John Smith who is a software engineer [Data: Reports (-1, 59, 55, 39, 46, +more)].\n" +
"\n" +
"#### Example 5: Mary Johnson\n" +
"In the context of a study on 'sperm DNA integrity,' the 'Mary Johnson' being discussed is the reproductive biologist Mary Johnson from Harvard University, not the Mary Johnson who is a high school teacher [Data: Reports (-1, 59, 55, 39, 46, +more)].\n" +
"\n" +
"### Conclusion\n" +
"These examples highlight the necessity of disambiguating authors by their full names and affiliations to ensure accurate attribution of their research contributions. This practice is essential for maintaining the integrity and clarity of academic research.";

const renderedMarkdown = computed(() => {
  return marked(markdown.value);
});
const changeRadio = (val) => {
  console.log(val);
};

</script>


<style scoped>

</style>
