type UpdateItem = {
  date: string
  version?: string
  title: string
  description?: string
}

type UpdateLogProps = {
  title?: string
  items: UpdateItem[]
}

export default function UpdateLog({ title = '更新日志', items }: UpdateLogProps) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>

      <ol className="mt-4 space-y-4">
        {items.map((item, index) => (
          <li key={index} className="relative flex gap-4">
            {/* 时间轴圆点 + 竖线 */}
            <div className="flex flex-col items-center">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
              {index !== items.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-600" />
              )}
            </div>

            {/* 内容 */}
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                {item.version && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    {item.version}
                  </span>
                )}
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {item.date}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                {item.title}
              </p>
              {item.description && (
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}