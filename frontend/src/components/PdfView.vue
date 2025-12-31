<template>
  <div class="pdf-view" v-if="pages.length">
    <div class="head">
      <el-icon :class="{ active: left.outline }" @click="left.outline = !left.outline">
        <Notebook />
      </el-icon>

      <div style="flex: 1"></div>

      <el-input-number
        v-model="option.scale"
        :min="10"
        :max="200"
        :step="10"
        size="small"
        @change="changeScale"
        style="width: 140px"
      >
        <template #prefix>
          <span>比例</span>
        </template>
        <template #suffix>
          <span>%</span>
        </template>
      </el-input-number>

      <el-input-number
        v-model="option.cur"
        :min="1"
        :max="pages.length || 1"
        :step="1"
        size="small"
        @change="changeCur(option.cur)"
        style="width: 160px"
      >
        <template #prefix>
          <span>页码</span>
        </template>
        <template #suffix>
          <span>/{{ pages.length }}</span>
        </template>
      </el-input-number>
    </div>

    <div class="body">
      <div class="left" v-show="left.outline" :style="{ width: `${left.width}px` }">
        <el-tree
          :data="outline"
          :props="{ children: 'items', label: 'title' }"
          :expand-on-click-node="false"
          @node-click="outlineClick"
        />

        <ClickMove @move="(v) => changeLeftWidth(v.x)" />
      </div>
      <div class="right">
        <div class="pages" ref="views" @scroll="onScroll">
          <div v-for="(_, i) in pages" :key="i" class="i">
            <canvas
              ref="canvas"
              :height="params.height * params.dpr"
              :width="params.width * params.dpr"
              :style="{ height: `${params.height}px`, width: `${params.width}px` }"
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, toRaw, useTemplateRef } from 'vue'
import { Notebook } from '@element-plus/icons-vue'
import { debounce } from 'lodash'

import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

import ClickMove from '@/components/ClickMove.vue'

import { getFullPath } from '@/utils/file'
import type { TreeNodeData } from 'element-plus'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

interface OutlineModel {
  title: string
  dest: any
  items: OutlineModel[]
}

const $props = defineProps<{ src: string }>()

const left = ref({ outline: true, width: 240 })

const pdf = ref<pdfjsLib.PDFDocumentProxy>()
const params = ref({ dpr: 1, width: 0, height: 0 })
const option = ref({ scale: 100, cur: 0 })

const pages = ref<(pdfjsLib.PDFPageProxy | undefined)[]>([])
const outline = ref<OutlineModel[]>([])

const canvasRef = useTemplateRef('canvas')
const viewsRef = useTemplateRef('views')

onMounted(async () => {
  const loadingTask = pdfjsLib.getDocument(getFullPath($props.src))

  const task = await loadingTask.promise
  pdf.value = task

  setSize()

  pages.value = Array.from({ length: task.numPages })

  outline.value = await task.getOutline()

  nextTick(() => {
    Array.from({ length: 5 }).forEach((_, i) => loadPage(i))
  })
})

const onScroll = debounce((e: Event) => {
  const dom = e.target as HTMLDivElement

  if (!dom) {
    return
  }

  const onePage = params.value.height + 26
  const curPage = Math.floor(dom.scrollTop / onePage) + 1
  const progress = (dom.scrollTop % onePage) / onePage

  option.value.cur = progress > 0.9 ? curPage + 1 : curPage

  // 加载上2页、上1页、当前页、下1页、下2页
  loadPage(option.value.cur - 3)
  loadPage(option.value.cur - 2)
  loadPage(option.value.cur - 1)
  loadPage(option.value.cur)
  loadPage(option.value.cur + 1)
}, 300)

const setSize = async () => {
  if (!pdf.value) {
    return
  }

  const viewport = (await toRaw(pdf.value).getPage(1)).getViewport({
    scale: option.value.scale / 100,
  })
  params.value.dpr = window.devicePixelRatio || 1
  params.value.width = viewport.width
  params.value.height = viewport.height
}

const loadPage = async (index: number, force = false) => {
  const canvas = canvasRef.value?.[index]

  if (!canvas || !pdf.value || (pages.value[index] !== undefined && !force)) {
    return
  }

  const page = await toRaw(pdf.value).getPage(index + 1)
  const viewport = page.getViewport({ scale: option.value.scale / 100 })

  const ctx = canvas.getContext('2d')!
  ctx.setTransform(params.value.dpr, 0, 0, params.value.dpr, 0, 0)

  await page.render({ canvasContext: ctx, viewport, canvas }).promise

  pages.value[index] = page
}

const changeScale = async () => {
  setSize()

  pages.value.forEach((page, index) => {
    if (page !== undefined) {
      loadPage(index, true)
    }
  })
}

const changeCur = async (cur: number) => {
  if (!viewsRef.value || cur < 1 || cur > pages.value.length) {
    return
  }

  viewsRef.value.scrollTop = (cur - 1) * (params.value.height + 26)
}

const outlineClick = async (data: TreeNodeData) => {
  const val = toRaw(data)

  const page = await toRaw(pdf.value)?.getPageIndex(val.dest[0])

  if (page !== undefined) {
    changeCur(page + 1)
  }
}

const changeLeftWidth = (v: number) => {
  const newVal = left.value.width + v

  if (newVal > 500 || newVal < 200) {
    return
  }

  left.value.width = newVal
}
</script>

<style lang="scss" scoped>
.pdf-view {
  height: 100%;
  display: flex;
  flex-direction: column;

  > .head {
    height: 40px;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;

    > .el-icon {
      width: 32px;
      height: 32px;
      color: var(--el-text-color-regular);
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary-light-5);
      }

      &.active {
        color: var(--el-color-primary);
      }
    }
  }

  > .body {
    flex: 1;
    display: flex;

    > .left {
      position: relative;
      border-right: 1px solid var(--el-border-color);

      > .el-tree {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        overflow: auto;
      }

      > .click-move {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 7px;
        transform: translateX(4px);
        cursor: e-resize;

        &:hover {
          background-color: var(--el-text-color-placeholder);
        }
      }
    }

    > .right {
      position: relative;
      flex: 1;

      > .pages {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
        padding-top: 24px;

        > .i {
          padding-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;

          > canvas {
            border: 1px solid var(--el-border-color);
            background-color: var(--el-text-color-regular);
          }
        }
      }
    }
  }
}
</style>
