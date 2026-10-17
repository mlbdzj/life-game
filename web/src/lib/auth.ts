import type { User } from "../types/auth";

const STORAGE_KEY = "life-game:user";

function parseUser(raw: string | null): User | null {
  if (!raw) return null;

  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === "object" &&
      value !== null &&
      "username" in value &&
      "displayName" in value &&
      typeof value.username === "string" &&
      typeof value.displayName === "string"
    ) {
      return { username: value.username, displayName: value.displayName };
    }
  } catch {
    // 忽略损坏的本地数据
  }

  return null;
}

export function loadUser(): User | null {
  try {
    return (
      parseUser(localStorage.getItem(STORAGE_KEY)) ??
      parseUser(sessionStorage.getItem(STORAGE_KEY))
    );
  } catch {
    return null;
  }
}

export function saveUser(user: User, remember: boolean): void {
  try {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    storage.setItem(STORAGE_KEY, JSON.stringify(user));
    otherStorage.removeItem(STORAGE_KEY);
  } catch {
    // 无痕模式等场景下写入失败，不阻断登录流程
  }
}

export function clearUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 忽略
  }
}
