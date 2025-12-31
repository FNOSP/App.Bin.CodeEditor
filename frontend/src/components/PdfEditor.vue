<template>
  <div class="pdf-view" v-if="pages.length">
    <div class="head">
      <!-- <el-icon><Notebook /></el-icon>

      <el-icon><Collection /></el-icon> -->

      <div style="flex: 1"></div>

      <el-input-number
        v-model="params.scale"
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
      <div class="left" v-show="!1"></div>
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
// import { Notebook, Collection } from '@element-plus/icons-vue'
import { debounce } from 'lodash'

import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

import { getFullPath } from '@/utils/file'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const $props = defineProps<{ src: string }>()

const pdf = ref<pdfjsLib.PDFDocumentProxy>()
const params = ref({ timer: 0, scale: 100, dpr: 1, width: 0, height: 0 })
const option = ref({ cur: 0 })

const pages = ref<(pdfjsLib.PDFPageProxy | undefined)[]>([])

const canvasRef = useTemplateRef('canvas')
const viewsRef = useTemplateRef('views')

onMounted(async () => {
  const loadingTask = pdfjsLib.getDocument(getFullPath($props.src))

  const task = await loadingTask.promise
  pdf.value = task

  setSize()

  pages.value = Array.from({ length: task.numPages })

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

  // 加载上一页、当前页、下一页
  loadPage(option.value.cur - 2)
  loadPage(option.value.cur - 1)
  loadPage(option.value.cur)
}, 300)

const setSize = async () => {
  if (!pdf.value) {
    return
  }

  const viewport = (await toRaw(pdf.value).getPage(1)).getViewport({
    scale: params.value.scale / 100,
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
  const viewport = page.getViewport({ scale: params.value.scale / 100 })

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
      width: 200px;
      border-right: 1px solid var(--el-border-color);
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
