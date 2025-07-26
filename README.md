# 激光射击竞赛管理系统 (Jiguang Shooting Competition Management System)

> 基于 Vue.js + Ant Design 的激光射击竞赛综合管理平台

当前版本： 3.1.0

## 📖 项目概述

激光射击竞赛管理系统是一个专业的射击比赛管理平台，提供从赛事创建、参赛者管理、设备控制到成绩统计的全流程数字化解决方案。系统支持实时监控、数据可视化、成绩分析等功能，为射击竞赛组织者和参与者提供完整的管理体验。

### 🎯 核心功能

- **赛事管理** - 竞赛创建、项目设置、参赛人员管理
- **设备控制** - 射击设备监控、平板终端管理、实时状态显示  
- **成绩管理** - 实时成绩记录、统计分析、报表生成
- **数据看板** - 实时数据展示、可视化图表、竞赛监控
- **用户管理** - 权限控制、角色分配、个人中心
- **系统管理** - 基础配置、日志管理、数据字典

## 🛠 技术架构

### 前端技术栈
 
- **基础框架**：[Vue.js 2.6](https://cn.vuejs.org/) - 渐进式JavaScript框架
- **UI组件库**：[Ant Design Vue](https://github.com/vueComponent/ant-design-vue) - 企业级UI设计语言
- **构建工具**：[Vue CLI 3.x](https://cli.vuejs.org/) + Webpack
- **包管理器**：yarn / npm
- **代码规范**：ESLint + Prettier
- **数据可视化**：
  - [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - 蚂蚁数据可视化引擎
  - [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation) - G2 的 Vue 封装
  - [@jiaminghi/data-view](https://github.com/DataV-Team/DataV) - 大屏数据展示组件
  - [ECharts](https://echarts.apache.org/) - 图表可视化库
- **功能组件**：
  - [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 图片裁剪组件
  - [vxe-table](https://github.com/x-extends/vxe-table) - 表格解决方案
  - [vue-print-nb-jeecg](https://github.com/jeecgboot/vue-print-nb) - 打印组件

## 📁 项目结构

```
jiguang/
├── public/                     # 静态资源目录
│   ├── index.html             # HTML 模板
│   └── favicon.ico            # 网站图标
├── src/                       # 源码目录
│   ├── api/                   # API 接口定义
│   │   ├── competition.js     # 竞赛相关接口
│   │   ├── control.js         # 设备控制接口
│   │   ├── view.js           # 查看监控接口
│   │   ├── biz.js            # 业务逻辑接口
│   │   └── ...               # 其他接口模块
│   ├── assets/               # 静态资源
│   │   ├── less/             # 样式文件
│   │   └── images/           # 图片资源
│   ├── components/           # 公共组件
│   │   ├── jeecg/            # Jeecg 框架组件
│   │   ├── chart/            # 图表组件
│   │   ├── layouts/          # 布局组件
│   │   ├── dict/             # 字典组件
│   │   └── ...               # 其他组件
│   ├── views/                # 页面视图
│   │   ├── Competition/      # 📊 竞赛管理模块
│   │   │   ├── competitionList/    # 竞赛列表管理
│   │   │   ├── gameInfo/          # 比赛信息管理
│   │   │   ├── participant/       # 参赛人员管理
│   │   │   ├── RealTimeView/      # 实时查看
│   │   │   └── ...                # 其他竞赛功能
│   │   ├── control/          # ⚙️ 控制管理模块
│   │   │   ├── device/            # 设备管理
│   │   │   ├── display/           # 显示控制
│   │   │   └── process/           # 流程控制
│   │   ├── view/             # 👁️ 查看监控模块
│   │   │   ├── score/             # 成绩查看
│   │   │   ├── deviceList/        # 设备列表查看
│   │   │   └── targetmap/         # 靶场地图
│   │   ├── biz/              # 💼 业务管理模块
│   │   │   ├── athletes/          # 运动员管理
│   │   │   ├── equipment/         # 装备管理
│   │   │   ├── project/           # 项目管理
│   │   │   └── slab/              # 平板管理
│   │   ├── DataScreen/       # 📈 数据大屏模块
│   │   │   ├── dataScreen.vue     # 主数据大屏
│   │   │   └── components/        # 大屏组件
│   │   ├── teamGroup/        # 👥 团队管理模块
│   │   │   ├── teamGroupManage/   # 团队管理
│   │   │   └── teamAchievement/   # 团队成绩
│   │   ├── personal/         # 👤 个人中心模块
│   │   │   └── personalAchievements.vue # 个人成绩
│   │   ├── system/           # 🔧 系统管理模块
│   │   │   ├── UserList.vue       # 用户管理
│   │   │   ├── RoleList.vue       # 角色管理
│   │   │   └── ...                # 系统配置
│   │   └── dashboard/        # 📊 仪表盘模块
│   │       ├── Analysis.vue       # 数据分析
│   │       └── Workplace.vue      # 工作台
│   ├── router/               # 路由配置
│   ├── store/                # Vuex 状态管理
│   ├── utils/                # 工具函数
│   ├── mixins/               # 混入
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── vue.config.js             # Vue CLI 配置
├── package.json              # 项目依赖
└── README.md                 # 项目说明
```

### 🔧 核心模块说明

#### 竞赛管理模块 (Competition)
- **竞赛列表管理** - 创建、编辑、删除竞赛活动
- **比赛信息管理** - 设置比赛规则、时间、地点等信息  
- **参赛人员管理** - 管理参赛选手信息、分组等
- **实时查看** - 实时监控比赛进行状态
- **赛程管理** - 比赛阶段和时间安排

#### 控制管理模块 (Control)
- **设备管理** - 射击设备的连接、配置和监控
- **显示控制** - 控制各显示终端的内容展示
- **流程控制** - 管理比赛流程的执行和切换

#### 查看监控模块 (View)
- **成绩查看** - 实时查看和历史成绩浏览
- **设备列表查看** - 监控所有设备的连接状态
- **靶场地图** - 可视化靶场布局和设备分布

#### 业务管理模块 (Biz)
- **运动员管理** - 参赛选手信息维护
- **装备管理** - 射击装备的登记和分配
- **项目管理** - 比赛项目的设置和管理
- **平板管理** - 平板终端设备的管理

#### 数据大屏模块 (DataScreen)
- **实时数据展示** - 大屏实时显示比赛数据
- **数据可视化** - 图表形式展示统计信息
- **监控面板** - 整体比赛状态监控

### 🧩 自定义组件说明

#### QuerySearch 查询组件
高度可配置的查询表单组件，支持多种输入类型：

```javascript
// 配置示例
{
  type: "input",        // 类型：input(输入), select(选择), range(日期选择)
  rules: ["fieldName", {}], // [字段名, 校验规则]
  label: "标签名称",      // 表单左侧文字
  placeholder: "提示文字", // 表单提示文字
  span: 4,              // 表单占位格数，超出4字符时默认为5
  range: ["start", "end"] // 日期选择的开始和结束字段名
}
```

#### Card / TreeCard 组件
提供统一的卡片布局，支持插槽：
- **query** - 查询区域
- **operator** - 操作按钮区域  
- **default** - 主要内容区域
- **tree** - 左侧树形结构（仅TreeCard）

## 🚀 快速开始

### 环境要求
- Node.js >= 12.0.0
- npm >= 6.0.0 或 yarn >= 1.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/xin1201946/jiguang.git
cd jiguang
```

2. **安装依赖**
```bash
# 使用 yarn（推荐）
yarn install

# 或使用 npm
npm install
```

3. **开发模式运行**
```bash
# 启动开发服务器（默认端口：3000）
yarn serve
# 或
npm run serve
```

4. **生产环境构建**
```bash
# 构建生产版本
yarn build
# 或
npm run build
```

5. **代码检查与修复**
```bash
# 运行 ESLint 检查
yarn lint
# 或
npm run lint
```

### 🔧 开发配置

#### 主题定制
修改 `vue.config.js` 中的 less 变量来自定义 Ant Design 主题：

```javascript
css: {
  loaderOptions: {
    less: {
      modifyVars: {
        // 主色调
        'primary-color': '#1890FF',
        'link-color': '#1890FF',
        'border-radius-base': '4px',
      },
      javascriptEnabled: true,
    }
  }
}
```

#### 环境变量配置
- `.env` - 基础环境变量
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `.env.test` - 测试环境配置

#### 代理配置
在 `vue.config.js` 中配置开发环境代理：

```javascript
devServer: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```
## 💻 使用AI功能
>[!COPTION]
> 使用AI功能请遵循当地法律法规

AI 功能 内置于 @/utils中，
使用```import { ai } from '@/utils'``` 导入即可。
初次使用需要初始化AI，让AI自动判断使用 Chrome Built-in AI ， Ollama 或者 OpenAI。
> 优先级按照: Chrome Built_in AI > ollama > OpenAI

### 初始化:

```ai.AI_HELP.check_API (检查是否支持AI 功能)```

```ai.AI_HELP.initAI (初始化AI，System Prompt)```

### 随后使用:
```ai.ASK_AI.ask_ai ```发送消息，收到后会返回信息

## 📋 开发规范

### 代码风格
- 使用 ESLint + Standard 配置
- 使用 Prettier 进行代码格式化
- Vue 单文件组件遵循官方风格指南

### 文件命名
- 组件文件：PascalCase（如：`UserList.vue`）
- 页面文件：kebab-case（如：`user-management.vue`）
- 工具文件：camelCase（如：`authUtils.js`）

### Git 提交规范
```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式修改
refactor: 代码重构
test: 测试用例
chore: 构建过程或辅助工具的变动
```

## 📚 相关文档

- [Vue.js 官方文档](https://cn.vuejs.org/v2/guide/)
- [Ant Design Vue 组件库](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn)
- [Viser-Vue 图表库](https://viserjs.github.io/demo.html#/viser/bar/basic-bar)
- [Vue CLI 配置参考](https://cli.vuejs.org/config/)

## 🤝 贡献指南

1. Fork 项目到你的 GitHub
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 💬 联系方式

如有问题或建议，请通过 Issues 或邮件联系项目维护者。

---

> 注意：项目使用 Vue CLI 3.x，请确保你的开发环境已更新到对应版本。关于 ESLint 配置，建议保持默认规则以确保代码质量一致性。