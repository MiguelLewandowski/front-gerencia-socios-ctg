/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { X } from 'lucide-react'

const ToastCtx = createContext(null)
let nextId = 0

function reducer(state, action) {
  if (action.type === 'ADD') return [...state, action.item]
  if (action.type === 'DEL') return state.filter(t => t.id !== action.id)
  return state
}

const COLOR = {
  success: 'bg-green-600',
  error: 'bg-red-500',
  info: 'bg-blue-600',
}

function ToastList({ toasts, dispatch }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 w-full max-w-xs pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold pointer-events-auto ${COLOR[t.type]}`}>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => dispatch({ type: 'DEL', id: t.id })}
            className="shrink-0 mt-0.5 opacity-80 hover:opacity-100 cursor-pointer bg-transparent border-none text-white p-0"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(reducer, [])

  const add = useCallback((message, type) => {
    const item = { id: ++nextId, message, type }
    dispatch({ type: 'ADD', item })
    setTimeout(() => dispatch({ type: 'DEL', id: item.id }), 4000)
  }, [])

  const toast = useMemo(() => ({
    success: msg => add(msg, 'success'),
    error:   msg => add(msg, 'error'),
    info:    msg => add(msg, 'info'),
  }), [add])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <ToastList toasts={toasts} dispatch={dispatch} />
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
