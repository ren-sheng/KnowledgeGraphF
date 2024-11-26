<template>
  <div style="width: 100%; height: 360px" ref="chartContainer">
  </div>
</template>

<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  columnData: {
    type: Object,
    required: true,
  }
});

const chartContainer = ref(null);
const mychart = ref(null);

onMounted(() => {
  drawChart(props.columnData);
});

// ！！！！！
/*
props.columnData 变 () => props.columnData
 */
watch(() => props.columnData, (newVal) => {
  // 当columnData发生变化时，也尝试更新图表数据
  nextTick(() => {
    drawChart(newVal);
  });
}, {deep: true});

const drawChart = (data) => {

  console.log(data);
  // 基于准备好的dom，初始化echarts实例
  if (mychart.value) {
    // 如果已存在实例，则先清除
    mychart.value.dispose();
  }
  mychart.value = echarts.init(chartContainer.value);
  const years = ["2018", "2019", "2020", "2021", "2022", "2023"]; // 与xAxis中的年份相对应
  console.log(data);
  const name = data.data.sc;
  const seriesData = years.map(year => {
    const key = `y${year}`;
    return data.data[key] || 0;
  });
  console.log(seriesData);
  const option = {
    title: {
      text: `${name}学科近六年发文量`,
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['2018年', '2019年', '2020年', '2021年', '2022年', '2023年']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '发文量',
        data: seriesData,
        type: 'bar',
        itemStyle: {
          // 设置渐变色
          color: {
            type: 'linear', // 线性渐变
            x: 0, // 渐变起始点 x 坐标
            y: 0, // 渐变起始点 y 坐标
            x2: 0, // 渐变结束点 x 坐标
            y2: 1, // 渐变结束点 y 坐标
            colorStops: [
              // 渐变的起始颜色
              {offset: 0, color: '#7ed6df'},
              // 渐变的结束颜色
              {offset: 1, color: '#22a6b3'}
            ]
          }
        }
      }
    ]
  };
  mychart.value.setOption(option);
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
