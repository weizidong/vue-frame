<style lang="less">
    @import "../../../../static/normal.less";
    @import "healthDetail.less";
</style>
<template>
    <div class="healthDetail" style="background-color: #ffffff;height: 100%;overflow: scroll;padding-top:50px;">
        <appHead :title="data.name"></appHead>
        <inline-calendar class="inline-calendar-demo"
                         :show.sync="show"
                         v-model="value"
                         start-date="2016-04-01"
                         end-date="2018-05-30"
                         :range="range"
                         :show-last-month="showLastMonth"
                         :show-next-month="showNextMonth"
                         :highlight-weekend="highlightWeekend"
                         :return-six-rows="return6Rows"
                         :hide-header="hideHeader"
                         :hide-week-list="hideWeekList"
                         :replace-text-list="replaceTextList"
                         :weeks-list="weeksList"
                         :render-function="buildSlotFn"
                         :disable-past="disablePast"
                         :disable-future="disableFuture">
        </inline-calendar>

        <div class="healthCont" v-if="showList">
            <p>报名详情({{itemFilter(data.total)}}),可以{{data.total}}人同时报名</p>
            <ul>
                <li v-for="(item,index) in group">
                    <div class="timeLine">
                        <span>{{HHmmFilter(data.starts[item.idx])}}--{{HHmmFilter(data.ends[item.idx])}}</span>
                    </div>
                    <div class="siginList" flex items="center">
                        <div box="1" flex justify="between">
                            <a v-for="u in 5" :class="{'lasta':item.list[u-1] && u == 5}">
                                <img @click="go(['personMess',item.list[u-1].id])"
                                     :src="item.list[u-1].headimgurl"
                                     v-if="item.list[u-1] && u < 5">
                                <span v-if="item.list[u-1] && u == 5"
                                      @click="openPerson(item.idx)">...</span>
                            </a>
                        </div>
                        <a class="ising" v-if="!item.flag"
                           @click="entry({id:data.id,starts:[data.starts[item.idx]],ends:[data.ends[item.idx]]},value)">报名</a>
                        <a class="ising" v-if="item.flag"
                           @click="noentry({id:data.id,starts:[data.starts[item.idx]],ends:[data.ends[item.idx]]},value)">取消报名</a>
                        <a class="over" v-if="item.num >= data.total" @click="">已满员</a>
                    </div>
                </li>
            </ul>
        </div>
        <div class="healthCont" v-if="!showList">
            <div class="noHealth">
                <img src="/static/wx/default.png">
                <p>该日期未开启项目！</p>
            </div>
        </div>

        <myConfirmDialog @on-result-change="onResultChange" :title="title" :content="content" :btns="btns"
                         :isShow="isshow"></myConfirmDialog>

        <popup v-model="showEntryList" height="100%" v-if="group[idx]">
            <div class="healthPersonCont">
                <a @click="showEntryList=false" class="closePopup">X</a>
                <p>报名详情(多人项目),可以14人同时报名</p>
                <ul>
                    <li>
                        <div class="timeLine">
                            <span>10:31-10:50</span>
                        </div>
                        <div class="siginList" flex items="center">
                            <grid :rows="7" style="width:100%">
                                <grid-item v-for="(item,index) in group[idx].list" :key="index">
                                    <span class="grid-center"><a @click="go(['personMess',item.id])"><img
                                            :src="item.headimgurl"></a></span>
                                </grid-item>
                            </grid>
                        </div>
                    </li>
                </ul>
                <a class="baoming" v-if="!group[idx].flag"
                   @click="entry({id:data.id,starts:[data.starts[idx]],ends:[data.ends[idx]]},value)">报名</a>
                <a class="baoming" v-if="group[idx].flag"
                   @click="noentry({id:data.id,starts:[data.starts[idx]],ends:[data.ends[idx]]},value)">取消报名</a>
                <a class="baoming" v-if="group[idx].num >= data.total" @click="">已满员</a>
            </div>
        </popup>
    </div>
</template>

