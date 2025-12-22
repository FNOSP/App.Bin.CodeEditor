<template>
  <div id="editor-view">
    <div class="content">
      <el-tabs class="view" v-model="active" type="card" closable @tab-remove="editor.remove">
        <el-tab-pane v-for="item in editor.view" :key="item.path" :name="item.path">
          <template #label>
            <el-tooltip :content="item.path">
              <div :style="item.keep ? {} : { fontStyle: 'italic' }" @dblclick="item.keep = true">
                {{ getFileName(item.path) }}
              </div>
            </el-tooltip>

            <div v-show="item.diff" class="diff"></div>
          </template>

          <div class="img" v-if="FILE_MAP[getFileSuffix(item.path)] === 'img'">
            <el-image
              style="width: 80%; height: 80%"
              :src="getFullPath(item.path)"
              fit="contain"
              :preview-src-list="[getFullPath(item.path)]"
            />
          </div>

          <PdfEditor
            v-else-if="FILE_MAP[getFileSuffix(item.path)] === 'pdf'"
            :src="getFullPath(item.path)"
          />

          <div
            class="no-open"
            v-else-if="FILE_MAP[getFileSuffix(item.path)] || errorMap[item.path]"
          >
            <div class="t">{{ errorMap[item.path] || '不支持二进制文件的编辑' }}</div>
          </div>

          <MonacoEditor
            v-else
            ref="editorRef"
            :path="item.path"
            @diff="
              (v) => {
                item.diff = v

                if (!item.keep && v) {
                  item.keep = true
                }
              }
            "
            @error="(v) => (errorMap[item.path] = v)"
          />
        </el-tab-pane>

        <el-tab-pane :name="-1" disabled>
          <template #label>
            <div class="add" @click="open.show = 'file'">
              <el-icon><Plus /></el-icon>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>

      <el-button
        size="small"
        class="save"
        v-bind="editor.view[editor.index]?.diff ? { type: 'primary' } : { disabled: true }"
        @click="editorRef[editor.index]?.save"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Plus } from '@element-plus/icons-vue'

import MonacoEditor from '@/components/MonacoEditor.vue'
import PdfEditor from '@/components/PdfEditor.vue'

import { FILE_MAP } from '@/utils/option'
import { getFileName, getFileSuffix, getFullPath } from '@/utils/file'

import { useOpenStore } from '@/store/open'
import { useEditorStore } from '@/store/editor'

const open = useOpenStore()
const editor = useEditorStore()

const { active } = storeToRefs(editor)

const editorRef = ref<{ save: () => void }[]>([])
const errorMap = ref<{ [x: string]: string | undefined }>({})

watch(
  () => active.value,
  () =>
    editor.view.forEach(
      (item) => active.value !== item.path && !item.keep && editor.remove(item.path),
    ),
)
</script>

<style lang="scss">
#editor-view {
  position: relative;
  flex: 1;

  > .content {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;

    > .view {
      height: 100%;
      display: flex;
      flex-direction: column;

      > .el-tabs__header {
        height: 40px;
        padding-right: 56px;
        margin: 0;

        .el-tabs__nav {
          border-radius: 0;
          border: none;

          .el-tabs__item {
            position: relative;
            display: flex;
            align-items: center;
            gap: 6px;
            border-bottom: none;

            &.is-disabled {
              > .add {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                pointer-events: all;
              }
            }

            .diff {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: var(--el-text-color-placeholder);
            }

            > * {
              margin: 0;
            }
          }
        }

        .el-tabs__new-tab {
          width: 22px;
          height: 22px;
        }
      }

      > .el-tabs__content {
        flex: 1;

        > .el-tab-pane {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;

          > .img {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          > .no-open {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            > .t {
              white-space: nowrap;
              font-size: 14px;
              color: var(--el-text-color-placeholder);
            }
          }
        }
      }
    }

    > .save {
      position: absolute;
      right: 8px;
      top: 8px;
    }
  }
}
</style>
