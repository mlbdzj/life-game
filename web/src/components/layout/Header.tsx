interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

export function Header({ title, onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="切换侧栏"
          className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
        >
          ☰
        </button>
        <h1 className="m-0 text-base font-semibold text-gray-900">{title}</h1>
      </div>

      <button
        type="button"
        className="rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-gray-900 transition-colors hover:bg-gray-100"
      >
        登录
      </button>
    </header>
  );
}