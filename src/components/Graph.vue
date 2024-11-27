<template>
  <div>
    <div ref="myPage" style="height:calc(100vh);">
      <RelationGraph ref="graphRef" :options="graphOptions" @node-click="onNodeClick" @line-click="onLineClick">
        <template #node="{node}">
          <div>
            <div class="c-my-rg-node">
              <i style="font-size: 30px;" :class="node.data.descriptions"/>
            </div>
            <div
                style="color: forestgreen;font-size: 16px;position: absolute;width: 160px;height:25px;line-height: 25px;margin-top:5px;margin-left:-48px;text-align: center;background-color: rgba(66,187,66,0.2);">
              {{ node.text }}
            </div>
          </div>
        </template>
      </RelationGraph>
      <div v-if="isShowNodeTipsPanel"
           :style="{left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }"
           style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
        <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">Node Name:
          {{ currentNode.text }}
        </div>
        <div class="c-node-menu-item">name: {{ currentNode.text }}</div>
        <div class="c-node-menu-item">description: {{ currentNode.data.description }}</div>
      </div>
      <div v-if="isShowLineTipsPanel"
           :style="{left: lineMenuPanelPosition.x + 'px', top: lineMenuPanelPosition.y + 'px' }"
           style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
        <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">Line Name:
          {{ currentLine.text }}
        </div>
        <div class="c-node-menu-item">name: {{ currentLine.text }}</div>
        <div class="c-node-menu-item">description: {{ currentLine.data.description }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue';
import RelationGraph from 'relation-graph-vue3';
import {RelationGraphComponent} from 'relation-graph-vue3';
import data from '../resource/graph_data.json'

const myPage = ref();
const graphRef = ref<RelationGraphComponent>();
const isShowNodeTipsPanel = ref(false);
const isShowLineTipsPanel = ref(false);
const nodeMenuPanelPosition = ref({x: 0, y: 0});
const lineMenuPanelPosition = ref({x: 0, y: 0});
const currentNode = ref({});
const currentLine = ref({});
const graphOptions = {
  allowSwitchLineShape: true,
  allowSwitchJunctionPoint: true,
  defaultNodeColor: 'rgba(66,187,66,1)',
  defaultJunctionPoint: 'border',
  defaultLineWidth: 5,
  // 您可以参考 “Graph” 中的参数进行配置。

};

const showGraph = async () => {
  const __graph_json_data = data;
  const graphInstance = graphRef.value.getInstance();
  await graphInstance.setJsonData(__graph_json_data);
  await graphInstance.moveToCenter();
  await graphInstance.zoomToFit();
};

const onNodeClick = (nodeObject, $event) => {
  console.log('onNodeClick:', nodeObject);
  if (isShowNodeTipsPanel.value) {
    hideNodeTips(nodeObject, $event);
  } else showNodeTips(nodeObject, $event);
};

const onLineClick = (lineObject, $event) => {
  console.log('onLineClick:', lineObject);
  if (isShowLineTipsPanel.value) {
    hideLinesTips(lineObject, $event);
  } else showLinesTips(lineObject, $event);
};

const showNodeTips = (nodeObject, $event) => {
  currentNode.value = nodeObject;
  const _base_position = myPage.value.getBoundingClientRect();
  console.log('showNodeMenus:', $event.clientX, $event.clientY, _base_position);
  isShowNodeTipsPanel.value = true;
  //统一显示到组件的左上角
  nodeMenuPanelPosition.value.x = _base_position.x + 10;
  nodeMenuPanelPosition.value.y = _base_position.y + 10;
};

const hideNodeTips = (nodeObject, $event) => {
  isShowNodeTipsPanel.value = false;
};

const showLinesTips = (lineObject, $event) => {
  currentLine.value = lineObject;
  const _base_position = myPage.value.getBoundingClientRect();
  console.log('showLineMenus:', $event.clientX, $event.clientY, _base_position);
  isShowLineTipsPanel.value = true;
  lineMenuPanelPosition.value.x = _base_position.x + 10;
  lineMenuPanelPosition.value.y = _base_position.y + 10;
};

const hideLinesTips = (lineObject, $event) => {
  isShowLineTipsPanel.value = false;
};

onMounted(() => {
  showGraph();
});
</script>

<style lang="scss">

</style>

<style lang="scss" scoped>
.c-my-rg-node {
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  place-items: center;
  justify-content: center;
}

.c-node-menu-item {
  line-height: 30px;
  padding-left: 10px;
  cursor: pointer;
  color: #444444;
  font-size: 14px;
  border-top: #efefef solid 1px;
}

.c-node-menu-item:hover {
  background-color: rgba(66, 187, 66, 0.2);
}
</style>
