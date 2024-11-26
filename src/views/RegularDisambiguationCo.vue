<template>
  <view class="layout">
    <view class="title">
      <text class="title-text">规则消歧展示</text>
    </view>
    <view class="body">
      <!--      画一个表格，展示规则消歧的结果-->
      <view class="table">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="AF" label="AuthorFullName"/>
          <el-table-column prop="combine" label="Combine"/>
        </el-table>
      </view>
      <view class="button">
        <!--        消歧按钮，置于右侧-->
        <el-button type="primary" @click="ansco = true">合作者消歧</el-button>
      </view>
      <view class="ansco" v-if="ansco">
        <text>根据合作者消歧</text>
        <el-table :data="tableData2" style="width: 100%">
          <el-table-column prop="AFFalse" label="AuthorFullNameFalse"/>
          <el-table-column prop="AFTrue" label="AuthorFullName"/>
        </el-table>
        <!--        用relation-graph画出作者合作关系-->
        <view class="relation-graph">

        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'


const tableData = ref([
  {
    AF: "Emily Davis",
    combine: "John Smith, Alice Johnson" // 第一条记录的合作者
  },
  {
    AF: "Emily Davis",
    combine: "Michael Brown, Sarah Lee" // 第二条记录的合作者
  },
  {
    AF: "Emily davis",
    combine: "Michael Brown, Alice Johnson" // 第三条记录，与第二条记录的合作者相同
  }
]);
const tableData2 = ref([
  {
    AFFalse: "*",
    AFTrue: "Emily Davis"
  },
  {
    AFFalse: "*",
    AFTrue: "Emily Davis"
  },
  {
    AFFalse: "Emily davis",
    AFTrue: "Emily Davis"
  }
])

const ansid = ref(false);
const ansco = ref(false);
</script>

<style scoped lang="scss">
.layout{
  display: flex;
  flex-direction: column;
  align-items: center;

  //justify-content: center;
  .title{
    width: 100%;
    height: 50px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    .title-text{
      font-size: 20px;
      color: #333;
    }
  }
  .body{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .table{
      width: 80%;
    }
    .button{
      margin: 2vh;
      width: 20%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ansco{
      width: 80%;
      //height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
