<template>
  <div class="RealTimeView">
    <BizModal :widths="'300px'" :title="title" :visible="visible" :footer="false" @cancel="handleCancel"
      :loading="loadingModal">
      <div class="cards">
        <a-space>
          <a-button type="primary" @click="handlePrint">成绩打印</a-button>
        </a-space>
      </div>
    </BizModal>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import BizModal from '@comp/modal/BizModal.vue'
import {
  littleScreen,
} from '@api/competition'
import {
  Time
} from '@/utils'
export default {
  name: 'reportCard',
  components: {
    Card,
    BizModal,
  },
  data() {
    return {
      title: '成绩核对单',
      visible: false,
      loadingModal: false,
      arr: {},
      type: undefined,
      datas: {},
      dataTitle: undefined
    }
  },
  created() { },
  methods: {
    init(row) {
      this.visible = true
      this.type = row
      this.dataTitle = row
      this.$nextTick(() => {
        this.getlist()
      })

    },
    getlist() {
      let datas = this.datas
      littleScreen({
        type: this.type,
      }).then((res) => {
        datas.finalEight = []
        datas.list = []
        datas.listsList = []
        const { result } = res
        datas.projectName = result.projectName
        datas.stageGroup = result.stageGroup
        datas.stageName = result.stageName
        datas.bisaiTime = result.time
        datas.contestName = result.contestName
        datas.addr = result.addr
        // 设置表头
        datas.th = [
          {
            name: '排名',
            width: '60px',
          },
          {
            name: '靶位',
            width: '60px',
          },
          {
            name: '姓名',
            width: '100px',
          },
          {
            name: '代表队',
            align: 'left',
          },
        ]
        if (result.shootGroups) {
          datas.shootGroups = result.shootGroups
          for (let i = 0; i < result.shootGroups; i++) {
            datas.th.push({
              name: `${i + 1}0`,
              width: '50px',
            })
          }
        }
        datas.th.push({ name: '总环数', width: '110px' }, { name: '备注', width: '60px' }, { name: '-', width: '30px' })
        datas.fiftyRounds = '0'
        // 判断到没有到50发
        if (result.players) {
          result.players.map((item) => {
            item.groupList.map((it, i) => {
              if (it.groupCount === 5 && Number(it.groupTotal)) {
                // this.classOption.limitMoveNum = 8
                datas.fiftyRounds = it.groupTotal
                // 设置前8名
                datas.finalEight = result.players
                  .filter((item) => item.rank <= 8)
                  .map((item, i) => {
                    return {
                      ...item,
                      total:
                        result.isGood === '是'
                          ? !item.totalScore
                            ? item.totalScore
                            : `${item.totalScore}-${item.good}x`
                          : item.totalScore,
                      notes: '',
                      bePromoted: 'Q',
                    }
                  })
                // 除了前8名
                datas.list = result.players
                  .filter((item) => item.rank > 8)
                  .map((item) => {
                    return {
                      ...item,
                      total:
                        result.isGood === '是'
                          ? !item.totalScore
                            ? item.totalScore
                            : `${item.totalScore}-${item.good}x`
                          : item.totalScore,
                      notes: '',
                      bePromoted: '',
                    }
                  })
              } else {
                // this.classOption.limitMoveNum = 16
                datas.listsList = result.players.map((item) => {
                  return {
                    ...item,
                    total:
                      result.isGood === '是'
                        ? !item.totalScore
                          ? item.totalScore
                          : `${item.totalScore}-${item.good}x`
                        : item.totalScore,
                    notes: '',
                    bePromoted: '',
                  }
                })
                // data.listsList = [
                //   ...data.listsList,
                // ]
              }
            })
          })
        }

        // this.$nextTick(() => {
        //   this.$forceUpdate()
        //   this.upload()
        // })
      })
    },
    // 资格
    bodyContent() {
      const data = this.datas
      let g = 0
      g = data.shootGroups

      const th = () => {
        const arr = []
        // if (this.groupArray && this.groupArray.length) {
        //   for (const item of this.groupArray) {
        //     arr.push(`<th>${item}</th>`)
        //   }
        //   return arr.join('')
        // }
        for (let i = 0; i < data.shootGroups; i++) {
          arr.push(`<th>${(i + 1) * 10}</th>`)
        }
        return arr.join('')
      }
      const datas = [...this.datas.listsList /*  ...this.data, ...this.data, ...this.data, ...this.data */]
      const tr = datas.map((item, trIndex) => {
        const arr = []
        for (let i = 0; i < item.groupList.length; i++) {

          arr.push(
            `<td>${item.groupList[i].groupTotal}</td>`
          )
        }
        // if (item.integrationMethod === '2' || item.integrationMethod === '3') {
        //   return `<tr >
        //       <td colspan="2">${item.rank}</td>
        //       <td colspan="2">${item.targetSite}</td>
        //       <td style="text-align: left;" colspan="2">${item.playerName}</td>
        //       <td style="text-align: left;" colspan="2">${item.groupName}</td>
        //       ${arr.join('')}
        //       // <td colspan="2">${item.total}</td>
        //       // <td colspan="1">${item.remark}</td>
        //     </tr>`
        // } else {
        return `<tr >
              <td colspan="2">${item.rank}</td>
              <td colspan="2">${item.targetSite}</td>
              <td style="text-align: left;" colspan="2">${item.playerName}</td>
              <td style="text-align: left;" colspan="2">${item.groupName}</td>
              ${arr.join('')}
              <td colspan="2">${item.total}</td>
              <td colspan="1">${item.remark ? item.remark : ''}</td>
              </tr>`
        // }
      })
      const imgs = window._CONFIG.printSponsorBottomImgs.map(
        (item, index) =>
          `<img src="../${item}" style="width: calc(${100 / window._CONFIG.printSponsorBottomImgs.length}% - ${6 * 2 * window._CONFIG.printSponsorBottomImgs.length
          }px); height: 2.8cm;margin: 0 6px"/>`
      )
      const img = imgs.length ?
        `<div class="foot" style="height: 2.8cm;padding-top: 20px;width: 100%;display: flex;justify-content: space-between">
            ${imgs.join('')}
          </div>` :
        ''
      const foot = () => {
        if (window._CONFIG.printSponsorBottomImgs.length) {
          return `<div class="foot" style="position: fixed;left: 0;width: 100%;bottom: 0;height: 5.5cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;height: 1.6cm">
                <div style="margin-bottom: 6px;font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 14px">  ${this.rank ? this.rank.join('，') : ''}</div>
              </div>
            </div>
          </div>
        </div>`
        }

        if (tr.length > 32) {
          return `<div class="foot" style="position: fixed;left: 0px;width: 100%;bottom: 0;height: 2cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;">
                <div style="font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 12px">
                  ${this.rank ? this.rank.join('，') : ''}
                </div>
              </div>
            </div>
          </div>
        </div>`
        } else {
          return `<div class="foot" style="position: fixed;left: 0px;width: 100%;bottom: 0;height: 2.6cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;">
                <div style="font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 12px">
                  ${this.rank ? this.rank.join('，') : ''}
                </div>
              </div>
            </div>
          </div>
        </div>`
        }
      }
      const pages = []
      // <img src="${ process.env.NODE_ENV === 'electron' ? window._CONFIG.zbfLogo : '../' + window._CONFIG.zbfLogo }" style="position: absolute;top: 0;left: 0;right: 0;width: 20%" alt="">
      pages.push(`
<div">
                    <h2 style="font-size: 20px;text-align: center;">${data.contestName}</h2>
                    <h3 style="text-align: center;">
                      ${data.projectName}
                    </h3>
                    <h4 style="text-align: center">资格赛 -第 ${data.stageGroup}组</h4>
                    <p style="text-align: center">${data.addr}</p>
                    <p style="text-align: center;">${Time(
        data.bisaiTime,
        'YYYY/MM/DD'
      )}, 开始时间 ${Time(data.bisaiTime, 'HH:mm')}</p>
                  </div>

          <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;font-size:14px;">
            <thead>
              <!-- <tr >
                <th colspan='${11 + g}' rowspan='1' style='border: 0;'>
                    <h2 style="font-size: 20px;text-align: center;margin-top: 60px;">${data.contestName}</h2>
                    <h3 style="text-align: center;padding: 0;">${data.projectName}</h3>
                    <h4 style="text-align: center">资格赛 - 第 ${data.stageGroup} 组</h4>
                    <p style="text-align: center">${data.addr}</p>
                    <p style="text-align: center;">>${Time(
        data.bisaiTime,
        'YYYY/MM/DD'
      )}, 开始时间 ${Time(data.bisaiTime, 'HH:mm')}</p>
                </th>
              </tr> -->
              <tr>
                <th rowspan="2" colspan="2">排名</th>
                <th rowspan="2" colspan="2">靶位</th>
                <th rowspan="2" colspan="2" style="text-align: left">姓名</th>
                <th rowspan="2" colspan="2" style="text-align: left">代表队</th>
                <th colspan="${g}">组</th>
                <th rowspan="2" colspan="2">总计</th>
                <th rowspan="2">备注</th>
              </tr>
              <tr>${th()}</tr>
            </thead>
            <tbody> ${tr.join('')}</tbody>
            <tfoot>
              <tr style="margin-top: 1cm">
                <td colspan="${g + 7}" style="height: 4cm; margin-top: 20px"></td>
              </tr>
            </tfoot>
          </table>
        `)
      // if (tr.length > 40) {
      //   // <img src=" ${ process.env.NODE_ENV === 'electron' ? window._CONFIG.zbfLogo : '../' + window._CONFIG.zbfLogo }" style="position: absolute;top: 0;left: 0;right: 0;width: 20%" alt="">
      //   pages.push(`
      //     <div style="position: relative;overflow: hidden;">
      //       <h2 style="font-size: 20px;text-align: center;margin-top: 80px;">${data.contestName}</h2>
      //       <h3 style="text-align: center;padding: 0;">
      //         ${data.projectName}
      //       </h3>
      //       <h3 style="text-align: center">资格赛 -第 ${data.stageGroup}组</h4>
      //       <p style="text-align: center">${data.addr}</p>
      //       <p style="text-align: center;margin-bottom: 1cm">${Time(
      //   data.bisaiTime,
      //   'YYYY/MM/DD'
      // )}, 开始时间 ${Time(data.bisaiTime, 'HH:mm')}</p>
      //     </div>
      //     <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;font-size:14px;">
      //       <thead>
      //         <tr>
      //           <th rowspan="2" colspan="2">排名</th>
      //           <th rowspan="2" colspan="2">靶位</th>
      //           <th rowspan="2" colspan="2" style="text-align: left; font-weight: 800;">姓名</th>
      //           <th rowspan="2" colspan="2" style="text-align: left; font-weight: 800;">代表队</th>
      //           <th colspan="${g}">组</th>
      //           <th rowspan="2" colspan="2">总计</th>
      //           <th rowspan="2">备注</th>
      //         </tr>
      //         <tr>${th()}</tr>
      //       </thead>
      //       <tbody> ${tr.slice(40, tr.length).join('')} </tbody>
      //       <tfoot>
      //         <tr style="margin-top: 1cm">
      //           <td colspan="${g + 7}" style="height: 4cm; margin-top: 20px"></td>
      //         </tr>
      //       </tfoot>
      //     </table>
      //   `)
      // }
      // <h3 style="text-align: center">资格赛</h3>
      // <p style="text-align: center">${contest.location}</p>


      // console.log(this.rank);
      return `
      <style>
        td{text-align: center}
        th{border: 1px solid;}
        @media print {
          @page{
            margin-top: 2cm;
            margin-bottom: 0cm;
          }
        }
        td:nth-of-type(4){
          text-align: left;
          /*text-indent: 4rem*/
        }
        td:nth-of-type(3){
          text-align: left;
          /*text-indent: 4rem*/
        }
        td:last-of-type{
         /*text-align: left;*/
        }
        th{
          font-weight: 800;
        }
        h1,h2,h3,h4,p{
          margin: 0;
          padding: 0;
        }
      </style>
      <div>
        ${pages.join("")}
        ${foot()}
      </div>`
    },
    // ${foot()}
    // 混团
    groupContent() {
      const contest = this.treeList.filter((item) => item.contestId === this.contestId)[0]
      const contestName = this.treeList.filter((item) => item.contestId === this.contestId)[0].contestName
      const label = this.list.filter((item) => item.value === this.tree)[0]
      const j = this.data.filter((item) => item.stageGroup === 1)
      const y = this.data.filter((item) => item.stageGroup === 2)
      const project = this.list.filter((item) => item.value === this.tree)[0]
      const jtr = () => {
        return j
          .map((item, k) => {
            return `
            <tr>
              <td style="font-family: 微软雅黑;font-weight: 700;"">${item.i}</td>
              <td style="text-align: left;">${item.groupName}</td>
              <td style="font-family: 微软雅黑;font-weight: 700;">${item.total}</td>
              <td style="font-family: 微软雅黑;font-weight: 700;">${item.stageTotal}</td>
              <td style="">${k === 0 ? '金牌' : k === 1 ? '银牌' : ''}</td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player2Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player1Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `
          })
          .join('')
      }
      const ytr = () => {
        return y
          .map((item, k) => {
            return `
            <tr>
              <td style="font-family: 微软雅黑;font-weight: 700;">${item.i}</td>
              <td style="text-align: left">${item.groupName}</td>
              <td style="font-family: 微软雅黑;font-weight: 700;">${item.total}</td>
              <td style="font-family: 微软雅黑;font-weight: 700;">${item.stageTotal}</td>
              <td style="">${k === 0 ? '铜牌' : ''}</td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player2Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player1Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `
          })
          .join('')
      }

      const jdiv = j.length ?
        `<h4>金牌赛</h4>
            <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
              <thead>
                <tr>
                  <th>排名</th>
                  <th style="text-align: left; width: 150px">姓名</th>
                  <th>总分</th>
                  <th>总环数</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                ${jtr()}
              </tbody>
              <tfoot>
                <tr style="margin-top: 1cm">
                  <td colspan="5" style="height: 3cm; margin-top: 20px"></td>
                </tr>
              </tfoot>
            </table>` :
        ''
      const ydiv = y.length ?
        `<h4>铜牌赛</h4>
            <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
              <thead>
                <tr>
                  <th>排名</th>
                  <th style="text-align: left">姓名</th>
                  <th>总分</th>
                  <th>总环数</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                ${ytr()}
              </tbody>
              <tfoot>
                <tr style="margin-top: 1cm">
                  <td colspan="5" style="height: 3cm; margin-top: 20px"></td>
                </tr>
              </tfoot>
            </table>` :
        ''
      const imgs = window._CONFIG.printSponsorBottomImgs.map(
        (item, index) =>
          `<img src="../${item}" style="width: calc(${100 / window._CONFIG.printSponsorBottomImgs.length}% - ${6 * 2 * window._CONFIG.printSponsorBottomImgs.length
          }px); height: 2.5cm;margin: 0 6px"/>`
      )
      return `
        <style>td{text-align: center}th{border: 1px solid;}body{height: 80vh;margin: 0;padding: 0;}</style>
        <div>
          <div style="height: 90vh">
            <div style="position: relative;ovflow: hidden;">
              <h1 style="text-align: center; font-size: 24px;margin-top: 100px;">${contestName}</h1>
              <h2 style="text-align: center">${label.label.split('-').reverse().join('')}</h2>
              <h3 style="text-align: center">奖牌赛</h3>
              <p style="text-align: center">${contest.location}</p>
              <p style="text-align: center;margin-bottom: 1cm">${Time(
        project.projectTimeStart,
        'YYYY/MM/DD'
      )}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
            </div>
            <div>
              ${jdiv}
              <br/>
              ${ydiv}
            </div>
          </div>
        </div>
      `
    },
    // 决赛 || 淘汰赛
    content() {
      const contestName = this.treeList.filter((item) => item.contestId === this.contestId)[0].contestName
      const label = this.list.filter((item) => item.value === this.tree)[0]
      const group = this.stageArr.filter((item) => this.dataTitle.includes(item.stageName))[0].groupCount
      const project = this.list.filter((item) => item.value === this.tree)[0]
      let g = 0
      // console.log(this.stageArr.filter((item) => this.dataTitle.includes(item.stageName)), 123456)
      // console.log(this.groupArray)
      if (this.groupArray && this.groupArray.length) {
        g = this.groupArray.length
      } else {
        g = group
      }
      const th = () => {
        const arr = []
        if (this.groupArray && this.groupArray.length) {
          for (const item of this.groupArray) {
            arr.push(`<th >${item}</th>`)
          }
          return arr.join('')
        }
        for (let i = 0; i < group; i++) {
          arr.push(`<th>${(i + 1) * 10}</th>`)
        }
        return arr.join('')
      }
      const tr = this.data.map((item) => {
        const arr = []

        for (let i = 0; i < this.groupArray.length; i++) {
          arr.push(
            `<td style="font-family: 微软雅黑;font-weight: 700;"><b>${item.scoreList[i] || ''}</b></td>`
          )
        }
        // console.log(arr)
        const list = this.groupArray && this.groupArray.length ? this.groupArray : []
        const array = []
        // console.log(list)
        if (list.length) {
          for (let i = 0; i < list.length; i++) {
            if (i === 0) {
              array.push({
                value: list[i],
                arr: item.detailScoreList.slice(0, list[i]),
              })
            } else {
              array.push({
                value: list[i],
                arr: item.detailScoreList.slice(list[i - 1], list[i]),
              })
            }
          }
        }
        // shoots
        // console.log(array)
        // 最大多少行
        const trs = Math.max(...array.map((i) => i.arr.length))
        const rows = []
        for (let i = 0; i < trs; i++) {
          const j = []
          for (const k of array) {
            // console.log(k,  k.arr[i] )
            j.push(`<td style="font-size: 14px">${k.arr[i] ? parseFloat(k.arr[i].score).toFixed(1) : ''}</td>`)
          }
          // console.log(j)
          // console.log(j)
          rows.push(`
            <tr>
              <td style="font-size: 14px" colspan="2"></td>
<!--              <td style="font-size: 14px;" colspan="2"></td>-->
              <td style="font-size: 14px;" colspan="2"></td>
              <td style="font-size: 14px;" colspan="2"></td>
              ${j.join('')}
              <td style="font-size: 14px;" colspan="2"></td>
              <td style="font-size: 14px;"></td>
            </tr>
          `)
        }

        // console.log(rows)
        // console.log(tr())
        // console.log(rows)
        //  <td colspan="2">${item.targetSite}</td>
        return `
          <tr>
            <td colspan="2" style="line-height: 35px;text-align: center;">${item.i}</td>

            <td colspan="2" style="line-height: 35px;text-align: left;">${item.playerName}</td>
            <td colspan="2" style="line-height: 35px;text-align: left;">${item.groupName}</td>
            ${arr.join('')}
            <td colspan="2" style="font-family: 微软雅黑;font-weight: 700;"><b>${item.stageTotal}</b></td>
            <td colspan="2" style="font-family: 微软雅黑;font-weight: 700;">${item.remark ? item.remark : ''}</td>
          </tr>
          ${rows.join('')}
        `
      })

      const imgs = window._CONFIG.printSponsorBottomImgs.map(
        (item, index) =>
          `<img src="${item}" style="width: calc(${100 / window._CONFIG.printSponsorBottomImgs.length}% - ${6 * 2 * window._CONFIG.printSponsorBottomImgs.length
          }px); height: 2.8cm;margin: 0 6px"/>`
      )
      // console.log(imgs)
      const img = imgs.length ?
        `<div class="foot" style="height: 2.8cm;padding-top: 20px;width: 100%;display: flex;justify-content: space-between">
            ${imgs.join('')}
          </div>` :
        ''

      console.log(this.rank, 'rank');
      // const foot = () => {
      //   if (window._CONFIG.printSponsorBottomImgs.length) {
      //     return `<div class="foot" style="position: fixed;left: 0;width: 100%;bottom: 0;height: 5.5cm">
      //     <div class="footer" style="width: 100%;">
      //       <div style="width: 100%;border: 0px solid;height: 2cm">
      //         <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;height: 1.6cm">
      //           <div style="margin-bottom: 6px;font-size: 14px">备注</div>
      //           <div style="color: #595656;font-size: 14px">${this.rank.join('，')}</div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>`
      //   }
      //   return `<div class="foot" style="position: fixed;left: 0px;width: 100%;bottom: 0px;height: 2.7cm">

      //     <div style="width: 100%;" class="footer">
      //       <div style="width: 100%;border: 0px solid;height: 2cm">
      //         <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;">
      //           <div style="margin-bottom: 6px;font-size: 14px">备注</div>
      //           <div style="color: #595656;font-size: 14px">
      //             ${this.rank.join('，')}
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>`
      // }

      const pages = []
      const p = this.sgTimeStart ? `<p style="text-align: center;margin: -.3cm 0 0.3cm">${Time(this.sgTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(this.sgTimeStart, 'HH:mm')}</p>` : "<p></p>"
      pages.push(`
           <div style=';height: 100vh'>
            <div style="position: relative;overflow: hidden">
          <div ">
            <h1 style="text-align: center;font-size: 24px;margin-top: 100px;">${contestName}</h1>
            <h2 style="text-align: center">${this.dataTitle}成绩</h2>
            <h3 style="text-align: center">
              ${label.projectGroup}${label.projectName}
            </h3>
            ${p}
          </div>
        </div>
        <table class="table" align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
          <thead>
            <tr style="padding-bottom: 1cm">
              <th rowspan="2" colspan="2">排名</th>
<!--              <th rowspan="2" colspan="2">靶位</th>-->
              <th rowspan="2" colspan="2" style='width: 60px'>姓名</th>
              <th rowspan="2" colspan="2" style='width: 290px'>代表队</th>
              <th colspan="${g}">组</th>
              <th rowspan="2" colspan="2">总计</th>
              <th rowspan="2">备注</th>
            </tr>
            <tr>${th()}</tr>
          </thead>
          <tbody>${tr.slice(0, 4).join('')}
          </tbody>

          <tfoot>
            <tr style="margin-top: 1cm">
              <td colspan="${g + 7}" style=" margin-top: 20px">

              </td>
            </tr>
          </tfoot>
        </table>
</div>
        `)
      if (tr.length > 3) {
        pages.push(`
<div style='height: 90vh'>
 <div style="position: relative;overflow: hidden">
          <div ">
            <h1 style="text-align: center;font-size: 24px;margin-top: 100px;">${contestName}</h1>
            <h2 style="text-align: center">${this.dataTitle}成绩</h2>
            <h3 style="text-align: center">
              ${label.projectGroup}${label.projectName}
            </h3>
            ${p}
          </div>
        </div>
        <table class="table" align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
          <thead>
            <tr style="padding-bottom: 1cm">
              <th rowspan="2" colspan="2">排名</th>
<!--              <th rowspan="2" colspan="2">靶位</th>-->
              <th rowspan="2" colspan="2" style='width: 60px'>姓名</th>
              <th rowspan="2" colspan="2" style='width: 290px'>代表队</th>
              <th colspan="${g}">组</th>
              <th rowspan="2" colspan="2">总计</th>
              <th rowspan="2">备注</th>
            </tr>
            <tr>${th()}</tr>
          </thead>
          <tbody>${tr.slice(4, tr.length).join('')}
          </tbody>

          <tfoot>
            <tr style="margin-top: 1cm">
              <td colspan="${g + 7}" style=" margin-top: 20px">

              </td>
            </tr>
          </tfoot>
        </table>
</div>

        `)
      }
      console.log(this.rank, 'rank');
      return `
      <style>
        td{text-align: center}
        th{border: 1px solid;}
        body{margin: 0;padding: 0}
        tfoot>tr>td{
          height: 5.6cm;
        }
        @media print {
          size: A4;
          @page{
            margin: 0;
			margin-top: 2.3cm;
          }
        }
      </style>
        <div>
        ${pages.join("")}
       
      </div>`
    },
    //  ${foot()}
    // 打印
    handlePrint() {
      console.log(123)
      const print = (fn) => {
        const title = this.dataTitle
        const iframe = document.createElement('iframe')
        document.body.appendChild(iframe)
        iframe.contentWindow.document.open()
        iframe.contentWindow.document.write(fn)
        iframe.width = '100%'
        iframe.height = '800px'
        iframe.contentWindow.addEventListener('beforeprint', () => {
          function getNumberOfPages() {
            // A4纸高度
            const totalHeight = 1123
            const foot = iframe.contentDocument.querySelector('.foot')
            const body = iframe.contentDocument.body.scrollHeight
            const pageHeight = body + foot.scrollHeight
            const pageCount = Math.ceil(pageHeight / totalHeight)
            console.log(title)
            // 显示
            if (pageCount === 1) { }
            // 隐藏 追加
            else {
              const footer = iframe.contentDocument.querySelector('.footer')
              const newfooter = iframe.contentDocument.createElement('div')
              newfooter.innerHTML = footer.innerHTML
              if (title.includes('决赛')) {
              }
              // 资格赛
              else {
                console.log(totalHeight, pageCount, foot.scrollHeight)
                console.log((foot.scrollHeight * pageCount) * 3)
                if (window._CONFIG.printSponsorBottomImgs.length) {
                  newfooter.style.marginTop =
                    totalHeight * pageCount -
                    (body + foot.scrollHeight + foot.scrollHeight / 2) +
                    'px'
                  newfooter.style.marginBottom = foot.scrollHeight / 2 + 'px'
                } else {
                  // newfooter.style.marginTop = '450px'
                  newfooter.style.marginTop = (foot.scrollHeight * pageCount) + 'px'
                }
              }
              footer.style.visibility = 'hidden'
              iframe.contentDocument.body.append(newfooter)
            }
          }
          // if (!title.includes('团体')) {
          getNumberOfPages()
          // }
        })
        iframe.contentWindow.addEventListener('afterprint', () => {
          document.body.removeChild(iframe)
        })
        setTimeout(() => {
          iframe.contentWindow.print()
          iframe.contentWindow.document.close()
          document.body.removeChild(iframe)
        }, 50)
      }
      if (this.dataTitle.includes('团体')) {
        print(this.groupContent())
      } else {
        if (this.dataTitle.includes('决赛') || this.dataTitle.includes('淘汰赛')) {
          print(this.content())
        } else {
          // 资格赛
          print(this.bodyContent())
        }
      }
    },
    // 关闭
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped lang="less">
@btnHeight: 50px;
@height: 46px;

.RealTimeView {
  height: 100%;
  overflow-y: hidden;

  /deep/.treeCard[data-v-1f5a15ad] .ant-card-body {
    height: 100%;
    overflow-y: auto;
  }

  .btns {
    height: @btnHeight;
    background: #fff;
    margin-bottom: 10px;
    line-height: @btnHeight;
    overflow: hidden;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    justify-content: space-between;

    /deep/.ant-page-header-heading {
      display: flex;
      align-items: center;
    }
  }

  .cards {
    height: calc(100% - @btnHeight - 10px);
  }
}

.box_box {
  width: 100%;
  height: 100%;
  padding: 30px 30px 10px 30px;
  // border: 2px solid #2174B6;
}

.head {
  height: 9%;
  font-size: 24px;
  font-weight: 800;
  padding: 30px 30px 10px 30px;

  .top {
    display: flex;
    align-items: start;
    justify-content: space-between;

    .left {
      display: flex;
      font-size: 26px;

      .logo {
        height: 70px;
        margin-top: -20px;
      }
    }

    .right {
      font-size: 22px;
      text-align: right;

      .nameTitle {}

      .times {
        letter-spacing: 6px;
      }
    }
  }

  // .bottom {
  //   margin-top: 10px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  // }
}

.th {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 800;
  height: 45px;
  line-height: 40px;
  margin-bottom: 5px;
  border-bottom: 2px solid #2174b6;
  color: #000;

  &>div {
    flex: 1;
    text-align: center;
  }
}

.finalEight {
  // display: flex;
  // justify-content: space-between;
  padding-bottom: 5px;
  border-bottom: 2px solid #2174b6;
}

.finalEightRow {
  flex: 1;
  display: flex;
  justify-content: space-between;
  height: @height;
  line-height: @height;
  color: rgb(247, 255, 214);

  div {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.taotai {
  color: rgb(112, 112, 112) !important;
}

.tongfen {
  color: #ff0000 !important;
}

.foot {
  height: calc(100% - 10% - (@height * 8) - 40px);
  overflow: hidden;
}

.foots {
  height: calc(100% - 10% - 40px);
  overflow: hidden;
}

.spanDiv {
  width: 45px;
  height: 1px;
  background: #fff;
  text-align: center;
  position: absolute;
  bottom: 10%;
  left: 22%;
}
</style>