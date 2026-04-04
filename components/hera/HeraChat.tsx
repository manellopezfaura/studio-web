"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

interface HeraChatProps {
  assistantName?: string
  avatarLetter?: string
  studioName?: string
  apiUrl?: string
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function HeraChat({
  assistantName = "Hera",
  avatarLetter = "H",
  studioName = "107 Studio",
  apiUrl = "/api/chat",
}: HeraChatProps) {
  const isInline = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("inline")
  const [isOpen, setIsOpen] = useState(isInline)
  const [hasInteracted, setHasInteracted] = useState(isInline)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sessionId = useMemo(() => generateSessionId(), [])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: apiUrl,
        body: {
          sessionId,
          sourceUrl: typeof window !== "undefined" ? window.location.href : "",
          sourceLang: typeof document !== "undefined" ? document.documentElement.lang || "es" : "es",
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        },
      }),
    [sessionId, apiUrl],
  )

  const { messages, sendMessage, status, error, regenerate } = useChat({ transport })

  const isLoading = status === "streaming" || status === "submitted"

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
    // Re-focus textarea after every message update (desktop only)
    if (isOpen) {
      const isMobile = window.matchMedia("(max-width: 640px)").matches
      if (!isMobile && inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [messages, scrollToBottom, isOpen])

  useEffect(() => {
    if (isOpen) {
      // Only auto-focus on desktop — on mobile, programmatic focus
      // triggers iOS Safari zoom + keyboard, disrupting the UX
      const isMobile = window.matchMedia("(max-width: 640px)").matches
      if (!isMobile && inputRef.current) {
        inputRef.current.focus()
      }
      // Lock body scroll on mobile when chat is fullscreen
      if (isMobile) {
        document.body.classList.add("hera-body-lock")
      }
    } else {
      document.body.classList.remove("hera-body-lock")
    }

    return () => {
      document.body.classList.remove("hera-body-lock")
    }
  }, [isOpen])

  const handleToggle = () => {
    const next = !isOpen
    setIsOpen(next)
    if (!hasInteracted) setHasInteracted(true)
    // Notify parent frame (for Framer iframe resize)
    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage({ type: "hera-chat-toggle", open: next }, "*")
    }
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage({ text: trimmed })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat panel */}
      <div
        className={`hera-panel ${isOpen ? "hera-panel--open" : ""} ${hasInteracted && !isOpen ? "hera-panel--closed" : ""}`}
        role="dialog"
        aria-label={`Chat con ${assistantName}, asistente de ${studioName}`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="hera-header">
          <div className="hera-header__info">
            <div className="hera-header__avatar">{avatarLetter}</div>
            <div>
              <div className="hera-header__name">{assistantName}</div>
              <div className="hera-header__status">{studioName}</div>
            </div>
          </div>
          {!isInline && <button
            className="hera-header__close"
            onClick={handleToggle}
            aria-label="Cerrar chat"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>}
        </div>

        {/* Messages */}
        <div className="hera-messages">
          {messages.length === 0 && (
            <div className="hera-empty">
              <div className="hera-empty__icon">{avatarLetter}</div>
              <p className="hera-empty__text">
                Soy {assistantName}, pregúntame lo que necesites.
              </p>
            </div>
          )}
          {messages.map((message) => {
            const isUser = message.role === "user"
            const textContent = message.parts
              ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("") ?? ""

            // Ocultar el bloque LEAD_DATA del usuario
            const displayText = textContent
              .replace(/<LEAD_DATA>[\s\S]*?<\/LEAD_DATA>/g, "")
              .trim()

            if (!displayText) return null

            return (
              <div
                key={message.id}
                className={`hera-msg ${isUser ? "hera-msg--user" : "hera-msg--assistant"}`}
              >
                {!isUser && <div className="hera-msg__avatar">{avatarLetter}</div>}
                <div
                  className={`hera-msg__bubble ${isUser ? "hera-msg__bubble--user" : "hera-msg__bubble--assistant"}`}
                >
                  {displayText}
                </div>
              </div>
            )
          })}
          {isLoading && (
            <div className="hera-msg hera-msg--assistant">
              <div className="hera-msg__avatar">{avatarLetter}</div>
              <div className="hera-msg__bubble hera-msg__bubble--assistant">
                <span className="hera-typing">
                  <span className="hera-typing__dot" />
                  <span className="hera-typing__dot" />
                  <span className="hera-typing__dot" />
                </span>
              </div>
            </div>
          )}
          {error && !isLoading && (
            <div className="hera-msg hera-msg--assistant">
              <div className="hera-msg__avatar">{avatarLetter}</div>
              <div className="hera-error">
                <p className="hera-error__text">No he podido responder. ¿Lo intentamos de nuevo?</p>
                <button
                  className="hera-error__retry"
                  type="button"
                  onClick={() => regenerate()}
                  aria-label="Reintentar"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input — intentionally NOT a <form> to avoid global form textarea styles */}
        <div className="hera-input" role="form">
          <textarea
            ref={inputRef}
            className="hera-input__field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            rows={1}
            aria-label="Escribe tu mensaje"
          />
          <button
            className="hera-input__send"
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Enviar mensaje"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path
                d="M14 2L7 9M14 2l-4.5 12-2-5.5L2 6.5 14 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating trigger — hidden in inline/embedded mode */}
      {!isInline && <button
        className={`hera-trigger ${isOpen ? "hera-trigger--active" : ""}`}
        onClick={handleToggle}
        aria-label={isOpen ? "Cerrar chat" : `Abrir chat con ${assistantName}`}
        aria-expanded={isOpen}
      >
        <span className="hera-trigger__icon hera-trigger__icon--chat">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="hera-trigger__icon hera-trigger__icon--close">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>}
    </>
  )
}
