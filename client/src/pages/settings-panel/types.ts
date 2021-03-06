export enum ConfigType {
  INPUT = 'INPUT',
  SELECT = 'SELECT',
  CHECKBOX = 'CHECKBOX',
}

export enum InputType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
}

export type InputConfig = {
  type: ConfigType.INPUT
  title: string
  description: string
  inputType: InputType
  key: string
}

export type SelectOption = {
  key: string // shown in UI
  value: string | number // actual value used
}

export type SelectGroup = {
  groupName: string
  options: SelectOption[]
}

export type SelectConfig = {
  type: ConfigType.SELECT
  title: string
  description: string
  options: (SelectOption | SelectGroup)[]
  key: string
}

export type CheckboxConfig = {
  type: ConfigType.CHECKBOX
  title: string
  description: string
  key: string
}

// collection of logically related settings items
export type SubGroup = {
  title: string
  description: string
  configs: (InputConfig | SelectConfig | CheckboxConfig)[]
}

// collection of smaller groups of settings
export type Group = {
  title: string
  subGroupDict: {
    [key: string]: SubGroup
  }
}
