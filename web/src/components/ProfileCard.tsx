type ProfileCardProps = {
  name: string
  title: string
  location?: string
  email?: string
  avatarUrl?: string
  bio?: string
  tags?: string[]
}

export default function ProfileCard({
  name,
  title,
  location,
  email,
  avatarUrl,
  bio,
  tags = [],
}: ProfileCardProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      {/* 头部：头像 + 姓名 + 职位 */}
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {name.charAt(0)}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
            {name}
          </h2>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>
        </div>
      </div>

      {/* 简介 */}
      {bio && (
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {bio}
        </p>
      )}

      {/* 标签 */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 详情行 */}
      <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-700">
        {location && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="w-16 shrink-0 text-slate-400 dark:text-slate-500">
              位置
            </span>
            <span>{location}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="w-16 shrink-0 text-slate-400 dark:text-slate-500">
              邮箱
            </span>
            <a
              href={`mailto:${email}`}
              className="truncate text-blue-600 hover:underline dark:text-blue-400"
            >
              {email}
            </a>
          </div>
        )}
      </dl>

      
    </div>
  )
}