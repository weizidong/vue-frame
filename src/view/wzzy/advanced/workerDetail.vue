<style lang="less">
  .modelWorkerDetail {
    overflow: hidden;padding: 40px 0;
    .modelWorkerDetailLeft {
      width: 160px;float: left;
      img {width: 100%;height: 200px;display: block;margin-bottom: 10px;}
      h2 {font-size: 22px;color: #333333;}
      p {color: #999999;font-size: 14px;}
    }
    .modelWorkerDetailRight {line-height: 30px;font-size: 16px;color: #333;margin-left: 180px;}
  }
</style>
<template>
  <div class="wzzyLaborUnion" style="padding-top:20px;">
    <div class="pagewrap">
      <div class="wzzy-content">
        <div class="grid-left">
          <div class="the-place">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>先进人物</el-breadcrumb-item>
              <el-breadcrumb-item>详情</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="wzzy-sub-content">
            <div class="modelWorkerDetail">
              <div class="modelWorkerDetailLeft">
                <img :src="data.picUrl">
                <h2>{{data.title}}</h2>
                <!--<p>RE0 女主</p>-->
              </div>
              <div class="modelWorkerDetailRight ql-editor" v-html="decode(data.content)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="es6">
  import {mapGetters,mapActions} from 'vuex'
  import filters from '../../../filters'
  export default{
    computed: {
      ...mapGetters(['data']),
    },
    methods: {
      ...mapActions(['clear','getArticle']),
      ...filters,
    },
    created () {
      this.getArticle();
    },
    destroyed(){
      this.clear()
    }
  }
</script>
