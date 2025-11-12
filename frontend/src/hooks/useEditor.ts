import { ref, toRaw } from 'vue'
import * as monaco from 'monaco-editor'

export default function useEditor(option: { onSave: () => void }) {
  const editorInstance = ref<any>(null)

  const editorDidMount = async (editor: any) => {
    editorInstance.value = editor

    editor.addAction({
      id: 'save-action',
      label: 'Save',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: () => {
        option.onSave()
        return null
      },
    })
  }

  const changeLang = (v: string) => {
    monaco.editor.setModelLanguage(toRaw(editorInstance.value.getModel()), v)
  }

  const changeSize = (size: number) => {
    editorInstance.value.updateOptions({ fontSize: size })
  }

  const changeTheme = (v: string) => {
    monaco.editor.setTheme(v)
  }

  return {
    editorDidMount,
    changeLang,
    changeSize,
    changeTheme,
  }
}
