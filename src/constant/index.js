export const CREATE = "create";
export const NOW = new Date().getTime();
export const debug = (...msg) => {
  if (process.env.NODE_ENV == 'development') {
    console.debug(...msg)
  }
}
export const healthIcon = [
  require('../../static/wx/button.png'),
  require('../../static/wx/default.png'),
  require('../../static/wx/aw.jpg'),
  require('../../static/wx/centerbg.png')
]
export const defData = {
  user: {headimgurl: require('../../static/wx/aw.jpg'), nickname: '蕾姆', birthday: NOW, sex: 1, marriage: 0, score: 0, msgNum: 0, welfNum: 0, actNum: 0, audit: 0},
  page: {page: 1, pages: 1, pageSize: 10, sort: [], order: [], filed: [], keyWord: [], start: null, end: null, series: false},
  activity: {
    name: '', picUrl: '', start: '', end: '', entryStart: '', entryEnd: '', entry: 0, score: '', sponsor: '', coSponsor: '', organizer: '', place: '', website: '', ticket: '', detail: '', rule: '', adminId: '', created: '', total: '',
    current: '', type: '', deleted: '', status: '', files: [], admin: {}
  },
  health: {dates: [], ends: [], name: '', picUrl: healthIcon[0], score: 0, starts: [], total: 0, type: 1},
  recruit: {address: '', claim: '', company: '', job: '', linkmans: [], name: '', num: 0, pay: 0, phones: [], treatment: '', start: '', end: '',},
  poll: {
    title: '',
    description: '',
    start: '',
    end: '',
    score: 0,
    time: 0,
    repetition: 0,
    days: 0,
    sync: '[]',
    rule: '',
    admin: {},
    created: '',
    questions: []
  }
};
export const fwhMenu = {
  "button": [{
    "name": "工会之声",
    "sub_button": [
      {"name": "官方网站", "type": "view", "url": "http://java.ichuangye.cn"},
      {"name": "最新动态", "type": "view", "url": "http://java.ichuangye.cn"},
      {"name": "活动展示", "type": "view", "url": "http://java.ichuangye.cn"},
      {"name": "劳模风采", "type": "view", "url": "http://java.ichuangye.cn"},
      {"name": "投票调查", "type": "view", "url": "http://java.ichuangye.cn"}
    ]
  },
    {
      "name": "为您服务",
      "sub_button": [
        {"name": "公示公告", "type": "view", "url": "http://java.ichuangye.cn"},
        {"name": "招聘信息", "type": "view", "url": "http://java.ichuangye.cn"},
        {"name": "兴趣联盟", "type": "view", "url": "http://java.ichuangye.cn"},
        {"name": "我有话说", "type": "view", "url": "http://java.ichuangye.cn"},
        {"name": "市民服务", "type": "view", "url": "http://java.ichuangye.cn"}
      ]
    },
    {
      "name": "活动福利",
      "sub_button": [
        {"name": "积分签到", "type": "view", "url": "http://java.ichuangye.cn/view/fwh/signin?appType=fwh"},
        {"name": "积分福利社", "type": "view", "url": "http://java.ichuangye.cn/view/fwh/welfare?appType=fwh"},
        {"name": "工会活动", "type": "view", "url": "http://java.ichuangye.cn/view/fwh/activity?appType=fwh"},
        {"name": "健身中心", "type": "view", "url": "http://java.ichuangye.cn/view/fwh/health?appType=fwh"},
        {"name": "个人中心", "type": "view", "url": "http://java.ichuangye.cn/view/fwh/center?appType=fwh"}
      ]
    }
  ]
}
