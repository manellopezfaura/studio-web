"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

const transport = new DefaultChatTransport({
  api: "/api/chat",
})

export function HeraChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({ transport })

  const isLoading = status === "streaming" || status === "submitted"

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
    if (!hasInteracted) setHasInteracted(true)
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
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
        aria-label="Chat con Hera, asistente de 107 Studio"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="hera-header">
          <div className="hera-header__info">
            <div className="hera-header__avatar">H</div>
            <div>
              <div className="hera-header__name">Hera</div>
              <div className="hera-header__status">107 Studio</div>
            </div>
          </div>
          <button
            className="hera-header__close"
            onClick={handleToggle}
            aria-label="Cerrar chat"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="hera-messages">
          {messages.length === 0 && (
            <div className="hera-empty">
              <div className="hera-empty__icon">H</div>
              <p className="hera-empty__text">
                Soy Hera, asistente de 107 Studio.
                <br />
                Pregúntame lo que necesites.
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
                {!isUser && <div className="hera-msg__avatar">H</div>}
                <div
                  className={`hera-msg__bubble ${isUser ? "hera-msg__bubble--user" : "hera-msg__bubble--assistant"}`}
                >
                  {displayText}
                </div>
              </div>
            )
          })}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="hera-msg hera-msg--assistant">
              <div className="hera-msg__avatar">H</div>
              <div className="hera-msg__bubble hera-msg__bubble--assistant">
                <span className="hera-typing">
                  <span className="hera-typing__dot" />
                  <span className="hera-typing__dot" />
                  <span className="hera-typing__dot" />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          className="hera-input"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <textarea
            ref={inputRef}
            className="hera-input__field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            rows={1}
            disabled={isLoading}
            aria-label="Escribe tu mensaje"
          />
          <button
            className="hera-input__send"
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Enviar mensaje"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M14 2L7 9M14 2l-4.5 12-2-5.5L2 6.5 14 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Floating trigger */}
      <button
        className={`hera-trigger ${isOpen ? "hera-trigger--active" : ""}`}
        onClick={handleToggle}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat con Hera"}
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
      </button>
    </>
  )
}
