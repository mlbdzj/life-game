import { parseBackup, toBackup } from './items'
import type { Item } from '../types'

/** 浏览器 File System Access API 的最小结构定义(避免依赖实验性 lib 类型) */
export type JsonFileHandle = {
  readonly name: string
  getFile(): Promise<File>
  createWritable(): Promise<{
    write(data: string): Promise<void>
    close(): Promise<void>
  }>
}

type PermissionCapable = {
  queryPermission?(descriptor: { mode: 'read' | 'readwrite' }): Promise<PermissionState>
  requestPermission?(descriptor: { mode: 'read' | 'readwrite' }): Promise<PermissionState>
}

type PickerWindow = Window & {
  showSaveFilePicker?: (options?: unknown) => Promise<JsonFileHandle>
  showOpenFilePicker?: (options?: unknown) => Promise<JsonFileHandle[]>
}

const pickerWindow = () => window as PickerWindow

export const supportsFileSystem =
  typeof window !== 'undefined' && typeof pickerWindow().showSaveFilePicker === 'function'

const PICKER_TYPES = [{ description: 'JSON 文件', accept: { 'application/json': ['.json'] } }]

/* ---------- 把文件句柄记在 IndexedDB,下次打开还能认出来 ---------- */

const DB_NAME = 'life-game'
const DB_VERSION = 1
const STORE = 'handles'
const HANDLE_KEY = 'items-file'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('无法打开 IndexedDB'))
  })
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const request = run(tx.objectStore(STORE))
    request.onsuccess = () => resolve(request.result as T)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB 操作失败'))
    tx.oncomplete = () => db.close()
  })
}

export async function getStoredHandle(): Promise<JsonFileHandle | null> {
  try {
    const handle = await withStore<JsonFileHandle | undefined>('readonly', (store) =>
      store.get(HANDLE_KEY),
    )
    return handle ?? null
  } catch {
    return null
  }
}

export async function storeHandle(handle: JsonFileHandle): Promise<void> {
  await withStore('readwrite', (store) => store.put(handle, HANDLE_KEY))
}

export async function clearFileBinding(): Promise<void> {
  try {
    await withStore('readwrite', (store) => store.delete(HANDLE_KEY))
  } catch {
    // 清理失败不影响使用
  }
}

/* ---------- 权限 ---------- */

export async function queryPermission(handle: JsonFileHandle): Promise<PermissionState> {
  const capable = handle as PermissionCapable
  if (!capable.queryPermission) return 'granted'
  try {
    return await capable.queryPermission({ mode: 'readwrite' })
  } catch {
    return 'prompt'
  }
}

/** 需要用户手势才能弹权限框;已经是 granted 就不再打扰 */
export async function requestPermission(handle: JsonFileHandle): Promise<boolean> {
  const capable = handle as PermissionCapable
  if (!capable.requestPermission) return true
  try {
    if (capable.queryPermission && (await capable.queryPermission({ mode: 'readwrite' })) === 'granted') {
      return true
    }
    return (await capable.requestPermission({ mode: 'readwrite' })) === 'granted'
  } catch {
    return false
  }
}

/* ---------- 选择文件 ---------- */

function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export async function pickSaveFile(): Promise<JsonFileHandle | null> {
  const pick = pickerWindow().showSaveFilePicker
  if (!pick) return null
  try {
    return await pick({ suggestedName: 'life-game-items.json', types: PICKER_TYPES })
  } catch (error) {
    if (isAbort(error)) return null
    throw error
  }
}

export async function pickOpenFile(): Promise<JsonFileHandle | null> {
  const pick = pickerWindow().showOpenFilePicker
  if (!pick) return null
  try {
    const [handle] = await pick({ multiple: false, types: PICKER_TYPES })
    return handle ?? null
  } catch (error) {
    if (isAbort(error)) return null
    throw error
  }
}

/* ---------- 读写 ---------- */

export async function readItems(handle: JsonFileHandle): Promise<Item[]> {
  const file = await handle.getFile()
  return parseBackup(await file.text())
}

export async function writeItems(handle: JsonFileHandle, items: Item[]): Promise<void> {
  const stream = await handle.createWritable()
  await stream.write(JSON.stringify(toBackup(items), null, 2))
  await stream.close()
}
