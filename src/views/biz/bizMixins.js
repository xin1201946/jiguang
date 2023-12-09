import { bizDeviceList, bizTabletPcList } from '@api/biz'
import Vue from 'vue'
import { ACCESS_TOKEN, TENANT_ID } from '@/store/mutation-types'



const bizMixins = {
  computed: {
    //token header
    tokenHeader(){
      let head = {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)}
      let tenantid = Vue.ls.get(TENANT_ID)
      if(tenantid){
        head['tenant-id'] = tenantid
      }
      return head;
    },
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.api}`;
    }
  },
  data(){
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
      },
      types: {
        tablePc: [],
        device: [],
        evnet: []
      },
      loadingModal: false
    }
  },
  watch: {
    $route:{
      handler(){
        if (this.getList) {
          this.$nextTick(() => {
            this.getList()
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 分页
    handleTableChange (pagination) {
      this.pagination = pagination
      this.getList()
    },
    // 添加按钮
    handleAdd(type) {
      if (type) {
        this.$refs.modal.init(type)
      }else {
        this.$refs.modal.init()
      }
    },
    // 查询重置按钮
    handleSearch(data) {
      for (const key in this.query) {
        this.query[key] = data[key]
      }
      this.pagination.current = 1
      this.$nextTick(() => {
        this.getList()
      })
    },
    // 弹窗确定回调
    handleList() {
      this.getList()
    },
    // 点击编辑
    handleEdit(record, type) {
      if (type) {
        this.$refs.modal.edit(record, type)
      }else {
        this.$refs.modal.edit(record)
      }
    },
    // 编辑弹窗初始化
    edit(row, type) {
      this.visible = true
      this.loadingModal = false
      this.title = '修改'
      this.type = 1
      if (type){
        this.getType(type)
      }
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = row[key]
        }
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    // 设置types
    getType(type) {
      switch (type) {
        // 设备集合
        case 'device':
          bizDeviceList({}).then(res => {
            this.types[type] = res.result
          })
          break
        // 平板集合
        case 'tablePc':
          bizTabletPcList().then(res => {
            this.types[type] = res.result
          })
          break
        // 赛事项目集合
        case 'evnet':
          break
      }
    },
    // 添加弹窗初始化
    init(type) {
      this.loadingModal = false
      this.visible = true
      this.title = '添加'
      this.type = 0
      if (type){
        this.getType(type)
      }
      this.$nextTick(() => {
        for (const key in this.formData) {
          if (Array.isArray(this.formData[key])) {
            this.formData[key] = []
          }else {
            this.formData[key] = ""
          }
        }
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
   // 导入
    handleImportExcel(info) {
      const { file } = info
      console.log(file)
      if (file.status === "uploading") {

      }
      if (file.status === "done") {
        const {response} = file
        // console.log(response)
        if (response.code === 200) {
          this.$message.success(response.message)
          this.pagination.current = 1
          this.$nextTick(() => {
            this.getList()
          })
        } else if(response.code === 201) {
          let { message, result: { msg, fileUrl, fileName } } = response
          let href = window._CONFIG['domianURL'] + fileUrl
          this.$warning({
            title: message,
            content: (<div>
                <span>{msg}</span><br/>
                <span>具体详情请 <a href={href} target="_blank" download={fileName}>点击下载</a> </span>
              </div>
            ),
            onOk: () => {
              this.pagination.current = 1
              this.$nextTick(() => {
                this.getList()
              })
            }
          })
        } else {
          this.$message.error(response.message)
        }
      }
    },
    downLoad(data, name) {
      if (!data || data.size === 0){
        this.$message.error("文件下载失败")
      }else{
        const blob = new Blob([data], {type: 'application/vnd.ms-excel'})
        // console.log(data)
        // const blob = new Blob([data], {type: 'application/pdf'})
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', name)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    },
    callback(res) {
      if (res.code === 200) {
        this.$message.success(res.message)
        this.handleCancel()
        this.$emit("list")
      }else {
        this.$message.error(res.message)
      }
      this.loadingModal = false
    },
    deleteCallback (res) {
      if (res.code === 200) {
        if (this.data.length === 1) {
          if (this.pagination.current !== 1) {
            this.pagination.current = this.pagination.current - 1
          }
        }
        this.$nextTick(() => {
          this.getList()
        })
        this.$message.success(res.message)
      }else {
        this.$message.error(res.message)
      }
    }
  }
}

export default bizMixins