//操纵数据，修改
import {
  SET_DATA,
  GET_DATA_LIST,
  DEL_DATA,
  GET_MINE,
  PAGE,
  CHANE_SELECT,
  LOADING,
  DEL_LIST,
  SETTING,
  SET_LIST_VAL,
  CHANGE_LIST,
  SET_LOGIN,
  SET_LIST_KEY_VAL
} from './mutation-types'
import {defData} from '../constant'
export default {
  state: {
    login: {},
    page: {...defData.page},
    list: [],
    data: {admin: [], files: []},
    loading: true,
    setting: {},
  },
  mutations: {
    [LOADING] (state, loading) {
      state.loading = loading;
    },
    [SETTING] (state, setting) {
      state.setting = setting ? {...state.setting, ...setting} : {};
    },
    [GET_MINE] (state, login) {
      state.login = login?{...state.login, ...login}:{};
    },
    [SET_DATA] (state, data) { // 修改值
      state.data = data ? {...state.data, ...data} : {};
    },
    [SET_LOGIN] (state, login) { // 修改值
      state.login = login ? {...state.login, ...login} : {};
    },
    [SET_LIST_VAL](state, [key, val]){
      const keys = key.split('.')
      switch (keys.length) {
        case 1:
          return state.data[keys[0]] = val
        case 2:
          return state.data[keys[0]][keys[1]] = val
        case 3:
          return state.data[keys[0]][keys[1]][keys[2]] = val
        case 4:
          return state.data[keys[0]][keys[1]][keys[2]][keys[3]] = val
        case 5:
          return state.data[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = val
      }
    },
    [DEL_LIST] (state, [key, idx]) {
      const keys = key.split('.')
      switch (keys.length) {
        case 1:
          return state.data[keys[0]].splice(idx, 1)
        case 2:
          return state.data[keys[0]][keys[1]].splice(idx, 1)
        case 3:
          return state.data[keys[0]][keys[1]][keys[2]].splice(idx, 1)
        case 4:
          return state.data[keys[0]][keys[1]][keys[2]][keys[3]].splice(idx, 1)
        case 5:
          return state.data[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]].splice(idx, 1)
      }
    },
    [CHANGE_LIST] (state, [key, val]) {
      const keys = key.split('.')
      switch (keys.length) {
        case 1:
          return state.list[keys[0]] = val
        case 2:
          return state.list[keys[0]][keys[1]] = val
        case 3:
          return state.list[keys[0]][keys[1]][keys[2]] = val
        case 4:
          return state.list[keys[0]][keys[1]][keys[2]][keys[3]] = val
        case 5:
          return state.list[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = val
      }
    },
    [GET_DATA_LIST] (state, list) {   //获取列表
      if (list && list.pageSize) {
        if (state.page.series) {
          state.list = [...state.list, ...list.list];
        } else {
          state.list = list.list;
        }
        delete list.list;
        state.page = {...state.page, ...list}
      } else if (list) {
        state.list = [...state.list, ...list];
      } else {
        state.list = []
      }
    },
    [DEL_DATA] (state, idx) {   //删除数据
      if (state.list[idx]) {
        state.list.splice(idx, 1)
      }
    },
    [PAGE] (state, page) {
      state.page = page ? {...state.page, ...page} : {...defData.page, sort: [], order: [], filed: [], keyWord: []};
    },
    [CHANE_SELECT](state, {key, value}){
      const i = state.page.filed.indexOf(key);
      if ((!value || value == 'x') && i > -1) {          // 如果选择的全部,就删除当前的字段  也可以加上(说明当前已经有了当前字段) && i > -1
        state.page.filed.splice(i, 1);
        state.page.keyWord.splice(i, 1);
      } else if (value != 'x' && i > -1) {  // 如果已经选择，就保持不变
        state.page.keyWord[i] = value;
      } else if (value != 'x' && i == -1) {   //如果在里面不存在，就添加进去
        state.page.filed.push(key);
        state.page.keyWord.push(value);
      }
    },
  }
}
