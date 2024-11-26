<template>
  <div style="width: 100%; height: 360px" ref="chartContainer">
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';
import * as echarts from 'echarts';

// 缩写映射表
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

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  }
});

const chartContainer = ref(null);
const mychart = ref(null);

onMounted(() => {
  drawChart(props.chartData);
});

watch(props.chartData, (newVal) => {
  // 当chartData发生变化时，也尝试更新图表数据
  drawChart(newVal);
}, {deep: true});

const drawChart = (data) => {
  // 基于准备好的dom，初始化echarts实例
  if (mychart.value) {
    // 如果已存在实例，则先清除
    mychart.value.dispose();
  }
  mychart.value = echarts.init(chartContainer.value);
  console.log(data);
  const institutionName = data.institutionName;
  const name = replaceAbbreviations1(institutionName);
  const sum = data.total;
  const years = ["2018", "2019", "2020", "2021", "2022", "2023"]; // 与xAxis中的年份相对应
  const seriesData = years.map(year => {
    const key = `y${year}`;
    return data[key] || 0;
  });
  const option = {
    title: {
      text: `${name} 机构近六年发文量变化`,
      textStyle: {
        fontWeight: 'bold',
        fontSize: 16,
      },
      subtext: `机构至今总计发文量: ${sum}`,
      subtextStyle: {
        rich: {
          text: {
            fontSize: 12, // 描述性文字的字体大小
            color: '#666', // 描述性文字的颜色
            lineHeight: 18, // 描述性文字的行高
          }
        },
      },
    },
    grid: {top: 70, right: 20, bottom: 30, left: 30},
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ["2018年", "2019年", "2020年", "2021年", "2022年", "2023年"]
    },
    yAxis: {
      type: 'value',
      splitLine: {show: true, lineStyle: {type: 'dashed', color: '#f5f5f5'}},
    },
    series: [
      {
        name: '发文量',
        type: 'line',
        data: seriesData,
        smooth: true,   //设置线变平滑
        symbolSize: 6,
        symbol: 'circle',
        lineStyle: {color: '#fe9a8b'},
        itemStyle: {color: '#fe9a8b', borderColor: '#fe9a8b'},
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#fe9a8bb3'},
            {offset: 1, color: '#fe9a8b03'},
          ]),
        },
      }
    ]
  };
  mychart.value.setOption(option);
};

const replaceAbbreviations1 = (name) => {
  // 将机构名分割成单词数组
  const words = name.split(/\s+/); // 假设单词由空格分隔
  // 遍历每个单词
  return words.map(word => {
    // 遍历每个缩写
    for (const abbreviation in abbreviationMap1) {
      const regex = new RegExp(`\\b${abbreviation}\\b`, 'gi');
      word = word.replace(regex, abbreviationMap1[abbreviation]);
    }
    // 如果没有找到匹配项，则返回原始单词
    return word;
  }).join(' '); // 将单词数组重新组合成字符串
};

onBeforeUnmount(() => {
  // 组件销毁前清除echarts实例
  if (mychart.value) {
    mychart.value.dispose();
  }
});
</script>

<style scoped>
</style>