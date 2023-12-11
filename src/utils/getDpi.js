export default function getDpi(num) {
  const inch = document.createElement("div")
  inch.style.width = "1in"
  // 将div的尺寸设置为1英寸后，它会自动根据设备的分辨率进行缩放
  document.body.appendChild(inch)
  const dpi = inch.offsetWidth
  document.body.removeChild(inch)
  const unit = Number(num)
  const inchs = unit / 25.4 // 将毫米转换为英寸,cm就除与2.54以此类推
  const px = inchs * dpi // 将英寸转换为像素
  return Math.round(px) // 四舍五入取整数像素值
}