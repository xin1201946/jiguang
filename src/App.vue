<template>
  <a-config-provider :locale="locale">
    <div id="app" ref="app">
      <router-view />
    </div>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enquireScreen from '@/utils/device'
import _ from 'lodash'
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
  mounted() {
    this.$nextTick(() => {
      const $app = this.$refs.app;
      // 设置 屏幕 百分比 尺寸 适配
      const standardScale = "100%" / "100%";
 
      window.addEventListener(
        "resize",
        _.debounce(function () {
          const docHeight = document.body.clientHeight;
          const docWidth = document.body.clientWidth;
 
          if (docWidth < 1680) {
            const currentScale = docHeight / docWidth;
            let [scale, translate] = [0, 0];
            if (currentScale < standardScale) {
              // 以高度计算
              scale = docHeight / 1080;
              const shouleWidth = 1920 * scale;
         
              const offsetWidth = docWidth - shouleWidth;
              translate =
                offsetWidth > 0 ? `translate(${offsetWidth / 2}px, 0)` : "";
            } else {
              // 以宽度计算
              scale = docWidth / 1920;
              const shouleHeight = 1080 * scale;
              const offsetHeight = docHeight - shouleHeight;
              translate =
                offsetHeight > 0 ? `translate(0, ${offsetHeight / 2}px)` : "";
            }
            console.log(translate);
            $app.style.cssText = `
            transform: scale(${scale}) ${translate};
            transform-origin: top left;
            min-width: 1920px;
            min-height: 1080px;
          `;
          } else {
            $app.style.cssText = "";
          }
        }),
        300
      );
 
      if (document.createEvent) {
        var event = document.createEvent("HTMLEvents");
        event.initEvent("resize", true, true);
        window.dispatchEvent(event);
      } else if (document.createEventObject) {
        window.fireEvent("onresize");
      }
    });
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