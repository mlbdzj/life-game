// Life Game 的核心数据模型。第一个状态维度:物品。
// 说明:本地优先(v1 只存浏览器 localStorage),字段后续可平滑扩展。

export type ItemStatus = '在用' | '闲置' | '已出售' | '已报废'

export type Item = {
  id: string
  name: string
  category: string
  status: ItemStatus
  quantity: number
  /** 购买单价,未知为 null */
  price: number | null
  /** YYYY-MM-DD,未填为空串 */
  purchaseDate: string
  location: string
  tags: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

/** 表单提交 / 新建时使用的数据(不含系统生成的字段) */
export type ItemDraft = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>

export const STATUS_OPTIONS: ItemStatus[] = ['在用', '闲置', '已出售', '已报废']

export const CATEGORY_OPTIONS = ['数码', '衣物', '书籍', '家居', '运动', '其他']
