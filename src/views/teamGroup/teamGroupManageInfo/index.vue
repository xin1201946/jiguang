<template>
  <Card>
    <template slot="query">
      <a-page-header @back="handleBack" title="团队信息" ></a-page-header>
    </template>
    <a-descriptions bordered :column="6">
      <a-descriptions-item label="教练">
        Cloud Database
      </a-descriptions-item>
      <a-descriptions-item label="领队">
        Cloud Database
      </a-descriptions-item>
      <a-descriptions-item label="总分数">
        50
      </a-descriptions-item>
      <a-descriptions-item label="总人数">
        10
      </a-descriptions-item>
    </a-descriptions>
    <div style="margin-top: 20px">
      <h2>甲组</h2>
      <div>
        <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-card :title="item.projectName">
              <a-descriptions>
                <a-descriptions-item label="分数">
                  {{ item.fen }}
                </a-descriptions-item>
                <a-descriptions-item label="人数">
                  {{ item.ren }}
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </div>
    <div style="margin-top: 20px">
      <h2>乙组<span style="margin-left: 40px;font-size: 16px"></span></h2>
      <div>
        <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-card :title="item.projectName">
              <a-descriptions>
                <a-descriptions-item label="分数">
                  {{ item.fen }}
                </a-descriptions-item>
                <a-descriptions-item label="人数">
                  {{ item.ren }}
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
          </a-list-item>
        </a-list>
<!--        <a-table
          bordered
          size="small"
          :columns="columns"
          :dataSource="data"
          :pagination="false"
        ></a-table>-->
      </div>
    </div>
    <div style="margin-top: 20px">
      <h2>丙组<span style="margin-left: 40px;font-size: 16px"></span></h2>
      <div>
        <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-card :title="item.projectName">
              <a-descriptions>
                <a-descriptions-item label="分数">
                  {{ item.fen }}
                </a-descriptions-item>
                <a-descriptions-item label="人数">
                  {{ item.ren }}
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
          </a-list-item>
        </a-list>
<!--        <a-table
          bordered
          size="small"
          :columns="columns"
          :dataSource="data"
          :pagination="false"
        ></a-table>-->
      </div>
    </div>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
export default {
  name: 'teamGroupManageInfo',
  components: {
    Card
  },
  data() {
    return {
      columns: [
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectName'
        },
        {
          title: '人数',
          align: 'center',
          dataIndex: 'ren'
        },
        {
          title: '分数',
          align: 'center',
          dataIndex: 'fen'
        },
      ],
      data: [
        {
          projectName: '男子十米气步枪',
          ren: '5',
          fen: '40'
        },
        {
          projectName: '男子十米气手枪',
          ren: '5',
          fen: '40'
        },
        {
          projectName: '女子十米气步枪',
          ren: '5',
          fen: '40'
        },
        {
          projectName: '女子十米气手枪',
          ren: '5',
          fen: '40'
        }
      ]
    }
  },
  methods: {
    handleBack() {}
  }
}
</script>

<style scoped lang="less">

</style>