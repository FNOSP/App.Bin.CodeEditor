<template>
  <div class="pdf-view">
    <div class="bar">
      <div>11</div>
      <div>22</div>
      <div>33</div>
    </div>

    <div class="pages">
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
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, toRaw, useTemplateRef } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

import { getFullPath } from '@/utils/file'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const $props = defineProps<{ src: string }>()

const pdf = ref<pdfjsLib.PDFDocumentProxy>()
const params = ref({ title: '', scale: 1, dpr: 1, width: 0, height: 0 })
// const option = ref({ cur: 0 })

const pages = ref<(pdfjsLib.PDFPageProxy | undefined)[]>([])
const canvas = useTemplateRef('canvas')

console.log(params.value)

onMounted(async () => {
  params.value.title = $props.src.split('/').pop() || ''

  const loadingTask = pdfjsLib.getDocument(getFullPath($props.src))

  const task = await loadingTask.promise

  const viewport = (await task.getPage(1)).getViewport({ scale: params.value.scale })
  params.value.dpr = window.devicePixelRatio || 1
  params.value.width = viewport.width
  params.value.height = viewport.height

  pages.value = Array.from({ length: task.numPages })

  pdf.value = task

  await loadPage(0)
  await loadPage(1)
  await loadPage(2)
})

const loadPage = async (index: number) => {
  if (!pdf.value) {
    return
  }

  pages.value[index] = await toRaw(pdf.value).getPage(index + 1)

  await new Promise((r) => nextTick(() => r({})))

  await renderPage(index)
}

const renderPage = async (index: number) => {
  const page = toRaw(pages.value[index])
  const dom = canvas.value?.[index]

  if (!(page && dom)) {
    return
  }

  const viewport = page.getViewport({ scale: params.value.scale })

  const ctx = dom.getContext('2d')!
  ctx.setTransform(params.value.dpr, 0, 0, params.value.dpr, 0, 0)

  await page.render({ canvasContext: ctx, viewport, canvas: dom }).promise
}
</script>

<style lang="scss" scoped>
.pdf-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  > .bar {
    height: 40px;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    align-items: center;
  }

  > .pages {
    flex: 1;
    overflow: auto;

    > .i {
      padding-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      > canvas {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
