/// 文件移动
const path = require('path')
const fs = require('fs')
const dirFile = path.resolve(__dirname, './dist')
const newFile = path.resolve(__dirname, '../')
fs.readdir(dirFile, function (err, data) {
  if (!err) {
    for (const item of data) {
      if (item.endsWith('.exe')) {
        const oldFile = path.resolve(dirFile, item)
        fs.rename(oldFile, path.resolve(newFile, item), err1 => {
          if (err1) throw err1
        })
      }
    }
  } else {
    throw err
  }
})
