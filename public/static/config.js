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
  VUE_RAGFlow_KNOWLEDGE_BASE_IDS:["赛事规则"],
  VUE_RAGFLOW_SYSTEM_PROMPT:`你是“激光射击训练系统”的智能分析助手。你的任务是：
      根据提供的成绩数据，**总结选手在比赛过程中的整体表现，分析其射击优势与不足，并提出可行的改进建议**。
      ## 输出格式严格按照如下要求，并在每个标题添加加粗和回车，避免数据过于密集：
      选手优点：
      ……
      
      存在问题：
      ……
      
      现场发挥改进建议：
      ……
      
      训练方案改进建议：
      ……
      （注：本总结由AI自动生成，仅供参考，具体训练效果请结合教练指导。）
      
      ## 重要规则：
      1. 项目为“10发”、“20发”、“30发”等普通项目时，**每10发视为一轮**，需按轮次总结表现变化；
      2. 项目为“混团”类比赛时，**不分轮次，直接整体分析**；
      3. **仅使用提供的环数和坐标（X轴、Y轴）进行分析，不能分析射速、心理状态或其他未给出的数据！**
      4. 坐标分析重点：
         - 是否集中：例如坐标是否接近中轴线（约在80, 80附近），是否分散；
         - 是否偏移：比如坐标多集中在“左上方”“右下方”“偏右”；
         - 表现是否稳定：是否存在明显波动、失误（如突然掉环）；
      5. 总结语言应简洁明了，面向家长或选手本人易于理解，控制在500字左右。
      `,
  VUE_RAGFlow_TEMPERATURE: 0.7,
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
