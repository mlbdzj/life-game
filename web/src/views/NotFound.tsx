import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="m-0 text-5xl font-bold text-gray-300">404</p>
      <h1 className="mt-4 mb-2 text-xl font-semibold text-gray-900">
        页面不存在
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        你访问的页面可能已被移除或地址有误。
      </p>
      <Link
        to="/"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        返回首页
      </Link>
    </div>
  );
}
