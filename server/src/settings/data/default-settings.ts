import { KeyBinding } from '../settings.types'

export const DefaultTextEditorSettings = Object.freeze({
  // basic editor settings
  lineNumbers: true,
  wordWrap: false,
  tabSize: 2,
  // font settings
  fontFamily: 'JetBrains Mono',
  fontWeight: 300,
  fontSize: 12,
  lineHeight: 20,
  // keybinding settings
  keyBinding: KeyBinding.NONE,
  // theme settings
  theme: 'github',
})
