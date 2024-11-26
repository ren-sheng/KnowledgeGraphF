<template>
  <div>
    <div style="border: #efefef solid 1px; height: calc(100vh - 100px);width: 100%;">
      <relation-graph ref="graphRef$" :options="options"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import RelationGraph from 'relation-graph-vue3'
import {request} from "axios";
import data from '../resource/graph_data.json'

const graphRef$ = ref<RelationGraph>()
const options = {
  "backgroundImageNoRepeat": true,
  "moveToCenterWhenRefresh": false,
  "layouts": [
    {
      "label": "中心",
      "layoutName": "center",
      "centerOffset_x": 0,
      "centerOffset_y": 0,
      "distance_coefficient": 1
    }
  ]
}
onMounted(() => {
  //导入json文件数据,路径为src/assets/data/algorithmic_dis.json
  console.log(data)
  // const jsonData = {
  //   rootId: 'a',
  //   nodes: [
  //     { id: 'a', text: 'a', },
  //     { id: 'b', text: 'b', },
  //     { id: 'c', text: 'c', },
  //     { id: 'd', text: 'd', },
  //     { id: 'e', text: 'e', },
  //     { id: 'f', text: 'f', },
  //   ],
  //   lines: [
  //     { from: 'a', to: 'b', },
  //     { from: 'a', to: 'c', },
  //     { from: 'a', to: 'd', },
  //     { from: 'a', to: 'e', },
  //     { from: 'a', to: 'f', },
  //   ],
  // }
  console.log(data)
  // The node and line in the above data can refer to the options in "Node" and "Link & Line" for configuration.
  // Node: https://www.relation-graph.com/#/docs/node
  // Link & Line: https://www.relation-graph.com/#/docs/link
  graphRef$.value.setJsonData(data)
  // The graphRef$.value.setJsonData(jsonData, callback) method is a convenient method that is equivalent to the following code:
  //  const graphInstance = graphRef$.value.getInstance();
  //  graphInstance.addNodes(jsonData.nodes);
  //  graphInstance.addLines(jsonData.lines);
  //  graphInstance.rootNode = graphInstance.getNodeById(jsonData.rootId);
  //  await graphInstance.doLayout(); // Layout using the layouter set in graphOptions
  //  await graphInstance.moveToCenter(); // Find the center based on node distribution and center the view
  //  await graphInstance.zoomToFit(); // Zoom to fit, so that all nodes can be displayed in the visible area
})
</script>
