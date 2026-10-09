import { useRef, useState, type ChangeEvent } from 'react'
import { useJsonFile } from '../hooks/useJsonFile'
import { downloadBackup, mergeById, parseBackup } from '../lib/items'
import type { Item } from '../types'

type DataActionsProps = {
  items: Item[]
  onReplace: (items: Item[]) => void
}

export default function DataActions({ items, onReplace }: DataActionsProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const { link, bindNew, openExisting, regrant, unbind } = useJsonFile(items, onReplace)

  const run = async (action: () => Promise<void>) => {
    try {
      await action()
    } catch (err) {
      setMessage(`操作失败:${err instanceof Error ? err.message : '未知错误'}`)
    }
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // 清空 value,这样同一个文件可以再导一次
    event.target.value = ''
    if (!file) return

    try {
      const imported = parseBackup(await file.text())
      if (imported.length === 0) {
        setMessage('文件里没有可导入的物品')
        return
      }
      const merged = mergeById(items, imported)
      onReplace(merged)
      const added = merged.length - items.length
      setMessage(
        added > 0
          ? `已导入 ${imported.length} 条,其中新增 ${added} 条`
          : `已导入 ${imported.length} 条,更新了已有记录`,
      )
    } catch (err) {
      setMessage(`导入失败:${err instanceof Error ? err.message : '文件格式不正确'}`)
    }
  }

  const hint = message || link.message || '数据存在本机浏览器,记得导出备份'

  return (
    <div className="data-actions">
      <div className="data-actions__row">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => downloadBackup(items)}
        >
          导出 JSON
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => fileRef.current?.click()}
        >
          导入 JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          onChange={handleImport}
        />
      </div>

      {link.supported && (
        <div className="data-actions__row">
          {link.name === null ? (
            <>
              <button type="button" className="btn btn--ghost" onClick={() => run(bindNew)}>
                新建数据文件
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => run(openExisting)}>
                打开数据文件
              </button>
            </>
          ) : (
            <>
              <span className="data-actions__file">已绑定 {link.name}</span>
              {link.needsPermission && (
                <button type="button" className="btn btn--ghost" onClick={() => run(regrant)}>
                  重新授权
                </button>
              )}
              <button type="button" className="btn btn--ghost" onClick={() => run(unbind)}>
                解除绑定
              </button>
            </>
          )}
        </div>
      )}

      <p className="data-actions__msg">{hint}</p>
    </div>
  )
}
