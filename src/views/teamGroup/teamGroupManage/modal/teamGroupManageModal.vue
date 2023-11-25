<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
    :width="'50%'"
  >
    <div v-if="type !== 3" class="teamGroupManageModal">
      <a-form-model
        :labelCol="{span: 6}"
        :wrapperCol="{span: 14}"
        :rules="rules"
        ref="form"
        :model="formData"
      >
        <a-form-model-item label="赛事名称">
          <a-input disabled v-model="name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="团队编号">
          <a-input></a-input>
        </a-form-model-item>
        <a-form-model-item label="团队名称">
          <a-input></a-input>
        </a-form-model-item>
<!--        <a-form-model-item label="领队">-->
<!--          <a-input></a-input>-->
<!--        </a-form-model-item>-->
        <a-form-model-item label="教练员">
          <div style="display: flex;align-items: center">
            <a-input v-model="formData.coachName"></a-input>
            <a-icon style="cursor: pointer;margin-left: 20px" size="20" @click="plus" type="plus-circle" />
          </div>
        </a-form-model-item>
        <a-form-model-item
          :wrapperCol="{span: 14, offset: 6}"
          v-for="(coach, i) in formData.coach"
          :prop="'coach.' + i + '.value'"
          :key="coach.key"
          :rules="{
            required: true,
            message: '请输入教练员',
            trigger: 'blur',
          }"
        >
          <div style="display: flex;align-items: center">
            <a-input v-model="coach.value"></a-input>
            <a-icon
              style="cursor: pointer;margin-left: 20px"
              @click="minus(i)"
              type="minus-circle"
            />
          </div>
        </a-form-model-item>
      </a-form-model>
    </div>
<!--    <div class="teamGroupManageModal">
      <a-descriptions bordered :column="2">
        <a-descriptions-item :span="2" label="赛事名称">
        </a-descriptions-item>
        <a-descriptions-item :span="2" label="领队">
        </a-descriptions-item>
      </a-descriptions>
      <div style="margin-top: 20px">
        <a-descriptions title="甲组" bordered :column="2">
          <a-descriptions-item :span="1" label="男子手枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="男子手枪(人数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="男子步枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="男子步枪(人数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子手枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子手枪(人数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子步枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子步枪(人数)">
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div style="margin-top: 20px">
        <a-descriptions title="乙组" bordered :column="2">
          <a-descriptions-item :span="1" label="男子手枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="男子手枪(人数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="男子步枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="男子步枪(人数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子手枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子手枪(人数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子步枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子步枪(人数)">
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div style="margin-top: 20px">
        <a-descriptions title="丙组" bordered :column="2">
          <a-descriptions-item :span="1" label="男子手枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="男子手枪(人数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="男子步枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="男子步枪(人数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子手枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子手枪(人数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子步枪(分数)">
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="女子步枪(人数)">
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div style="margin-top: 20px">
        <a-descriptions>

        </a-descriptions>
      </div>
    </div>-->
    <div v-else class="teamGroupManageModal">
      <a-descriptions bordered :column="4">
        <a-descriptions-item :span="1" label="赛事名称">
          Cloud Database
        </a-descriptions-item>
        <a-descriptions-item :span="1" label="教练">
          Cloud Database
        </a-descriptions-item>
        <a-descriptions-item :span="1" label="总分数">
          50
        </a-descriptions-item>
        <a-descriptions-item :span="1" label="总人数">
          60
        </a-descriptions-item>
      </a-descriptions>
      <div style="margin-top: 20px">
        <a-descriptions bordered :column="4" title="甲组">
          <a-descriptions-item :span="2" label="项目名称">项目1</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">项目2</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">项目3</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">项目4</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
        </a-descriptions>
      </div>
      <div style="margin-top: 20px">
        <a-descriptions bordered :column="4" title="乙组">
          <a-descriptions-item :span="2" label="项目名称">项目1</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">项目2</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">项目3</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">项目4</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
        </a-descriptions>
      </div>
      <div style="margin-top: 20px">
        <a-descriptions bordered :column="4" title="丙组">
          <a-descriptions-item :span="2" label="项目名称">项目1</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">项目2</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">项目3</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">项目4</a-descriptions-item>
          <a-descriptions-item :span="1" label="人数">60</a-descriptions-item>
          <a-descriptions-item :span="1" label="分数">50</a-descriptions-item>
        </a-descriptions>
      </div>

    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'


export default {
  name: 'teamGroupManageModal',
  components: {
    BizModal
  },
  data() {
    return {
      title: '',
      visible: false,
      loadingModal: false,
      formData: {
        coach: [],
        coachName: '',
      },
      rules: {},
      type: 0,
      contestId: '',
      name: ''
    }
  },
  methods: {
    init(contestId, name) {
      this.visible = true
      this.contestId = contestId
      this.name = name
      this.type = 0
      this.title = '添加'
    },
    edit(reccord, contestId, name) {
      this.visible = true
      this.contestId = contestId
      this.name = name
      this.type = 1
      this.title = '修改'
    },
    info() {
      this.visible = true
      this.type = 3
      this.title = '详情'
    },
    handleOk() {
      this.$refs.form.validate((v) => {
        if (v) {
          if (this.type === 0) {

          }
          if (this.type === 1) {

          }
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    plus() {
      if (this.formData.coach.length < 1)
      this.formData.coach.push({
        value: '',
        key: Date.now()
      })
    },
    minus(i) {
      this.formData.coach.splice(i, 1)
    }
  }
}
</script>

<style scoped lang="less">
.teamGroupManageModal{
  height: 100%;
  overflow-y: auto;
}
</style>