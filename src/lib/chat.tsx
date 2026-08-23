import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

interface ChatContextValue {
  open: boolean
  unread: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  clearUnread: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(true)

  const openChat = useCallback(() => {
    setOpen(true)
    setUnread(false)
  }, [])
  const closeChat = useCallback(() => setOpen(false), [])
  const toggleChat = useCallback(() => {
    setOpen((prev) => {
      const next = !prev
      if (next) setUnread(false)
      return next
    })
  }, [])
  const clearUnread = useCallback(() => setUnread(false), [])

  const value = useMemo(
    () => ({ open, unread, openChat, closeChat, toggleChat, clearUnread }),
    [open, unread, openChat, closeChat, toggleChat, clearUnread],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>")
  return ctx
}
