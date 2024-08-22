<template>
  <div class="card">
    <Card>
      <a-tabs default-active-key="资格赛" @change="callback">
        <a-tab-pane key="资格赛" tab="资格赛">
          <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 5 }">
            <a-row :gutter="24">
              <a-col>
                <a-form-item label="平板编号">
                  <a-select allowClear mode="multiple" v-model="formData.pads" placeholder="请输入平板编号">
                    <a-select-option v-for="item in list" :key="item.pcNum" :value="item.pcNum"
                      >{{ item.pcName + '枪' + item.pcNum }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item label="总组数">
                  <a-input placeholder="请输入总组数" v-model="formData.shoots" />
                  <span class="text_s">例如40发就传4 ！！！</span>
                </a-form-item>
              </a-col>
              <a-form-item>
                <a-space class="spce_div">
                  <a-button html-type="submit" type="primary" @click="handleSubmit">发送</a-button>
                </a-space>
              </a-form-item>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="决赛" tab="决赛" force-render>
          <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 5 }">
            <a-row :gutter="24">
              <a-col>
                <a-form-item label="平板编号">
                  <a-select allowClear mode="multiple" v-model="formData.pads" placeholder="请输入平板编号">
                    <a-select-option v-for="item in list" :key="item.pcNum" :value="item.pcNum"
                      >{{ item.pcName + '枪' + item.pcNum }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item label="开始发序">
                  <a-input placeholder="请输入开始发序" v-model="formData.startShoot" />
                  <span class="text_s"> 如决赛第一组传1，第二组传6，依次类推11、13、15、17、19、21、23！！！</span>
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item label="结束发序">
                  <a-input placeholder="请输入结束发序" v-model="formData.endShoot" />
                  <span class="text_s">如决赛第一组传5，第二组传10，依次类推12、14、16、18、20、22、24！！！</span>
                </a-form-item>
              </a-col>
              <a-form-item>
                <a-space class="spce_div">
                  <a-button html-type="submit" type="primary" @click="handleSubmit">发送</a-button>
                </a-space>
              </a-form-item>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="混团" tab="混团" force-render>
          <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 5 }">
            <a-row :gutter="24">
              <a-col>
                <a-form-item label="平板编号">
                  <a-select allowClear mode="multiple" v-model="formData.pads" placeholder="请输入平板编号">
                    <a-select-option v-for="item in list" :key="item.pcNum" :value="item.pcNum"
                      >{{ item.pcName + '枪' + item.pcNum }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item label="当前发序">
                  <a-input placeholder="请输入当前发序" v-model="formData.shootCode" />
                  <span class="text_s">如第1发传1！！！</span>
                </a-form-item>
              </a-col>

              <a-form-item>
                <a-space class="spce_div">
                  <a-button html-type="submit" type="primary" @click="handleSubmit">发送</a-button>
                </a-space>
              </a-form-item>
            </a-row>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </Card>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import { bizSendScoreSend, bizSendScoreSendFinal,bizSendScoreSendTeam } from '@api/competition'
import { bizTabletPcPageList } from '@api/biz'
export default {
  name: 'achievementEquipment',
  components: {
    Card,
  },
  data() {
    return {
      formData: {},
      dataContList: [],
      list: [],
      title: '资格赛',
    }
  },
  created() {
    bizTabletPcPageList({
      pageNo: 1,
      pageSize: 999,
    }).then((res) => {
      if (res.code === 200) {
        this.list = res.result.records
      }
    })
  },

  methods: {
    handleSubmit() {
      if (this.title == '资格赛') {
        let pads = this.formData.pads.join(',')
        const data = {
          pads: pads,
          shoots: this.formData.shoots,
        }
        bizSendScoreSend(data).then((res) => {
          if (res.success) {
            this.$message.success('发送成功')
          } else {
            this.$message.error(res.message)
          }
        })
      } else if (this.title == '决赛') {
        let pads = this.formData.pads.join(',')
        const data = {
          startShoot: this.formData.startShoot,
          pads: pads,
          endShoot: this.formData.endShoot,
        }
        bizSendScoreSendFinal(data).then((res) => {
          if (res.success) {
            this.$message.success('发送成功')
          } else {
            this.$message.error(res.message)
          }
        })
      } else if (this.title == '混团') {
        let pads = this.formData.pads.join(',')
        const data = {
          pads: pads,
          shootCode: this.formData.shootCode,
        }
        bizSendScoreSendTeam(data).then((res) => {
          if (res.success) {
            this.$message.success('发送成功')
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    callback(key) {
      this.title = key
      this.formData = {}
    },
  },
}
</script>

<style lang="less" scoped>
.card {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.spce_div {
  display: flex;
  justify-content: flex-end;
}

.text_s {
  color: red;
  font-size: 14px;
}
</style>