<script type="es6">
    import {InlineCalendar, Group, Popup, Grid, GridItem} from 'vux'
    import {mapGetters} from 'vuex'
    import {mapActions} from 'vuex'
    import filters from '../../../filters'
    import appHead from '../../../components/public/apphead/Apphead.vue'
    import moment from 'moment'
    import {entryHealthApi, cancelEntryHealthApi} from '../../../api/healthApi'
    import myConfirmDialog from '../../../components/public/confirmDialog/confirmDialog.vue'
    export default{
        data(){
            return {
                show: true,  //是否显示
                value: '',   //当前选中日期，使用v-model绑定，默认为空，即选中当天日期
                listValue: '',
                range: false,
                showLastMonth: true,
                showNextMonth: true,
                highlightWeekend: false,
                return6Rows: true,
                hideHeader: false,
                hideWeekList: false,
                replaceTextList: {},
                replace: false,
                changeWeeksList: false,
                weeksList: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                useCustomFn: false,
                buildSlotFn: () => '',
                disablePast: false,
                disableFuture: false,
                isshow: false,//控制弹窗
                title: '提示',   //控制弹窗标题
                content: '兑换成功',  //控制弹窗内容
                btns: {},
                showList: false,  // 选中日期当天是否有 开启项目
                showEntryList: false,   //展示报名人员详情
                idx: 0,   // 展开哪个时间段的报名人员详情
            }
        },
        watch: {
            value(newval, oldval){
                // console.log(oldval+'老');
                // console.log(newval + '新');
                if (this.$store.state.data.date.includes(newval)) {
                    this.showList = true;
                    this.change('created', moment(newval).format('x') * 1)
                } else {
                    this.showList = false;
                }
            }
        },
        components: {
            appHead, Group, InlineCalendar, myConfirmDialog, Popup, Grid, GridItem
        },
        computed: {
            ...mapGetters(['data', 'list', 'login']),
            group(){
                return this.groupMap(this.list, {flagFn: (item) => this.login.id == item.id, group: this.data.starts})
            }
        },
        methods: {
            ...mapActions(['go', 'gethealthDetail', 'clear', 'getHealthEnter', 'changeSelect']),
            ...filters,
            isShow(val, data, date){
                if (val == 1) {   //报名成功
                    this.content = '恭喜您！报名成功';
                    this.btns = {btn: '确定'};
                } else if (val == 2) { // 取消
                    // this.img = '/static/wx/succ.png';
                    this.content = '是否确定取消预约报名';
                    this.btns = {
                        btn1: '是', btn2: '否', action: () => {
                            cancelEntryHealthApi({...data, dates: [moment(date).format('x') * 1]}).then(() => {
                                this.getHealthEnter()
                            });
                        }
                    };
                } else if (val == 3) { // 没有认证
                    // this.img = '/static/wx/succ.png';
                    this.content = '请先完善个人信息并通过职工认证';
                    this.btns = {
                        btn1: '去认证', btn2: '取消', action: () => {
                            // console.log('点击了去认证')
                            this.go(['centeredit'])
                        }
                    };
                }

                this.isshow = true;
            },
            onResultChange(val){
                this.isshow = val;//外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
            },
            setting(val){
                let dateaa = this.$store.state.data.date.split('|');
                // console.log(dateaa);
                this.buildSlotFn = val ? (line, index, data) => {
                            // console.log(data);
                            let mons = data.month_str > 9 ? data.month_str : '0' + data.month_str;
                            let days = data.day > 9 ? data.day : '0' + data.day;
                            let dates = data.year + '-' + mons + '-' + days;
                            // console.log(dates);
                            return dateaa.indexOf(dates) > -1 ? '<div style="font-size:12px;text-align:center;"><span style="display:inline-block;width:5px;height:5px;background-color:red;border-radius:50%;"></span></div>' : ''

                        } : () => ''
            },
            change(key, value){   //这是每个 change
                this.changeSelect({key, value});
                this.getHealthEnter()
            },
            entry(data, date){
                if (this.$store.state.login.audit == 2) {
                    entryHealthApi({...data, dates: [moment(date).format('x') * 1]}).then(() => {
                        this.getHealthEnter();
                        this.isShow(1);
                    }).catch((data)=>{
                        this.content = data.msg;
                        this.btns = {btn: '确定'};
                        this.isshow = true;
                    });
                } else {
                    this.isShow(3);
                }
            },
            noentry(data, date){  //取消报名
                this.isShow(2, data, date)
            },
            openPerson(index){
                this.idx = index;
                this.showEntryList = true;
            }
        },
        async created () {
            await this.gethealthDetail();
            this.value = moment().format('YYYY-MM-DD');
            this.setting(true);
        },
        destroyed(){
            this.clear()
        }
    }
</script>
