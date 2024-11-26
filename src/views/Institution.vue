<template>
  <div class="container">
    <el-container class="search-container">
      <div>
        <el-autocomplete
            v-model="searchQuery"
            :fetch-suggestions="querySearch"
            placeholder="请输入机构名称："
            @select="handleSelect"
            class="autocomplete"
            suffix-icon="el-icon-search">
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
            <el-card>
              <linechart v-if="chartData" :chart-data="chartData"/>
            </el-card>
          </el-col>
          <el-col :span="10">
            <el-card style="width: 100%; height: 400px;">
              <div class="el-card1-div1">
                <span
                    style="font-family: 'sans-serif'; font-size: 18px; font-weight: bold; margin-right: 10px; display: inline-block;">机构作者及发文量</span>
                <el-input style="width: 140px;border: 1.5px solid rgb(102,180,245);" v-model="authorsearch"
                          placeholder="请输入作者名称" suffix-icon="el-icon-search"></el-input>
              </div>
              <div
                  style="max-height: 320px; overflow-y: auto; border: 1.5px solid rgba(99, 185, 253, 0.43); border-top: none;">
                <el-table :data="filteredtableData" class="table1">
                  <el-table-column prop="ranking" label="排名" fixed="left" width="55px">
                  </el-table-column>
                  <el-table-column prop="author" label="作者" fixed="left" width="120px">
                  </el-table-column>
                  <el-table-column prop="artist" label="发文量" fixed="left" width="70px">
                  </el-table-column>
                  <el-table-column prop="cites" label="引用量" fixed="left" width="70px">
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin:10px 0">
          <el-card>
            <div style="width: 100%; height: 40px;">
              <span style="font-family: 'sans-serif';font-size: 21px;font-weight:bold">学科</span>
            </div>
            <el-col :span="24">
              <piechart v-if="pieData" :pieData="pieData" @pieChartClick="handlePieChartClick"/>
            </el-col>
            <el-col :span="16" style="margin-top: 20px;">
              <columnchart v-if="columnData" :columnData="columnData"/>
            </el-col>
            <el-col :span="8" style="margin-top: 20px;">
              <div class="el-card1-div2" v-if="subjectauthorData && subjectauthorData.length > 0">
                <span class="subject_author">涉及作者</span>
              </div>
              <div v-if="subjectauthorData && subjectauthorData.length > 0"
                   style="max-height: 280px; overflow-y: auto; border: 1px solid #ebeef5; border-top: none;">
                <el-table :data="subjectauthorData" class="table2">
                  <el-table-column prop="ranking" label="排名" fixed="left" width="55px">
                  </el-table-column>
                  <el-table-column prop="author" label="作者" fixed="left" width="120px">
                  </el-table-column>
                  <el-table-column prop="artist" label="发文量" fixed="left" width="70px">
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-card>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import linechart from "@/components/charts/Linechart.vue";
import columnchart from "@/components/charts/Columnchart.vue";
import piechart from "@/components/charts/Piechart.vue";
import axios from "axios";

const abbreviationMap1 = {
  'Univ': 'University',
  'Inst': 'Institute',
  'Coll': 'College',
  'Hosp': 'Hospital',
  'Ctr': 'Center',
  'Dept': 'Department',
  'Lab': 'Laboratory',
  'Fdn': 'Foundation',
  'Sch': 'School',
  'Assoc': 'Association',
  'Res': 'Research',
  'Biosci': 'Bioscience',
  'CB': 'CellBank',
  'Sci': 'Science',
  'Bio': 'Biology',
  'Nanotechnol': 'Nanotechnology'
};

const abbreviationMap2 = {
  'University': 'Univ',
  'Institute': 'Inst',
  'College': 'Coll',
  'Hospital': 'Hosp',
  'Center': 'Ctr',
  'Department': 'Dept',
  'Laboratory': 'Lab',
  'Foundation': 'Fdn',
  'School': 'Sch',
  'Association': 'Assoc',
  'Research': 'Res',
  'Bioscience': 'Biosci',
  'CellBank': 'CB',
  'Science': 'Sci',
  'Biology': 'Bio',
  'Nanotechnology': 'Nanotechnol'
};

const searchQuery = ref('Biomed Research Center');
const authorsearch = ref('');
const chartData = ref(null);
const tableData = ref(null);
const pieData = ref({
  subjects: [],
  counts: [],
  institution: ''
});
const columnData = ref(null);
const subjectauthorData = ref(null);
const searchResults = ref([]);

