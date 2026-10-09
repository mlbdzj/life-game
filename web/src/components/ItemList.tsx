import type { Item } from '../types'

type ItemListProps = {
  items: Item[]
  onEdit: (id: string) => void
  onRemove: (id: string) => void
}

const statusClass: Record<Item['status'], string> = {
  在用: 'chip chip--in-use',
  闲置: 'chip chip--idle',
  已出售: 'chip chip--sold',
  已报废: 'chip chip--scrap',
}

function cell(value: string) {
  return value === '' ? <span className="muted-dash">—</span> : value
}

export default function ItemList({ items, onEdit, onRemove }: ItemListProps) {
  if (items.length === 0) {
    return <div className="empty">还没有物品。用上面的表单添加第一件吧。</div>
  }

  return (
    <div className="item-list">
      <table className="item-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>分类</th>
            <th>状态</th>
            <th className="col-num">数量</th>
            <th className="col-num">单价</th>
            <th>位置</th>
            <th>标签</th>
            <th className="col-num">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <p className="item-name">{item.name}</p>
                {item.notes && <p className="item-notes">{item.notes}</p>}
              </td>
              <td>{cell(item.category)}</td>
              <td>
                <span className={statusClass[item.status]}>{item.status}</span>
              </td>
              <td className="col-num">{item.quantity}</td>
              <td className="col-num">
                {item.price != null ? `¥${item.price.toLocaleString('zh-CN')}` : cell('')}
              </td>
              <td>{cell(item.location)}</td>
              <td>
                {item.tags.length > 0 ? (
                  <div className="tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  cell('')
                )}
              </td>
              <td className="col-num">
                <div className="row-actions">
                  <button type="button" onClick={() => onEdit(item.id)} className="link-btn">
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="link-btn link-btn--danger"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
