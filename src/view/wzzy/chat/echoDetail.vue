<style lang="less">
  .detailTag{ position: absolute;left: 0;top: 0;width: 100%;font-size: 16px;line-height: 40px;;
    padding: 0 20px;border-bottom: 1px solid #E7E7E7;
  }
  .questionPerson{ margin-top: 20px;border: 1px solid #E7E7E7;min-height: 500px;
    .questionPerson-head{ font-size: 16px;line-height: 40px;background-color: #FAFAFA;;
      padding: 0 20px;border-bottom: 1px solid #E7E7E7;}
    .questionPerson-cont{ padding: 20px;
      > h2{ margin-bottom: 20px;}
      > p{ font-size: 14px;color: #999;margin-bottom: 20px;line-height: 40px;border-bottom: 1px solid #E7E7E7;
        span:not(:first-child){  margin-left: 40px;}
      }
    }
  }
</style>
<template>
    <div class="wzzyLaborUnion" style="padding-top:20px;">
        <div class="the-place" style="">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>互动交流</el-breadcrumb-item>
                <el-breadcrumb-item>回音壁详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="wzzy-sub-title" style="margin-bottom:0"><a><i class="iconfont icon-kunnanbangfu"></i>回音壁详情</a></div>
        <div class="wzzy-sub-content">
          <div class="wzzy-poll-detail">
            <div class="questionPerson">
              <div class="questionPerson-head"><img style="vertical-align: middle;position:relative;top:-2px;" src="../../../../static/wzzy/icon-hynr.png"> 咨询内容</div>
              <div class="questionPerson-cont">
                <h2>{{data.title}}</h2>
                <p>
                  <span>咨询时间:{{date3Filter(data.quesTime)}}</span>
                  <span>咨询人:{{data.questioner}}</span>
                </p>
                <div class="ql-editor" v-html="decode(data.question)"></div>
              </div>
            </div>
            <div class="questionPerson">
                <div class="questionPerson-head"><img style="vertical-align: middle;position:relative;top:-2px;" src="../../../../static/wzzy/icon-hynr.png"> 回应内容</div>
                <div class="questionPerson-cont">
                  <p>
                    <span>回应时间:{{date3Filter(data.repTime)}}</span>
                    <span>回应人:{{data.replier}}</span>
                  </p>
                  <div class="ql-editor" v-html="decode(data.answer)"></div>
                </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script type="es6">
    import { mapGetters } from 'vuex'
    import { mapActions } from 'vuex'
    import filters from '../../../filters'
    export default{
        data(){
            return{

            }
        },
        components:{

        },
        computed: {
            ...mapGetters(['data']),
        },
        methods:{
            ...mapActions(['go','clear','getEcho']),
            ...filters,
        },
        created () {
          this.getEcho()
        },
        destroyed(){

        }
    }
</script>