const filteredtableData = computed(() => {
  if (!authorsearch.value) {
    return tableData.value;
  } else {
    const search = authorsearch.value.trim().toLowerCase();
    return tableData.value.filter(item => item.author.toLowerCase().includes(search));
  }
});

// onMounted(() => {
//   if (searchQuery.value.length >= 2) {
//     const searchQuery = replaceAbbreviations2(searchQuery.value);
//     fetchData(searchQuery);
//   }
// });

const querySearch = async (queryString, cb) => {
  if (queryString.length >= 2) {
    let encodedqueryString = encodeURIComponent(queryString);
    try {
      console.log(encodedqueryString)
      const response = await axios.get(`http://localhost:8088/Institutions/InstitutionList?institutionName=${encodedqueryString}`);
      console.log(response.data.data)
      if (response.status === 200) {
        const searchResults = response.data.data.map(item => {
          if (item) {
            item = replaceAbbreviations1(item);
            return item;
          }
        });
        searchResults.value = searchResults;
        cb(searchResults.value);
      } else {
        console.error('Network response was not ok:', response.status);
        cb([]);
      }
    } catch (error) {
      console.error('There was a problem with your axios operation:', error.message);
      cb([]);
    }
  } else {
    searchResults.value = [];
    cb([]);
  }
};

const replaceAbbreviations1 = (name) => {
  const words = name.split(/\s+/);
  return words.map(word => {
    for (const abbreviation in abbreviationMap1) {
      const regex = new RegExp(`\\b${abbreviation}\\b`, 'gi');
      word = word.replace(regex, abbreviationMap1[abbreviation]);
    }
    return word;
  }).join(' ');
};

const replaceAbbreviations2 = (name) => {
  const words = name.split(/\s+/);
  return words.map(word => {
    for (const abbreviation in abbreviationMap2) {
      const regex = new RegExp(`\\b${abbreviation}\\b`, 'gi');
      word = word.replace(regex, abbreviationMap2[abbreviation]);
    }
    return word;
  }).join(' ');
};

const handleSelect = (item) => {
  searchQuery.value = item;
  item = replaceAbbreviations2(item);
  let encodeditem = encodeURIComponent(item);
  fetchData(encodeditem);
};

const fetchData = async (searchQuery) => {
  //绘制折线图的数据
  axios.get(`http://localhost:8088/Institutions/InstitutionMessage?institutionName=${searchQuery}`)
      .then(res => {
        console.log(res.data);
        if (res.status === 200) {
          // 更新chartData
          this.chartData = res.data.data1;
          this.pieData.subjects = res.data.data2;
          if (Array.isArray(this.pieData.subjects) && this.pieData.subjects.length > 0) {
            // 移除数组的最后一个元素
            this.pieData.subjects.pop();
          }
        } else {
          // 处理错误情况
          console.error('Failed to fetch chart data:', res.statusText);
        }
      })
      .catch(error => {
        // 处理请求错误
        console.error('Error fetching chart data:', error);
      });
  //绘制表格的数据
  await axios.get(`http://localhost:8088/Institutions/AUMessage?institutionName=${searchQuery}`)
      .then(res => {
        console.log(res.data);
        if (res.status === 200) {
          // 假设res.data的结构是 { dataArray: [...] }，其中dataArray包含了你需要的数据
          if (res.data.data) { // 检查数据是否存在
            // 先根据paperNumber降序排序
            res.data.data.sort((a, b) => b.paperNumber - a.paperNumber);
            //
            this.columnData = null;
            this.subjectauthorData = null;
            //
            // 使用map方法转换数据格式并赋予排名
            this.tableData = res.data.data.map((item, index, array) => {
              const ranking = index + 1;
              const author = item.au;
              const artist = item.paperNumber; // 假设artist是paperNumber的别名
              const cites = item.z9; // 假设z9代表引用量
              return {
                ranking,
                author,
                artist, // 通常artist不会与paperNumber相同，这里只是为了示例
                cites
              };
            });
            // console.log(this.tableData);
          } else {
            // 处理错误或空数据的情况
            console.error('返回的数据为空');
          }
        }
      })
      .catch(error => {
        // 处理请求错误
        console.error('Error fetching chart data:', error);
      });
  //绘制饼图
  axios.get(`http://localhost:8088/Institutions/InstitutionTotalMessage?institutionName=${searchQuery}`)
      .then(res => {
        console.log(res.data);
        this.pieData.institution = searchQuery;
        if (res.status === 200) {
          // 初始化 counts 数组，长度与 subjects 相同，填充为 0（或默认值）
          if (Array.isArray(res.data.data)) {
            // 初始化 counts 数组，如果subjects数组已经存在，则可以使用其长度来初始化，否则可能需要其他逻辑
            this.pieData.counts = this.pieData.subjects.map(() => 0); // 假设 subjects 数组已存在且长度正确
            // 创建一个从 subjects 到 counts 索引的映射（如果还没有的话）
            const subjectIndexMap = this.pieData.subjects.reduce((map, subject, index) => {
              map[subject] = index;
              return map;
            }, {});
            // 遍历res.data.data 数组
            res.data.data.forEach(item => {
              const sc = item.sc;
              const total = parseInt(item.total, 10); // 将 total 转换为整数
              // 查找 sc 在 subjects 中的索引
              const index = subjectIndexMap[sc];
              // 如果找到了索引，则更新 counts 数组
              if (index !== undefined) {
                this.pieData.counts[index] = total;
              } else {
                // 如果没有找到索引（可能是因为 subjects 数组中没有对应的 sc），你可以选择添加新的 subject 到 subjects 和 counts
                // 但在这个例子中，我们假设 subjects 是固定的，所以只是打印一个警告或者执行其他错误处理
                console.warn(`No index found for subject: ${sc}`);
              }
            });
            // 创建一个包含 subjects 和 counts 的数组
            const combined = this.pieData.subjects.map((subject, index) => ({
              subject,
              count: this.pieData.counts[index]
            }));
            // 按 count 升序排序 combined 数组
            combined.sort((a, b) => a.count - b.count);
            // 提取排序后的 subjects 和 counts
            this.pieData.subjects = combined.map(item => item.subject);
            this.pieData.counts = combined.map(item => item.count);
            // 现在 pieData.counts 包含了匹配 subjects 的 total 值
            console.log(this.pieData); // 打印结果以验证
          } else {
            // 处理 res.data 不是一个包含 'data' 数组的对象的情况
            console.error('API response did not contain an array in the data property');
          }
        } else {
          // 处理错误情况
          console.error('Failed to fetch chart data:', res.statusText);
        }
      })
      .catch(error => {
        // 处理请求错误
        console.error('Error fetching chart data:', error);
      });

};

