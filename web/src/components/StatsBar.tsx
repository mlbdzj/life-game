import type { Item } from '../types'

type StatsBarProps = {
  items: Item[]
}

function formatMoney(value: number) {
  return `¥${value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`
}

export default function StatsBar({ items }: StatsBarProps) {
  // 只统计"仍归自己"的物品(在售/报废不计入资产)
  const owned = items.filter((it) => it.status === '在用' || it.status === '闲置')

  const totalCount = owned.reduce((sum, it) => sum + it.quantity, 0)
  const totalValue = owned.reduce((sum, it) => sum + (it.price ?? 0) * it.quantity, 0)

  const byCategory = new Map<string, number>()
  for (const it of owned) {
    byCategory.set(it.category, (byCategory.get(it.category) ?? 0) + it.quantity)
  }
  const distribution = [...byCategory.entries()].sort((a, b) => b[1] - a[1])
  const maxCount = distribution.length > 0 ? distribution[0][1] : 0

  const cards = [
    { label: '在册物品', value: `${owned.length}`, hint: '条记录' },
    { label: '总数量', value: `${totalCount}`, hint: '件在持有中' },
    { label: '总价值', value: formatMoney(totalValue), hint: '按购买价估算' },
  ]

  return (
    <section className="card">
      <div className="stats__grid">
        {cards.map((card) => (
          <div key={card.label} className="stat">
            <p className="stat__label">{card.label}</p>
            <p className="stat__value">{card.value}</p>
            <p className="stat__hint">{card.hint}</p>
          </div>
        ))}
      </div>

      {distribution.length > 0 && (
        <div className="stats__dist">
          <p className="stats__dist-title">分类分布</p>
          <ul className="dist-list">
            {distribution.map(([name, count]) => (
              <li key={name} className="dist-row">
                <span className="dist-row__name">{name}</span>
                <span className="dist-row__track">
                  <span
                    className="dist-row__bar"
                    style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
                  />
                </span>
                <span className="dist-row__count">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
