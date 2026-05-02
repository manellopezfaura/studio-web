"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { HeraChatConfig, HeraTheme } from "./types"

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

interface HeraChatPanelProps extends HeraChatConfig {
  isOpen: boolean
  hasInteracted: boolean
  isInline: boolean
  onClose: () => void
}

export default function HeraChatPanel({
  apiUrl,
  assistantName = "Hera",
  avatar = "✦",
  subtitle = "Online",
  theme: initialTheme = "dark",
  showThemeToggle = false,
  locale = "es",
  emptyMessage,
  placeholder = "Escribe tu mensaje...",
  errorText = "No he podido responder. ¿Lo intentamos de nuevo?",
  retryText = "Reintentar",
  extraBody,
  isOpen,
  hasInteracted,
  isInline,
  onClose,
}: HeraChatPanelProps) {
  const [theme, setTheme] = useState<HeraTheme>(initialTheme)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sessionId = useMemo(() => generateSessionId(), [])

  const defaultEmpty = `Soy ${assistantName}, pregúntame lo que necesites.`

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: apiUrl,
        body: {
          sessionId,
          sourceUrl: typeof window !== "undefined" ? window.location.href : "",
          sourceLang:
            typeof document !== "undefined"
              ? document.documentElement.lang || locale
              : locale,
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "",
          ...extraBody,
        },
      }),
    [sessionId, apiUrl, locale, extraBody],
  )

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport,
  })

  const isLoading = status === "streaming" || status === "submitted"

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
    if (isOpen) {
      const isMobile = window.matchMedia("(max-width: 640px)").matches
      if (!isMobile && inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [messages, scrollToBottom, isOpen])

  useEffect(() => {
    if (isOpen) {
      const isMobile = window.matchMedia("(max-width: 640px)").matches
      if (!isMobile && inputRef.current) {
        inputRef.current.focus()
      }
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

  const themeClass = theme === "light" ? "hera-light" : ""

  return (
    <div
      className={`hera-panel ${isOpen ? "hera-panel--open" : ""} ${hasInteracted && !isOpen ? "hera-panel--closed" : ""} ${themeClass}`}
      role="dialog"
      aria-label={`Chat con ${assistantName}`}
      aria-hidden={!isOpen}
    >
      {/* Header */}
      <div className="hera-header">
        <div className="hera-header__info">
          <div className="hera-header__avatar">{avatar}</div>
          <div>
            <div className="hera-header__name">{assistantName}</div>
            <div className="hera-header__status">{subtitle}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {showThemeToggle && (
            <button
              className="hera-header__close"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={
                theme === "dark"
                  ? "Cambiar a modo claro"
                  : "Cambiar a modo oscuro"
              }
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          )}
          {!isInline && (
            <button
              className="hera-header__close"
              onClick={onClose}
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
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="hera-messages">
        {messages.length === 0 && (
          <div className="hera-empty">
            <div className="hera-empty__icon">{avatar}</div>
            <p className="hera-empty__text">{emptyMessage ?? defaultEmpty}</p>
          </div>
        )}
        {messages.map((message) => {
          const isUser = message.role === "user"
          const textContent =
            message.parts
              ?.filter(
                (p): p is { type: "text"; text: string } => p.type === "text",
              )
              .map((p) => p.text)
              .join("") ?? ""

          const displayText = textContent
            .replace(/<LEAD_DATA>[\s\S]*?<\/LEAD_DATA>/g, "")
            .trim()

          if (!displayText) return null

          return (
            <div
              key={message.id}
              className={`hera-msg ${isUser ? "hera-msg--user" : "hera-msg--assistant"}`}
            >
              {!isUser && <div className="hera-msg__avatar">{avatar}</div>}
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
            <div
              className="hera-msg__avatar"
              style={{ animation: "hera-spin-slow 2s linear infinite" }}
            >
              {avatar}
            </div>
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
            <div className="hera-msg__avatar">{avatar}</div>
            <div className="hera-error">
              <p className="hera-error__text">{errorText}</p>
              <button
                className="hera-error__retry"
                type="button"
                onClick={() => regenerate()}
                aria-label={retryText}
              >
                {retryText}
              </button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="hera-input" role="form">
        <textarea
          ref={inputRef}
          className="hera-input__field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          aria-label={placeholder}
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
  )
}
