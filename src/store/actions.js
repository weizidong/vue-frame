// api
import {
  mineApi,
  findApi,
  getByIdApi,
  mineWelfareApi,
  mineScoreApi,
  mineMsgApi,
  signApi,
  mineActivityApi,
  mineHealthApi,
  deleteApi,
  delUserApi,
  updateUserApi,
  getSignApi,
  getWeekSignApi
} from '../api/userApi'
import {welfareApi, findWelfareByIdApi, convertApi, delWelfareApi, pauseWelfareApi, updateWelfareApi, createWelfareApi} from '../api/welfareApi'
import {adminApi, loginOutApi, loginApi} from '../api/adminApi'
import {
  findActivityApi,
  findEntryListByIdApi,
  findActivityDetailApi,
  createActivityApi,
  updateActivityApi,
  deleteActivityApi,
  entryActivityApi,
  exportEntryApi
} from '../api/activityApi'
import {findRecruitApi, findRecruitDetailApi, entryRecruitApi, delRecruitApi, findRecruitEntryListByIdApi,createRecruitApi, updateRecruitApi,exportRecruitEntryApi} from '../api/recruitApi'
import {fileApi, delFileApi} from '../api/fileApi'
import {findHealthApi, findHealthDetailApi, findHealthEnterApi, exportHealthEntryApi, createHealthApi, updateHealthApi, pauseHealthApi, delHealthApi} from '../api/healthApi'
import {getSysApi, setSysApi, clearApi, initApi} from '../api/systemApi'
// type
import {SET_LIST_VAL, DEL_DATA, SET_LOGIN, SET_DATA, GET_DATA_LIST, GET_MINE, PAGE, CHANE_SELECT, DEL_LIST, SETTING, CHANGE_LIST} from './mutation-types'
// defData
import {defData, CREATE} from '../constant'
import router from '../router'
// action
import {
  msg, alert, confirm, prompt, success, error, info, warning,
  appAlert
} from '../actions'
const clear = ({commit}, key = 'user') => {
  commit(SET_DATA, defData[key]);
  commit(GET_DATA_LIST, null);
  commit(PAGE)
};
//上传文件
const upload = ({commit, state}, {file}) => fileApi(file);
// 删除文件
const delFile = ({commit, state}, [key, idx]) => delFileApi(state.data[key][idx].id, 2).then(() => commit(DEL_LIST, [key, idx]));
// 获取系统配置
const getSetting = ({commit, state}) => !state.setting.id && getSysApi().then((sys) => commit(SETTING, sys))
// go
const go = ({commit}, [name, id, query] = []) => new Promise((resolve, reject) => resolve(!name ? router.back() : router.push({
    name,
    params: id ? {id} : {},
    query
  })))
// goto
const goto = ({commit}, [name, query]) => new Promise((resolve, reject) => resolve(router.push({name, query})))
//清除page
const clearPage = ({commit}) => commit(PAGE);
// 更改page
const changePage = ({commit, state}, page) => commit(PAGE, page ? page : {page: state.page.page + 1, series: true});
//更改查询字段
const changeSelect = ({commit, state}, data) => commit(CHANE_SELECT, data);
//获取用户信息
const getUser = async({commit, state}) => commit(SET_DATA, await getByIdApi(state.route.params.id));
// 获取用户列表
const findUserList = async({commit, state}) => commit(GET_DATA_LIST, await findApi(state.page));
// 修改用户
const updateUser = ({commit, state}, user) => updateUserApi(user);
//删除用户
const delUser = ({commit}, [id, idx]) => delUserApi(id, 1).then(() => success().then(() => commit(DEL_DATA, idx))).catch(() => error('删除失败！'));
//获取我的信息
const getMine = ({commit, state}) => {
  if (!!state.login.id) {
    return new Promise((resolve) => resolve());
  }
  if (state.route.path.split('/')[2] == 'fwh') {
    return mineApi().then((mine) => commit(GET_MINE, mine)).catch(() => {
      // TODO 处理未登录情况
    });
  } else {
    return adminApi().then((mine) => commit(GET_MINE, mine)).catch(() => go({commit}, ['login']));
  }
};
// 登录
const login = async({commit, state}, admin) => {
  if (admin.id) {
    commit(GET_MINE, admin);
    go({commit, state}, ['userList']);
  } else {
    loginApi(admin).then(({user}) => {
      commit(GET_MINE, user);
      go({commit, state}, ['userList']);
    }).catch(() => alert('错误', '账号或密码错误！', 'error'));
  }
}
// 退出
const loginOut = ({commit, state}) => loginOutApi().then(() => go({
  commit,
  state
}, ['login']).then(() => commit(GET_MINE, {})));
//签到
const singin = ({commit, state}, vux) => state.login.isSign ? appAlert(vux, '您已签到') : signApi().then((res) => {
    appAlert(vux, '签到成功');
    commit(GET_MINE, {...state.login, isSign: true});
    commit(CHANGE_LIST, [state.list.length + '', res]);
  }).catch(() => appAlert(vux, '签到失败，请重试'));

