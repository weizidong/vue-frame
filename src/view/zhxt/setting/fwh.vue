<style lang="less" scoped>
  @import "./style.less";
</style>
<template>
  <div class="contentBox">
    <div class="contentBoxtitle">
      <span>服务号管理</span>
      <span style="float: right"><el-button type="primary" icon="upload" :loading="sync" @click="syncfwh">同步服务号</el-button></span>
    </div>
    <el-tabs v-model="tab" type="card" @tab-click="changeType">
      <el-tab-pane label="关注设置" name="1"/>
      <el-tab-pane label="关注回复设置" name="2"/>
      <el-tab-pane label="服务号菜单设置" name="3"/>
      <el-tab-pane label="服务号二维码" name="4"/>
    </el-tabs>
    <div class="contentBoxCont" v-if="tab == '1'">
      <el-form :model="setting" ref="setting" label-width="120px">
        <el-form-item label="关注送积分：" prop="score" :rules="[{required:true,message:'积分不能为空'},{type:'number',message:'积分必须为数字值'}]">
          <el-input placeholder="请输入..." type="age" :value.number="setting.score" auto-complete="off" @input="(v)=>changeSys({score:v*1})" style="width:90%;"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="contentBoxCont fwh_setting" v-if="tab == '2'">
      <el-form :model="sub" ref="sub" label-width="130px">
        <el-form-item label="标题：" prop="title" :rules="[{required:true,message:'标题不能为空'}]">
          <el-input placeholder="请输入..." :value="sub.title" auto-complete="off" @input="(v)=>setSub({title:v})" style="width:90%;"/>
        </el-form-item>
        <el-form-item label="图片：" prop="picurl" :rules="[{required:true,message:'图片不能为空'}]">
          <Avatar :success="()=>setSub({picurl: url})" width="360" height="200" :url="sub.picurl"/>
          <span class="av_tip">提示：支持JPG、PNG格式，360*200px</span>
        </el-form-item>
        <el-form-item label="描述：" prop="description" :rules="[{required:true,message:'描述不能为空'}]">
          <el-input placeholder="请输入..." type="textarea" :rows="5" :value="sub.description" auto-complete="off" @input="(v)=>setSub({description:v})" style="width:90%;"/>
        </el-form-item>
        <el-form-item label="URL链接地址：" prop="url" :rules="[{required:true,message:'URL链接地址不能为空'}]">
          <el-input placeholder="请输入..." :value="sub.url" auto-complete="off" @input="(v)=>setSub({url:v})" style="width:90%;"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="contentBoxCont fwh_setting" v-if="tab == '3'">
      <div v-for="(item,index) in menu.button" class="fwh_menu">
        <el-row>
          <el-col :span="3" class="menu_title">一级菜单：</el-col>
          <el-col :span="20">
            <el-input placeholder="请输入..." v-model="item.name"/>
          </el-col>
          <el-col :span="1" style="line-height: 36px">
            <img src="/static/zhxt/add.png" class="add" style="width: 26px;height: 26px;margin-left: 14px;" alt="add" @click="add(index)">
          </el-col>
        </el-row>
        <el-row v-for="(button,idx) in item.sub_button" :key="'button'+idx">
          <el-col :span="3" :offset="1" class="menu_title">二级菜单：</el-col>
          <el-col class="sub_button" :span="4">
            <el-input placeholder="请输入..." v-model="button.name"/>
          </el-col>
          <el-col class="sub_button" :span="4">
            <el-select v-model="button.type" @change="setButton(index,idx)">
              <el-option label="页面" value="view"/>
              <el-option label="事件" value="click" disabled/>
            </el-select>
          </el-col>
          <el-col class="sub_button" :span="11">
            <el-input placeholder="请输入..." v-model="button.url" v-if="button.type == 'view'"/>
            <el-select v-model="button.key" disabled style="width: 100%" v-if="button.type == 'click'">
              <el-option label="最新资讯" value="LAST_NEWS"/>
            </el-select>
          </el-col>
          <el-col :span="1" style="line-height: 36px">
            <img src="/static/zhxt/error.png" class="close" alt="close" @click="del(index,idx)">
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="tab=='4'">
      <el-form :model="setting" ref="ticket" label-width="0" class="ticket">
        <el-form-item prop="wechatTicket" :rules="[{required:true,message:'微信公众号二维码不能为空'}]">
          <Avatar :success="(wechatTicket)=>changeSys({wechatTicket})" :url="setting.wechatTicket"/>
          <div class="av_tip">微信公众号二维码，格式为JPG/PNG</div>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center">
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </div>
</template>

<script type="es6">
  import {mapGetters, mapActions} from 'vuex'
  import {getFwhMenuApi, delFwhMenuApi, createFwhMenuApi, syncfwhApi} from '../../../api/systemApi'
  import {alert, confirm} from '../../../actions'
  import Avatar from '../../../components/public/Avatar.vue'
  export default{
    data(){
      return {
        tab: '1',
        menu: {},
        sync: false
      }
    },
    components: {Avatar},
    computed: {...mapGetters(['setting', 'sub', 'action']),},
    methods: {
      ...mapActions(['getSetting', 'saveSys', 'changeSys', 'upload']),
      syncfwh(){
        this.sync = true;
        syncfwhApi().then(() => alert('同步成功！').then(() => this.sync = false)).catch(() => alert('同步失败！', 'error').then(() => this.sync = false))
      },
      submitForm() {
        if (this.tab == 3) {
          confirm('是否需要设置服务号菜单?', 'warning').then(() => delFwhMenuApi().then(() => createFwhMenuApi(this.menu).then(() => alert('设置成功！')).catch(() => alert('设置失败！', 'error'))))
        } else {
          this.$refs[['setting', 'sub', '', 'ticket'][this.tab - 1]].validate((valid) => valid ? this.saveSys() : false)
        }
      },
      changeType(){
        this.$router.replace({name: 'fwhSetting', query: {tab: this.tab}})
      },
      setSub(sub){
        this.changeSys({sub: JSON.stringify({...this.sub, ...sub})})
      },
      setButton(index, idx){
        this.menu.button[index].sub_button[idx].key || this.$set(this.menu.button[index].sub_button[idx], 'key', 'LAST_NEWS')
        this.menu.button[index].sub_button[idx].url || this.$set(this.menu.button[index].sub_button[idx], 'url', 'http://java.ichuangye.cn')
      },
      before(file){
        const isJPG = file.type == 'image/jpeg' || file.type == 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          alert('上传图片只能是 JPG 或者 PNG 格式!', 'error');
        }
        if (!isLt2M) {
          alert('上传图片大小不能超过 2MB!', 'error');
        }
        return isJPG && isLt2M;
      },
      del(index, idx){
        this.$delete(this.menu.button[index].sub_button, idx)
      },
      add(index){
        if (this.menu.button[index].sub_button.length >= 5) {
          return alert('子菜单最多为5个！', 'error')
        }
        this.$set(this.menu.button[index].sub_button, this.menu.button[index].sub_button.length, {name: '', type: 'view', url: '', key: ''})
      }
    },
    created () {
      this.tab = this.$route.query.tab || '1'
      this.getSetting();
      getFwhMenuApi().catch(({menu}) => this.menu = menu);
    },
  }
</script>
