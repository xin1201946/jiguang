<template>
  <div class="user-wrapper" :class="theme" style='height: auto'>
    <!-- update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航 -->
    <!-- update-begin author:sunjianlei date:20191@20 for: 解决全局样式冲突的问题 -->
    <!-- <a @click="handleFullscreen">数据大屏</a> -->
    <span class="action" @click="showClick">
      <a-icon type="search"></a-icon>
    </span>
    <span class="action" @click="toggleRobotFrame">
      <a-icon type="robot" />
    </span>
    <!--  -->
    <span v-if='roleName !== "学员"' class="action action-full ant-dropdown-link user-dropdown-menu"
      @click="handleFullscreenCustom()">
      <span>自定义数据大屏</span>
    </span>
    <a-dropdown>
      <span v-if='roleName !== "学员"' class="action action-full ant-dropdown-link user-dropdown-menu"
        @click="handleFullscreen()">
        <span>数据大屏</span>
      </span>
      <!-- <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item v-for="item in dataScreenList" :key="item.configId" @click="handleFullscreen(item)" style="display: flex; align: center;">
          <span>{{item.configName}}</span>
        </a-menu-item>
      </a-menu> -->
    </a-dropdown>
    <!--  -->
    <!-- update-begin author:sunjianlei date:20200219 for: 菜单搜索改为动态组件，在手机端呈现出弹出框 -->
    <component :is="searchMenuComp" v-show="searchMenuVisible || isMobile()" class="borders"
      :visible="searchMenuVisible" title="搜索菜单" :footer="null" @cancel="searchMenuVisible = false">
      <a-select class="search-input" showSearch :showArrow="false" placeholder="搜索菜单" optionFilterProp="children"
        :filterOption="filterOption" :open="isMobile() ? true : null" :getPopupContainer="(node) => node.parentNode"
        :style="isMobile() ? { width: '100%', marginBottom: '50px' } : {}" @change="searchMethods" @blur="hiddenClick">
        <a-select-option v-for="(site, index) in searchMenuOptions" :key="index" :value="site.id">{{
    site.meta.title
  }}</a-select-option>
      </a-select>
    </component>
    <!-- update-end author:sunjianlei date:20200219 for: 菜单搜索改为动态组件，在手机端呈现出弹出框 -->
    <!-- update-end author:sunjianlei date:20191220 for: 解决全局样式冲突的问题 -->
    <!-- update_end  author:zhaoxin date:20191129 for: 做头部菜单栏导航 -->
    <!--    <span class="action">
      <a class="logout_title" target="_blank" href="http://doc.jeecg.com">
        <a-icon type="question-circle-o"></a-icon>
      </a>
    </span>-->
    <!--    <header-notice class="action" />-->
    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
        <!--        <a-avatar class="avatar" size="small" :src="getAvatar()"/>-->
        <span v-if="isDesktop()">欢迎您，{{ nickname() }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <!--        <a-menu-item key="0">-->
        <!--          <router-link :to="{ name: 'account-center' }">-->
        <!--            <a-icon type="user" />-->
        <!--            <span>个人中心</span>-->
        <!--          </router-link>-->
        <!--        </a-menu-item>-->
        <!--        <a-menu-item key="1">-->
        <!--          <router-link :to="{ name: 'account-settings-base' }">-->
        <!--            <a-icon type="setting" />-->
        <!--            <span>账户设置</span>-->
        <!--          </router-link>-->
        <!--        </a-menu-item>-->
        <a-menu-item key="3" @click="systemSetting">
          <a-icon type="tool" />
          <span>系统设置</span>
        </a-menu-item>
        <a-menu-item key="4" @click="updatePassword">
          <a-icon type="setting" />
          <span>密码修改</span>
        </a-menu-item>
        <!--        <a-menu-item key="5" @click="updateCurrentDepart">-->
        <!--          <a-icon type="cluster" />-->
        <!--          <span>切换部门</span>-->
        <!--        </a-menu-item>-->
        <a-menu-item key="6" @click="clearCache">
          <a-icon type="sync" />
          <span>清理缓存</span>
        </a-menu-item>
        <!-- <a-menu-item key="2" disabled>
          <a-icon type="setting"/>
          <span>测试</span>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>-->
      </a-menu>
    </a-dropdown>
    <span class="action">
      <a class="logout_title" href="javascript:;" @click="handleLogout">
        <a-icon type="logout" />
        <span v-if="isDesktop()">&nbsp;退出登录</span>
      </a>
    </span>
    <user-password ref="userPassword"></user-password>
    <depart-select ref="departSelect" :closable="true" title="部门切换"></depart-select>
    <setting-drawer ref="settingDrawer" :closable="true" title="系统设置"></setting-drawer>

    <!-- 光电射击赛事智能化助手浮窗 -->
    <div v-if="showRobotFrame" class="robot-frame-wrapper">
      <div class="robot-frame-content">
        <iframe
          src="http://192.168.124.19/chat/share?shared_id=89a67a386e8f11f09b5a7aa539898340&from=agent&auth=I5OTMxY2M0NmU5NDExZjBhZmMwN2FhNT&visible_avatar=1"
          style="width: 100%; height: 100%; min-height: 600px"
          frameborder="0"
        >
        </iframe>
      </div>
    </div>
  </div>
</template>

<script>
// import HeaderNotice from './HeaderNotice'
import UserPassword from './UserPassword'
import SettingDrawer from '@/components/setting/SettingDrawer'
import DepartSelect from './DepartSelect'
import axios from 'axios'
import { mapActions, mapGetters, mapState } from 'vuex'
import { mixinDevice } from '@/utils/mixin.js'
import { getFileAccessHttpUrl, getAction } from '@/api/manage'
import Vue from 'vue'
import { UI_CACHE_DB_DICT_DATA } from '@/store/mutation-types'
import { getDataScreenList } from '@/api/competition'
export default {
  name: 'UserMenu',
  mixins: [mixinDevice],
  data() {
    const roleName = sessionStorage.getItem("roleName")
    return {
      // update-begin author:sunjianlei date:20200219 for: 头部菜单搜索规范命名 --------------
      searchMenuOptions: [],
      searchMenuComp: 'span',
      searchMenuVisible: false,
      roleName,
      dataScreenList: [],
      // update-begin author:sunjianlei date:20200219 for: 头部菜单搜索规范命名 --------------
      showRobotFrame: false,
    }
  },
  components: {
    // HeaderNotice,
    UserPassword,
    DepartSelect,
    SettingDrawer,
  },
  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },
  },
  /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
  created() {
    let lists = []
    this.searchMenus(lists, this.permissionMenuList)
    this.searchMenuOptions = [...lists]

    getDataScreenList({}).then((res) => {
      this.dataScreenList = res.result
      console.log(res)
    })
  },
  mounted() {
    //如果是单点登录模式
    if (process.env.VUE_APP_SSO == 'true') {
      let depart = this.userInfo().orgCode
      if (!depart) {
        this.updateCurrentDepart()
      }
    }
  },
  computed: {
    ...mapState({
      // 后台菜单
      permissionMenuList: (state) => state.user.permissionList,
    }),
  },
  /* update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
  watch: {
    // update-begin author:sunjianlei date:20200219 for: 菜单搜索改为动态组件，在手机端呈现出弹出框
    device: {
      immediate: true,
      handler() {
        this.searchMenuVisible = false
        this.searchMenuComp = this.isMobile() ? 'a-modal' : 'span'
      },
    },
    // update-end author:sunjianlei date:20200219 for: 菜单搜索改为动态组件，在手机端呈现出弹出框
  },
  methods: {
    handleFullscreen(row, spear) {
      // 原先的
      // const pin = window.open('/DataScreen?type=' + row.configName + '&spear=' + spear, '_blank')
      // 现在的
      // process.env.NODE_ENV === "electron"
      const router = this.$router
      // DataScreen
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      // console.log(router.resolve({ name: 'DataScreen' }).href)
      // width=${screenWidth}, height=${screenHeight},
      // fullscreen=yes
      // 打开新进程全屏
      // const pin = window.open(router.resolve({ name: 'DataScreen' }).href, '_blank', `width=${screenWidth}, height=${screenHeight}, fullscreen=yes`);
      // pin.focus();
      // 最大化
      window.open(router.resolve({ name: 'DataScreen' }).href, '_blank', `width=${screenWidth}, height=${screenHeight}`)
      // axios.get("http://localhost:5173/route", {
      //   params: {
      //     route: router.resolve({ name: 'DataScreen' }).href
      //   }
      // })
      /*let isFullscreen =
        pin.document.fullScreenElement || //W3C
        pin.document.msFullscreenElement || //IE
        pin.document.mozFullScreenElement || //火狐
        pin.document.webkitFullscreenElement || //谷歌
        false
      if (!isFullscreen) {
        let el = pin.document.documentElement
        if (el.requestFullscreen) {
          el.requestFullscreen()
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen()
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen()
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          pin.document.exitFullscreen()
        } else if (document.msExitFullscreen) {
          pin.document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          pin.document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          pin.document.webkitCancelFullScreen()
        }
      }*/
    },
    // 自定义数据大屏事件
    handleFullscreenCustom() {
      const router = this.$router
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      let obj = {
        title: '自定义大屏',
        custom: true,
      }
      // 最大化
      // 暂时不用
      // window.open(router.resolve({ name: 'customsDataScreen', query: { data: encodeURI(JSON.stringify(obj)) } }).href, '_blank', `width=${screenWidth}, height=${screenHeight}`)
      window.open(router.resolve({ name: 'DataScreen', query: { data: encodeURI(JSON.stringify(obj)) } }).href, '_blank', `width=${screenWidth}, height=${screenHeight}`)
    },
    /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    showClick() {
      this.searchMenuVisible = true
    },
    hiddenClick() {
      this.shows = false
    },
    /* update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    getAvatar() {
      return getFileAccessHttpUrl(this.avatar())
    },
    handleLogout() {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              // update-begin author:scott date:20211223 for:【JTC-198】退出登录体验不好
              //that.$router.push({ path: '/user/login' });
              window.location.reload()
              // update-end author:scott date:20211223 for:【JTC-198】退出登录体验不好
            })
            .catch((err) => {
              that.$message.error({
                title: '错误',
                description: err.message,
              })
            })
        },
        onCancel() { },
      })
    },
    updatePassword() {
      let username = this.userInfo().username
      this.$refs.userPassword.show(username)
    },
    updateCurrentDepart() {
      this.$refs.departSelect.show()
    },
    systemSetting() {
      this.$refs.settingDrawer.showDrawer()
    },
    /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    searchMenus(arr, menus) {
      for (let i of menus) {
        if (!i.hidden && 'layouts/RouteView' !== i.component) {
          arr.push(i)
        }
        if (i.children && i.children.length > 0) {
          this.searchMenus(arr, i.children)
        }
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // update_begin author:sunjianlei date:20191230 for: 解决外部链接打开失败的问题
    searchMethods(value) {
      let route = this.searchMenuOptions.filter((item) => item.id === value)[0]
      //update-begin-author:sunjianlei date:20220111 for: 【JTC-702】【菜单搜索】菜单搜索里点击跳转的菜单，无法将Token信息传递过去
      if (route.component.includes('layouts/IframePageView')) {
        this.$router.push(route)
      } else {
        this.$router.push({ path: route.path })
      }
      //update-end-author:sunjianlei date:20220111 for: 【JTC-702】【菜单搜索】菜单搜索里点击跳转的菜单，无法将Token信息传递过去
      this.searchMenuVisible = false
    },
    // update_end author:sunjianlei date:20191230 for: 解决外部链接打开失败的问题
    /*update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    /*update_begin author:liushaoqian date:20200507 for: 刷新缓存*/
    clearCache() {
      getAction('sys/dict/refleshCache')
        .then((res) => {
          if (res.success) {
            //重新加载缓存
            getAction('sys/dict/queryAllDictItems').then((res) => {
              if (res.success) {
                Vue.ls.remove(UI_CACHE_DB_DICT_DATA)
                Vue.ls.set(UI_CACHE_DB_DICT_DATA, res.result, 7 * 24 * 60 * 60 * 1000)
              }
            })
            this.$message.success('刷新缓存完成！')
          }
        })
        .catch((e) => {
          this.$message.warn('刷新缓存失败！')
          console.log('刷新失败', e)
        })
    },
    /*update_end author:liushaoqian date:20200507 for: 刷新缓存*/
    toggleRobotFrame() {
      this.showRobotFrame = !this.showRobotFrame
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-dropdown-menu-item {
  align-items: center;
}

/* update_begin author:zhaoxin date:20191129 for: 让搜索框颜色能随主题颜色变换*/
/* update-begin author:sunjianlei date:20191220 for: 解决全局样式冲突问题 */
.user-wrapper .search-input {
  width: 180px;
  color: inherit;

  /deep/ .ant-select-selection {
    background-color: inherit;
    border: 0;
    border-bottom: 1px solid white;

    &__placeholder,
    &__field__placeholder {
      color: inherit;
    }
  }
}

/* update-end author:sunjianlei date:20191220 for: 解决全局样式冲突问题 */
/* update_end author:zhaoxin date:20191129 for: 让搜索框颜色能随主题颜色变换*/

.robot-frame-wrapper {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 400px;
  height: 600px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  background-color: #fff;
  border-radius: 10px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.robot-frame-header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}
.robot-frame-close {
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: #888;
  transition: color 0.2s;
}
.robot-frame-close:hover {
  color: #f5222d;
}
.robot-frame-content {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<style scoped>
.logout_title {
  color: inherit;
  text-decoration: none;
}
</style>