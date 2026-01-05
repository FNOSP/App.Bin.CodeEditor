<template>
  <el-dialog v-model="camera.show" title="文件快照" width="600">
    <div class="camera-dialog">
      <el-input v-model="input" placeholder="请输入快照说明" class="input" maxlength="32" show-word-limit>
        <template #append>
          <el-button
            @click="
              () => {
                camera.add(input)
                input = ''
              }
            "
          >
            添加快照
          </el-button>
        </template>
      </el-input>

      <el-table :data="camera.data" empty-text="暂无快照" height="400">
        <el-table-column label="快照说明" width="250" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.name.replace(/\.txt$/, '') }}
          </template>
        </el-table-column>

        <el-table-column label="创建日期" width="180">
          <template #default="scope">
            {{ dayjs(scope.row.createDate).format('YYYY/MM/DD HH:mm:ss') }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div style="display: flex; justify-content: center">
              <el-button size="small" @click="camera.usage(scope.$index)">使用</el-button>
              <el-button size="small" @click="camera.del(scope.$index)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { useCameraStore } from '@/store/camera'
import { dayjs } from 'element-plus'

const camera = useCameraStore()

const input = ref('')
</script>
