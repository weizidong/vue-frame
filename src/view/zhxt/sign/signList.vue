<style lang="less" scoped>
  @import "sign.less";
</style>
<template>
  <div class="contentBox">
    <div class="contentBoxtitle"><span>签到列表</span></div>
    <div class="contentBoxCont">
      <div class="filterBox mgb20">
        <MySelectInput title="搜索条件" :options="{'name':'姓名','depName':'所属单位','nickname':'昵称'}" def-key="name" :change="change"/>
        <el-date-picker v-model="dateValue" type="daterange" placeholder="选择日期范围"/>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </div>
      <div class="tableList mgb20">
        <MyTable :data="list">
          <MyColumn type="index" fixed="left"/>
          <MyColumn prop="nickname" label="昵称" min-width="100"/>
          <MyColumn prop="name" label="姓名" min-width="100"/>
          <MyColumn prop="depName" label="所属单位" min-width="140"/>
          <MyColumn prop="audit" :formatter="userFilter" label="职工认证" min-width="120"/>
          <MyColumn prop="point" label="签到获得积分" min-width="140"/>
          <MyColumn prop="recording" :formatter="date8Filter" label="签到时间" min-width="140"/>
          <MyColumn label="操作" width="80">
            <template scope="scope">
              <el-button type="text" size="small" @click="delMethod(scope.$index)">删除</el-button>
            </template>
          </MyColumn>
        </MyTable>
      </div>
      <div class="pageSlide">
        <MyPagination :method="getSign"/>
      </div>
    </div>
  </div>
</template>
<script type="es6">
  import {mapGetters, mapActions} from 'vuex'
  import MyColumn from '../../../components/common/table/MyTableColumn'
  import MyTable from '../../../components/common/table/MyTable'
  import MyPagination from '../../../components/public/page/MyPagination.vue'
  import MySelectInput from '../../../components/public/selectInput/MySelectInput.vue'
  import filter from '../../../filters'
  export default {
    data() {
      return {
        dateValue: [],
      }
    },
    components: {MySelectInput, MyPagination, MyColumn, MyTable},
    computed: {...mapGetters(['list'])},
    methods: {
      ...mapActions(['getSign', 'clear', 'changeSelect', 'delMethod', 'changePage', 'go']),
      ...filter,
      change(key, value){
        this.changeSelect({key, value});
        this.getSign();
      },
      search(){
        if (this.dateValue.length > 0) {
          this.changePage({start: this.dateValue[0].getTime(), end: this.dateValue[1].getTime()})
        } else {
          this.changePage({start: null, end: null})
        }
        this.getSign();
      },
      reset(){
        this.dateValue = [];
        this.search();
      },
    },
    created () {
      // this.getSign();
    },
    destroyed () {
      this.clear()
    }
  }
</script>
