//业务逻辑处理
import router from '../router'
import {mineApi, findApi, delUserApi, getByIdApi} from '../api/userApi'
import {welfareApi} from '../api/welfareApi'
import {findActivityApi,findEntryListByIdApi,findActivityDetailApi,createActivityApi} from '../api/activityApi'
import {fileApi} from '../api/fileApi'

import {GET_USER, GET_WELFARE, PAGE, GET_USER_LIST, CHANE_SELECT, DEL_USER,GET_ACTIVITY_LIST,GET_ENTER_LIST,GET_ACTIVITY_DETAIL} from './mutation-types'

//上传文件
const upload=({commit,state},data) => fileApi(data)
const successActivity= ({commit,state},{data}) => {
    console.log(data)
    commit(GET_ACTIVITY_DETAIL, {files:[...state.activityDetail.files,data]});
};

// go
const go = ({commit}, [name, id]) => router.push({name, params: {id}})
//清除page
const clearPage = ({commit}) => commit(PAGE);
//更改page
const changePage = ({commit}, data) => commit(PAGE, data);
//更改查询字段
const changeSelect = ({commit, state}, data) => {
    console.log(data)
    commit(CHANE_SELECT, data);
};

//获取我的信息
const getUser = async({commit, state}) => {
    const {params:{id}}=state.route
    const user = await getByIdApi(id);
    commit(GET_USER, user);
};
//findUserList 获取用户列表
const findUserList = async({commit, state}) => {
    const userList = await findApi(state.page);
    commit(GET_USER_LIST, userList);
};
//删除用户
const delUser = async({commit, state}, data) => {
    console.log(data[0], data[1]);
    delUserApi(data[0], data[1]);
    // const delUserOne = await delUserApi();
    commit(DEL_USER);
};


//获取福利兑换列表
const getWelfare = async({commit}) => {
    const welfare = await welfareApi();

    commit(GET_WELFARE, welfare);
};

//获取活动相关数据   活动列表
const getActivity = async({commit,state}) => {
    const activity = await findActivityApi(state.page);

    commit(GET_ACTIVITY_LIST, activity);
};
//获取活动相关数据   活动报名列表
const getEnter = async({commit,state}) => {
    const {params:{id}}=state.route;
    const activityEnter = await findEntryListByIdApi(id,state.page);
    commit(GET_ENTER_LIST, activityEnter);
};
//获取活动相关数据   活动详情
const getActivityDetail = async({commit,state}) => {
    const {params:{id}}=state.route;
    console.log(state.route);
    console.log(id);
    if (id=='creat'){
        commit(GET_ACTIVITY_DETAIL);
    }else {
        const activityDetail = await findActivityDetailApi(id);
        commit(GET_ACTIVITY_DETAIL, activityDetail);
    }
};
//获取活动相关数据   创建活动
const createActivity = async({commit,state}) => {
    createActivityApi(state.activityDetail).then(function () {
        this.$message.success('提交成功！');
        window.location.reload();
    }).catch(function () {
        this.$message.error('提交失败！');
    });
};


const changeWC = ({commit},data) => {
    console.log(data);
    commit(GET_ACTIVITY_DETAIL, data);
};


export default {
    getUser, getWelfare, findUserList, changePage, clearPage, changeSelect, delUser, go, getActivity,getEnter,getActivityDetail,changeWC,
    upload,successActivity,createActivity
}