// 获取周签到记录
const getWeekSign = ({commit, state}) => getWeekSignApi().then((data) => commit(GET_DATA_LIST, data))

// 获取签到记录
const getSign = ({commit, state}, id) => getSignApi(id, state.page).then((data) => commit(GET_DATA_LIST, data))
//获取我的福利
const getMineWelfare = ({commit, state}) => getMine({
  commit,
  state
}).then(async() => commit(GET_DATA_LIST, await mineWelfareApi(state.login.id, 0, state.page)));
//获取我的积分记录
const getMineScore = ({commit, state}) => getMine({
  commit,
  state
}).then(async() => commit(GET_DATA_LIST, await mineScoreApi(state.login.id, 0, state.page)));
//获取我的消息记录
const getMineMsg = ({commit, state}) => state.page.page <= state.page.pages && getMine({
  commit,
  state
}).then(async() => commit(GET_DATA_LIST, await mineMsgApi(state.page)));
//获取我的工会活动
const getMineActivity = ({commit, state}) => getMine({
  commit,
  state
}).then(async() => commit(GET_DATA_LIST, await mineActivityApi(1, state.page)));
//获取我的健身项目
const getMineHealth = ({commit, state}) => state.page.page <= state.page.pages && getMine({
  commit,
  state
}).then(async() => commit(GET_DATA_LIST, await mineHealthApi(1, state.page)));
//公共删除方法
const delMethod = async({commit, state}, idx) => deleteApi(state.list[idx].id, 1).then(() => success().then(() => commit(DEL_DATA, idx))).catch(() => error('删除失败！'));
//获取福利  兑换列表
const getWelfare = async({commit, state}) => commit(GET_DATA_LIST, await welfareApi(state.page));
//获取福利   福利详情
const getWelfareDetail = async({commit, state}, data) => {
  const {query:{id, ticket, welfareId, used}}=state.route;
  if (welfareId) {
    commit(SET_DATA, {...await findWelfareByIdApi(welfareId), ticket, id, used});
  } else if (state.route.params.id) {
    commit(SET_DATA, state.route.params.id == CREATE ? {edit: true} : {...await findWelfareByIdApi(state.route.params.id), edit: false});
  } else {
    commit(SET_DATA, data);
  }
};
//获取福利   创建福利
const createWelfare = ({commit, state}) => createWelfareApi(state.data).then(() => success('创建成功！')).catch(() => error('创建失败！'))
//获取福利   修改福利
const updateWelfare = ({commit, state}) => updateWelfareApi(state.data).then(() => success('修改成功！')).catch(() => error('修改失败！'))
// 删除福利
const delWelfare = ({commit, state}, [id, idx]) => delWelfareApi(id).then(() => commit(DEL_DATA, idx))
// 暂停开启福利
const pauseWelfare = ({commit, state}, [id, key, val]) => pauseWelfareApi(id).then(() => commit(CHANGE_LIST, [key, val]))
//获取活动相关数据   活动列表
const getActivity = async({commit, state}) => commit(GET_DATA_LIST, await findActivityApi(state.page, 0));
//获取活动相关数据   活动报名列表
const getEnter = async({commit, state}) => commit(GET_DATA_LIST, await findEntryListByIdApi(state.route.params.id, state.page));
// 导出活动报名表单
const exportEntry = ({commit, state}) => exportEntryApi(state.route.params.id, state.page);
//获取活动相关数据   活动详情
const getActivityDetail = async({commit, state}) => {
  const {params:{id}}=state.route;
  if (id == CREATE) {
    commit(SET_DATA, {edit: true, ...defData.activity});
  } else {
    commit(SET_DATA, {edit: false, ...await findActivityDetailApi(id)});
  }
};
//获取活动相关数据  报名
// const entryActivity = ({commit, state}) => entryActivityApi(state.route.params.id).then((data) => success('报名成功！')).catch((data) => error(data.msg));
//获取活动相关数据   创建活动
const createActivity = ({commit, state}) => createActivityApi(state.data).then(() => success('创建成功！')).catch(() => error('创建失败！'))
//获取活动相关数据   修改活动
const updateActivity = ({commit, state}) => updateActivityApi(state.data).then(() => success('修改成功！')).catch(() => error('修改失败！'))
//获取活动相关数据   删除活动
const deleteActivity = async({commit}, [id, idx]) => deleteActivityApi(id, 1).then(() => success().then(() => commit(DEL_DATA, idx)));
//获取健身项目相关数据   列表
const getHealth = async({commit, state}) => commit(GET_DATA_LIST, await findHealthApi(state.page));
//获取健身项目报名列表
const getHealthEnter = async({commit, state}) => commit(GET_DATA_LIST, await findHealthEnterApi(state.route.params.id, state.page));
//导出健身项目报名列表
const exportHealthEntry = ({commit, state}) => exportHealthEntryApi(state.route.params.id, state.page);
//获取健身项目相关数据   详情
const gethealthDetail = async({commit, state}) => {
  const {params:{id}}=state.route;
  if (id == CREATE) {
    commit(SET_DATA, {edit: true, ...defData.health});
  } else {
    commit(SET_DATA, {edit: false, ...await findHealthDetailApi(id)});
  }
};
//获取健身项目相关数据   创建健身项目
const createHealth = ({commit, state}) => createHealthApi(state.data).then(() => success('创建成功！')).catch(() => error('创建失败！'))
//获取健身项目相关数据   修改健身项目
const updateHealth = ({commit, state}) => updateHealthApi(state.data).then(() => success('修改成功！')).catch(() => error('修改失败！'))
//获取健身项目相关数据   删除健身项目
const delHealth = ({commit, state}, [id, idx]) => delHealthApi(id).then(() => success('删除成功！').then(()=>commit(DEL_DATA, idx)))
//获取健身项目相关数据   暂停开启健身项目
const pauseHealth = ({commit, state}, [id, key, val]) => pauseHealthApi(id).then(() => commit(CHANGE_LIST, [key, val]))
//获取招聘信息相关数据  招聘列表
const getRecruit = async({commit, state}) => commit(GET_DATA_LIST, await findRecruitApi(state.page));
//获取招聘信息相关数据  创建
const createRecruit = ({commit, state}) => createRecruitApi(state.data).then(() => success('创建成功！')).catch(() => error('创建失败！'))
//获取招聘信息相关数据  修改
const updateRecruit = ({commit, state}) => updateRecruitApi(state.data).then(() => success('修改成功！')).catch(() => error('修改失败！'))
//获取招聘信息相关数据  报名列表
const getRecruitSigin = async({commit, state}) => commit(GET_DATA_LIST, await findRecruitEntryListByIdApi(state.route.params.id,state.page));
//获取招聘信息相关数据  导出报名列表
const exportRecruitEntry = ({commit, state}) =>exportRecruitEntryApi(state.route.params.id,state.page)
//删除招聘信息
const delRecruit = ({commit, state}, [id, idx]) => delRecruitApi(id).then(() => commit(DEL_LIST, idx))
//获取招聘信息相关数据   招聘详情
const getRecruitDetail = async({commit, state}) => {
  const {params:{id}}=state.route;
  if (id == CREATE) {
    commit(SET_DATA, {edit: true, ...defData.recruit});
  } else {
    commit(SET_DATA, {...await findRecruitDetailApi(id), edit: false});
  }
};
//获取招聘信息相关数据  报名
// const entryRecruit = ({commit, state}, data) => entryRecruitApi(state.route.query.id, data).then(() => success('报名成功！')).catch((data) => error(data.msg));
// 设置值
const setData = ({commit}, data) => commit(SET_DATA, data)
// 设置LOGIN
const setLogin = ({commit}, login) => commit(SET_LOGIN, login)
// 设置数组
const setList = ({commit, state}, {key, data}) => commit(SET_DATA, {[key]: [...state.data[key], data]})
// 设置数组
const setListVal = ({commit, state}, [key, value]) => commit(SET_LIST_VAL, [key, value])
// 删除数组
const delList = ({commit, state}, [key, idx]) => commit(DEL_LIST, [key, idx])
// 修改系统设置
const changeSys = ({commit, state}, data) => commit(SETTING, data)
// 保存系统设置
const saveSys = ({commit, state}) => setSysApi(state.setting).then(() => success('修改成功！')).catch(()=>error('修改失败！'))
export default {
  getMineWelfare,
  getUser,
  findUserList,
  delMethod,  //公共删除方法
  changePage,  // 改变page
  clearPage,  // 清除page
  getMine,//获取登录信息
  setData,// 设置对象
  setLogin,// 设置login
  setList, // 设置数组
  delList, //删除数组
  setListVal,//设置数组值
  go,
  goto,
  upload,
  clear, // 清理工作
  changeSelect, // 修改查询
  getWelfareDetail,  //获取福利详情
  getMineScore,  //获取我的积分记录
  getMineMsg,    //获取我的消息记录
  getMineActivity,  //获取我的工会活动
  getMineHealth,  //获取我的健身项目
  getWelfare,    //获取福利列表
  singin,      //签到
  getWeekSign, //签到自然周
  // convertWelfare,  //兑换福利
  getActivity,     //获取工会活动
  getActivityDetail,  //获取工会活动详情
  updateActivity,//修改工会活动
  createActivity,//创建工会活动
  // entryActivity,  //报名工会活动
  getRecruit,  //获取招聘信息列表
  getRecruitSigin,  ////获取招聘报名列表
  exportRecruitEntry,  ////导出招聘报名列表
  getRecruitDetail,  // 获取招聘信息详情
  // entryRecruit,  //报名招聘
  getHealth,   //获取健身中心列表
  getHealthEnter,   //获取健身中心报名列表
  gethealthDetail, //获取健身项目详情
  exportHealthEntry, //导出健身中心报名列表
  loginOut,// 登出
  login,// 登录
  delFile,//删除文件
  getEnter,//获取报名表单
  deleteActivity,// 删除活动
  delUser,//删除用户
  exportEntry, // 导出活动报名表单
  updateUser, // 修改用户
  getSetting,//获取系统设置
  changeSys,//修改系统设置
  saveSys,//保存系统设置
  getSign,//获取签到记录
  delWelfare,// 删除福利
  pauseWelfare,// 暂停开启福利
  delRecruit,// 删除招聘信息
  createHealth,//创建健身项目
  updateHealth,//修改健身项目
  createWelfare,//创建福利
  updateWelfare,//修改福利
  delHealth,// 删除健身活动
  pauseHealth,//暂停开启健身项目
  createRecruit,//创建招聘信息
  updateRecruit,//修改招聘信息
}
