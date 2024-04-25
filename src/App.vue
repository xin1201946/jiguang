<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enquireScreen from '@/utils/device'

export default {
  data() {
    return {
      locale: zhCN,
    }
  },
  created() {
    let that = this
    enquireScreen((deviceType) => {
      // tablet
      if (deviceType === 0) {
        that.$store.commit('TOGGLE_DEVICE', 'mobile')
        that.$store.dispatch('setSidebar', false)
      }
      // mobile
      else if (deviceType === 1) {
        that.$store.commit('TOGGLE_DEVICE', 'mobile')
        that.$store.dispatch('setSidebar', false)
      } else {
        that.$store.commit('TOGGLE_DEVICE', 'desktop')
        that.$store.dispatch('setSidebar', true)
      }
    })
    const resize = new ResizeObserver((entries) => {
      const targetWidth = 1912;
      const targetHeight = 1017;

      // 获取窗口的宽度和高度

      entries.forEach((entry) => {
        const windowWidth = entry.contentRect.width;
        const windowHeight = entry.contentRect.height;
        // console.log(entry.contentRect)
        // console.log(entry.target)

        // 缩放比例
        const scaleX = windowWidth / targetWidth;
        const scaleY = windowHeight / targetHeight;
        // 选择较小的缩放比例，以确保图像完全适合窗口
        const scale = Math.min(scaleX, scaleY);
        // console.log(scale)
        // 缩放 body 元素
        // document.body.style.transformOrigin = 'top left';
        // document.body.style.transform = 'scale(' + scale + ')';
        //
        // // 调整 body 元素的宽度和高度，以匹配缩放后的大小
        // document.body.style.width = (targetWidth * scale) + 'px';
        // document.body.style.height = (targetHeight * scale) + 'px';
      })
    })
    resize.observe(document.body)
  },
  updated() {
    console.log(window.innerWidth)
  }
}
</script>
<style l>
#app {
  height: 100%;
}
/*::-webkit-scrollbar {
  display: none;
}*/
.ant-table-body::-webkit-scrollbar {
  display: block;
  width: 0 !important;
}
.gameInfoEdit .ant-table-body::-webkit-scrollbar {
  display: block;
  width: 8px !important;
}
</style>