const handlePieChartClick = (data) => {
  console.log(data.institution);
  console.log(data.subject);
  let encodedSubject = encodeURIComponent(data.subject); // 对 subject 进行 URL 编码
  axios.get(`http://localhost:8088/Institutions/SCMessage?institutionName=${data.institution}&SC=${encodedSubject}`)
      .then(res => {
        console.log(res.data);
        if (res.status === 200) {
          // 更新chartData
          this.columnData = res.data;
        } else {
          // 处理错误情况
          console.error('Failed to fetch chart data:', res.statusText);
        }
      })
      .catch(error => {
        // 处理请求错误
        console.error('Error fetching chart data:', error);
      });
  axios.get(`http://localhost:8088/Institutions/AUMessagebySC?institutionName=${data.institution}&SC=${encodedSubject}`)
      .then(res => {
        console.log(res.data);
        if (res.status === 200) {
          // 假设res.data的结构是 { dataArray: [...] }，其中dataArray包含了你需要的数据
          if (res.data.data) { // 检查数据是否存在
            // 先根据paperNumber降序排序
            res.data.data.sort((a, b) => b.paperNumber - a.paperNumber);
            // 使用map方法转换数据格式并赋予排名
            this.subjectauthorData = res.data.data.map((item, index, array) => {
              const ranking = index + 1;
              const author = item.au;
              const artist = item.paperNumber; // 假设artist是paperNumber的别名
              return {
                ranking,
                author,
                artist, // 通常artist不会与paperNumber相同，这里只是为了示例
              };
            });
            // console.log(this.tableData);
          } else {
            // 处理错误或空数据的情况
            console.error('返回的数据为空');
          }
        }
      })
      .catch(error => {
        // 处理请求错误
        console.error('Error fetching chart data:', error);
      });
}
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

/* 修改 el-autocomplete 组件内部的输入框样式 */
.autocomplete {
  /* 添加你想要修改的样式属性 */
  height: 60px;
  width: 500px;

}

/*不知道原理，但是用/deep/很有用*/
.autocomplete /deep/ .el-input__inner {
  height: 50px !important;
  line-height: 32px !important;
  font-size: 16px;
  border: 1.5px solid #D528BE80;
}

.autocomplete /deep/ .el-input__inner:hover {
  border: 1.5px solid #FF40A06E;
}

/* 修改输入框聚焦时的样式 */
.autocomplete /deep/ .el-input__inner:focus {
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
</style>
