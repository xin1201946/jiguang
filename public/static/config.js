/**
 * 存放配置常量(当值不为空时会覆盖env配置)
 */
window._CONFIG = {
  // 接口父路径
  // VUE_APP_API_BASE_URL: 'http://192.168.8.119:8080/lasergun-training/',
  // VUE_APP_API_BASE_URL: 'http://192.168.8.162:8082/lasergun-training/',
  VUE_APP_API_BASE_URL: 'http://192.168.124.9:8087/lasergun-training/',
  // VUE_APP_API_BASE_URL: 'http://192.168.8.122:8080/lasergun-training/',
  // VUE_APP_API_BASE_URL: 'http://192.168.100.252:8080/lasergun-training/',
  // VUE_APP_API_BASE_URL: 'http://192.168.100.231:8080/lasergun-training/',
  // VUE_APP_API_BASE_URL: 'http://192.168.1.7:8080/lasergun-training/',
  // VUE_APP_API_BASE_URL: 'http://192.168.8.162:8087/lasergun-training/',
  // VUE_APP_API_BASE_URL: 'http://101.200.221.213:9201/lasergun-training',

  //AI 配置

  VUE_USE_AI: true, //为True则使用AI总结功能
  VUE_RAGFlow_BASE_URL: 'http://192.168.124.19',
  VUE_RAGFlow_MODEL: "qwen2.5:7b",
  VUE_RAGFlow_API_KEY: "ragflow-I5OTMwNzE2NmU5NDExZjBhZmMwN2FhNT",
  VUE_RAGFlow_Frame_URL:"http://192.168.124.19/chat/share?shared_id=89a67a386e8f11f09b5a7aa539898340&from=agent&auth=I5OTMxY2M0NmU5NDExZjBhZmMwN2FhNT&visible_avatar=1",

  // 单点登录地址
  VUE_APP_CAS_BASE_URL: '',
  // 文件预览路径
  VUE_APP_ONLINE_BASE_URL: '',
  logo: '激光射击训练系统',
  // 成绩打印赞助商图片
  printSponsorImg: 'printLogo.png',
  zbfLogo: 'zbf-logo.jpg',
  //打印的好10环方向
  jiantoushang: 'shang.png',
  jiantouxia: 'xia.png',
  jiantouzuo: 'zuo.png',
  jiantouyou: 'you.png',
  jiantouzuoxia: 'zuoxia.png',
  jiantouyouxia: 'youshang.png',
  jiantouzuoshang: 'zuoshang.png',
  jiantouyoushang: 'youshang.png',
  // 'sponsor.jpg', 'sponsor.jpg', 'sponsor.jpg'
  printSponsorBottomImgs: []
}
