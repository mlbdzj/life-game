import { useCallback, useEffect, useRef, useState } from 'react'
import {
  clearFileBinding,
  getStoredHandle,
  pickOpenFile,
  pickSaveFile,
  queryPermission,
  readItems,
  requestPermission,
  storeHandle,
  supportsFileSystem,
  writeItems,
  type JsonFileHandle,
} from '../lib/fileStorage'
import type { Item } from '../types'

export type JsonFileLink = {
  supported: boolean
  name: string | null
  needsPermission: boolean
  message: string
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : '未知错误'
}

/**
 * 把数据同步到用户自己选的本地 JSON 文件。
 * 绑定时自动读/写,之后数据一变就落盘;不支持该 API 的浏览器保持关闭。
 */
export function useJsonFile(items: Item[], onLoad: (items: Item[]) => void) {
  const [link, setLink] = useState<JsonFileLink>(() => ({
    supported: supportsFileSystem,
    name: null,
    needsPermission: false,
    message: '',
  }))

  const handleRef = useRef<JsonFileHandle | null>(null)
  const writableRef = useRef(false)

  const attach = useCallback((handle: JsonFileHandle, canWrite: boolean) => {
    handleRef.current = handle
    writableRef.current = canWrite
    setLink((prev) => ({ ...prev, name: handle.name }))
  }, [])

  const loadFromFile = useCallback(
    async (handle: JsonFileHandle) => {
      const loaded = await readItems(handle)
      attach(handle, true)
      onLoad(loaded)
      setLink((prev) => ({
        ...prev,
        name: handle.name,
        needsPermission: false,
        message: `已从 ${handle.name} 读取 ${loaded.length} 条`,
      }))
    },
    [attach, onLoad],
  )

  // 打开页面时,尝试恢复上次绑定的文件
  useEffect(() => {
    if (!supportsFileSystem) return
    let cancelled = false

    void (async () => {
      const handle = await getStoredHandle()
      if (!handle || cancelled) return

      const state = await queryPermission(handle)
      if (state === 'granted') {
        try {
          await loadFromFile(handle)
          return
        } catch {
          // 读失败就退回本地存储,不打断使用
        }
      }
      if (cancelled) return
      attach(handle, false)
      setLink((prev) => ({
        ...prev,
        needsPermission: true,
        message: '已记住数据文件,点「重新授权」恢复自动保存',
      }))
    })()

    return () => {
      cancelled = true
    }
  }, [attach, loadFromFile])

  // 有写权限时,数据变化就写回文件
  useEffect(() => {
    const handle = handleRef.current
    if (!handle || !writableRef.current) return
    writeItems(handle, items).catch((error) => {
      writableRef.current = false
      setLink((prev) => ({ ...prev, message: `写入失败:${errorText(error)}` }))
    })
  }, [items])

  const bindNew = useCallback(async () => {
    const handle = await pickSaveFile()
    if (!handle) return
    if (!(await requestPermission(handle))) {
      setLink((prev) => ({ ...prev, name: handle.name, needsPermission: true, message: '未获得写入权限' }))
      return
    }
    await storeHandle(handle)
    attach(handle, true)
    await writeItems(handle, items)
    setLink((prev) => ({ ...prev, needsPermission: false, message: `已绑定 ${handle.name},修改会自动保存` }))
  }, [attach, items])

  const openExisting = useCallback(async () => {
    const handle = await pickOpenFile()
    if (!handle) return
    if (!(await requestPermission(handle))) {
      setLink((prev) => ({ ...prev, name: handle.name, needsPermission: true, message: '未获得访问权限' }))
      return
    }
    await storeHandle(handle)
    try {
      await loadFromFile(handle)
    } catch (error) {
      setLink((prev) => ({ ...prev, name: handle.name, message: `读取失败:${errorText(error)}` }))
    }
  }, [loadFromFile])

  const regrant = useCallback(async () => {
    const handle = handleRef.current
    if (!handle) return
    if (!(await requestPermission(handle))) {
      setLink((prev) => ({ ...prev, needsPermission: true, message: '仍未获得权限' }))
      return
    }
    try {
      await loadFromFile(handle)
    } catch (error) {
      setLink((prev) => ({ ...prev, message: `读取失败:${errorText(error)}` }))
    }
  }, [loadFromFile])

  const unbind = useCallback(async () => {
    handleRef.current = null
    writableRef.current = false
    await clearFileBinding()
    setLink((prev) => ({ ...prev, name: null, needsPermission: false, message: '已解除文件绑定' }))
  }, [])

  return { link, bindNew, openExisting, regrant, unbind }
}
