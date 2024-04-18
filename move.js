const path = require('path')
const fs = require('fs')

const dirFile = path.resolve(__dirname, './lasergun')

const newFile = path.resolve(__dirname, './exe/lasergun-view')

// 需要判断exe文件中红的文件夹lasergun-view是否存在, 存在则删除

fs.rename(dirFile, newFile, (err) => {
  console.log(err)
})
