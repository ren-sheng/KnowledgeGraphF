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
          <el-table-column prop="RI" label="ResearchID" />
          <el-table-column prop="OI" label="OCRID"/>
        </el-table>
      </view>
      <view class="button">
        <!--        消歧按钮，置于右侧-->
        <el-button type="primary" @click="ansid = true">ID消歧</el-button>
      </view>
      <view class="ansid" v-if="ansid">
        <text>根据ID消歧</text>
        <el-table :data="tableData2" style="width: 100%">
          <el-table-column prop="AFFalse" label="AuthorFullNameFalse"/>
          <el-table-column prop="AFTrue" label="AuthorFullName"/>
          <el-table-column prop="RI" label="ResearchID"/>
          <el-table-column prop="OI" label="OCRID"/>
        </el-table>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  {
    AF: "Emily Davis",
    RI: "RID54321",
    OI: "ORCID1001"
  },
  {
    AF: "Emily Davis",
    RI: "RID98765",
    OI: "ORCID1002"
  },
  {
    AF: "Emily davis",
    RI: "RID98765",
    OI: "ORCID1002"
  }
])
const tableData2 = ref([
  {
    AFFalse: "*",
    AFTrue: "Emily Davis",
    RI: "RID54321",
    OI: "ORCID1001"
  },
  {
    AFFalse: "*",
    AFTrue: "Emily Davis",
    RI: "RID98765",
    OI: "ORCID1002"
  },
  {
    AFFalse: "Emily davis",
    AFTrue: "Emily Davis",
    RI: "RID98765",
    OI: "ORCID1002"
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
      margin: 2vh  ;
      width: 20%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ansid{
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
