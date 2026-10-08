import ProfileCard from './components/ProfileCard'
import UpdateLog from './components/UpdateLog'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 左上：个人资料 */}
        <div className="lg:col-span-1">
          <ProfileCard
            name="张三"
            title="前端工程师 · React / TypeScript"
            location="深圳"
            email="zhangsan@example.com"
            avatarUrl="https://i.pravatar.cc/150?img=12"
            bio="专注前端工程化与交互体验，喜欢把复杂的东西做简单。"
            tags={['React', 'TypeScript', 'Tailwind', 'Vite']}
          />
        </div>

        {/* 右上：更新日志 */}
        <div className="lg:col-span-2">
          <UpdateLog
            items={[
              {
                date: '2026-10-08',
                version: 'v1.2.0',
                title: '新增个人详情卡片',
                description: '支持头像、标签、暗色模式。',
              },
              {
                date: '2026-10-05',
                version: 'v1.1.0',
                title: '接入 Tailwind v4',
                description: '移除旧的 PostCSS 配置，改用 Vite 插件。',
              },
              {
                date: '2026-10-01',
                version: 'v1.0.0',
                title: '项目初始化',
                description: 'Vite + React + TypeScript 搭建完成。',
              },
            ]}
          />
        </div>

        {/* 中间区域：下方通栏 */}
        <main className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              中间区域
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              这里可以放你的主内容，比如文章列表、项目展示、仪表盘等。
            </p>

            {/* 示例：占位内容 */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-600 dark:text-slate-500"
                >
                  内容块 {i}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}