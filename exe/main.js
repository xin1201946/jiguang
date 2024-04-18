const { app, BrowserWindow, Menu } = require('electron')
// const fs = require('fs')
// const path = require('path')
const http = require('http')
// const {URL} = require('url')

function createWindow () {
  Menu.setApplicationMenu(null)
  const win = new BrowserWindow({
    show: false
    // frame: true, // false 取消标题栏 不显示左上角三个按钮可以设置false
    // resizable: true, // 放大按钮
    // closable: false, // 关闭按钮禁用
    // fullscreen: false,
    // fullscreenWindowTitle: true // 窗口的标题栏显示
  })

  win.show()

  // console.log(process.env.NODE_ENV)
  // 全屏
  win.setFullScreen(true)
  // 进入开发者工具
  // win.webContents.openDevTools({
  //   mode: 'right'
  // })
  let flag = true
  const server = http.createServer((req, res) => {
    console.log(req.headers.host)
    const reqUrl = new URL(req.url, `http://${req.headers.host}`)
    // 打开右边控制台
    if (reqUrl.pathname === '/f12') {
      // console.log(123)
      win.webContents.openDevTools({
        mode: 'right'
      })
      res.end(JSON.stringify({
        code: 200
      }))
    }
    // 是否全屏
    if (reqUrl.pathname === '/f11') {
      flag = !flag
      win.setFullScreen(flag)
      res.end(JSON.stringify({
        code: 200,
        data: flag,
        message: ''
      }))
    }
  })
  server.listen(5173)

  // 开发环境使用本地路径
  if (process.env.NODE_ENV === 'production') {
    win.loadURL('http://localhost:3000/')
    return
  }
  // 生产环境使用打包路径
  win.loadFile('lasergun-view/index.html')
}

app.whenReady().then(() => {
  createWindow()
})
