interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5">
      <h1 className="m-0 text-base font-semibold text-grat-900">{title}</h1>
      <button
        type="button"
        className="rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-gray-900 transition-colors hover:bg-gray-100"  
      >
        登录
      </button>
    </header>
  )
}