<template>
  <div style="width: 100%; height: 420px" ref="chartContainer" @click="handleClick">
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  pieData: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const chartContainer = ref(null);
const mychart = ref(null);

onMounted(() => {
  drawChart(props.pieData);
});

watch(props.pieData, (newVal) => {
  drawChart(newVal);
}, {deep: true});

const drawChart = (data) => {
  if (mychart.value) {
    mychart.value.dispose();
  }
  mychart.value = echarts.init(chartContainer.value);
  const option = {
    legend: {
      top: 'bottom',
      type: 'scroll',
      itemHeight: 25,
      textStyle: {
        fontSize: '14px',
      }
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {show: true}
      }
    },
    series: [
      {
        name: '学科发文量',
        type: 'pie',
        radius: [30, 150],
        center: ['45%', '45%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        label: {
          formatter: '{b|{b}}\n{hr|}\n {a|{a}：}{abg|} {c}  {per|{d}%}',
          backgroundColor: '#ffffff',
          borderColor: '#50adf5',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            a: {
              color: '#6E7079',
              lineHeight: 22,
            },
            hr: {
              borderColor: '#50adf5',
              width: '100%',
              borderWidth: 1,
              height: 0
            },
            b: {
              color: '#4C5058',
              fontSize: 14,
              fontWeight: 'bold',
              lineHeight: 33
            },
            per: {
              color: '#fff',
              backgroundColor: 'rgb(102,181,246)',
              padding: [3, 4],
              borderRadius: 4
            }
          }
        },
        data: data.subjects.map((subject, index) => ({
          name: subject,
          value: data.counts[index]
        })),
      }
    ]
  };
  mychart.value.setOption(option);
  mychart.value.on('legendselectchanged', handleLegendClick);
  mychart.value.on('click', handleClick);
};

const handleLegendClick = (params) => {
  const selectedLegend = params.name;
  const selected = mychart.value.getOption().legend[0].selected;
  selected[selectedLegend] = true;
  mychart.value.setOption({
    legend: {
      selected: selected
    }
  });
};

const handleClick = (params) => {
  if (!params || !params.data) {
    console.error('Invalid parameter passed to handleClick');
    return;
  }
  const subject = params.data.name;
  const institution = props.pieData.institution;
  emit('pieChartClick', {subject, institution});
};

onBeforeUnmount(() => {
  if (mychart.value) {
    mychart.value.dispose();
    mychart.value.off('legendselectchanged', handleLegendClick);
  }
});
</script>

<style scoped>
.selected-legend {
  border: 2px solid blue;
}
</style>
