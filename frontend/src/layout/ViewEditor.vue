<template>
  <div id="editor-view">
    <div class="content">
      <el-tabs class="view" v-model="active" type="card" closable @tab-remove="editor.remove">
        <el-tab-pane v-for="item in editor.view" :key="item.path" :name="item.path">
          <template #label>
            <el-tooltip :content="item.path">
              <div :style="item.keep ? {} : { fontStyle: 'italic' }" @dblclick="item.keep = true">
                {{ item.path.split('/').pop() }}
              </div>
            </el-tooltip>

            <div v-show="item.diff" class="diff"></div>
          </template>

          <MonacoEditor
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
          />
        </el-tab-pane>

        <el-tab-pane :name="-1" disabled>
          <template #label>
            <div class="add" @click="open.show = true">
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

import { useOpenStore } from '@/store/open'
import { useEditorStore } from '@/store/editor'

const open = useOpenStore()
const editor = useEditorStore()

const { active } = storeToRefs(editor)

const editorRef = ref<{ save: () => void }[]>([])

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
  z-index: 1;
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
