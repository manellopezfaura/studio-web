"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, useRef, useCallback } from "react"
import type { HeraChatConfig } from "./types"

const HeraChatPanel = dynamic(() => import("./hera-chat-panel"), {
  ssr: false,
  loading: () => null,
})

export function HeraChatWidget(props: HeraChatConfig) {
  const {
    assistantName = "Hera",
    showNudge: enableNudge = false,
    nudgeText = "Prueba Hera en vivo",
    nudgeDelay = 3000,
    nudgeAutoDismiss = 8000,
  } = props

  const isInline =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("inline")

  const [isOpen, setIsOpen] = useState(isInline)
  const [hasInteracted, setHasInteracted] = useState(isInline)
  const [showNudge, setShowNudge] = useState(false)

  const nudgeRef = useRef<HTMLDivElement>(null)
  const nudgeDismissed = useRef(false)

  const dismissNudge = useCallback(() => {
    if (nudgeDismissed.current) return
    nudgeDismissed.current = true
    if (nudgeRef.current) {
      nudgeRef.current.style.opacity = "0"
      nudgeRef.current.style.transform = "translateY(4px)"
      nudgeRef.current.style.transition =
        "opacity 0.5s ease, transform 0.5s ease"
      setTimeout(() => setShowNudge(false), 500)
    } else {
      setShowNudge(false)
    }
  }, [])

  useEffect(() => {
    if (!enableNudge) return
    const showTimer = setTimeout(() => {
      nudgeDismissed.current = false
      setShowNudge(true)
    }, nudgeDelay)
    return () => clearTimeout(showTimer)
  }, [enableNudge, nudgeDelay])

  useEffect(() => {
    if (!showNudge) return
    const hideTimer = setTimeout(() => dismissNudge(), nudgeAutoDismiss)
    const onUserScroll = () => dismissNudge()
    const attachTimer = setTimeout(() => {
      window.addEventListener("wheel", onUserScroll, {
        passive: true,
        once: true,
      })
      window.addEventListener("touchmove", onUserScroll, {
        passive: true,
        once: true,
      })
    }, 1000)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(attachTimer)
      window.removeEventListener("wheel", onUserScroll)
      window.removeEventListener("touchmove", onUserScroll)
    }
  }, [showNudge, dismissNudge, nudgeAutoDismiss])

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev
      if (typeof window !== "undefined" && window.parent !== window) {
        window.parent.postMessage(
          { type: "hera-chat-toggle", open: next },
          "*",
        )
      }
      return next
    })
    setHasInteracted(true)
    if (showNudge) dismissNudge()
  }, [showNudge, dismissNudge])

  // Preload the heavy panel chunk on first hover/focus so the click feels instant.
  const preloadPanel = useCallback(() => {
    void import("./hera-chat-panel")
  }, [])

  useEffect(() => {
    const onOpen = () => {
      if (!isOpen) handleToggle()
    }
    window.addEventListener("hera:open", onOpen)
    return () => window.removeEventListener("hera:open", onOpen)
  }, [isOpen, handleToggle])

  return (
    <>
      {/* Heavy panel only mounts after first interaction (or inline embed). */}
      {hasInteracted && (
        <HeraChatPanel
          {...props}
          isOpen={isOpen}
          hasInteracted={hasInteracted}
          isInline={isInline}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* Nudge tooltip */}
      {showNudge && !isOpen && (
        <div ref={nudgeRef} className="hera-nudge" onClick={dismissNudge}>
          <span className="hera-nudge__text">
            {nudgeText} <span className="hera-nudge__sparkle">✦</span>
          </span>
          <span className="hera-nudge__arrow" />
        </div>
      )}

      {/* Floating trigger — hidden in inline/embedded mode */}
      {!isInline && (
        <button
          className={`hera-trigger ${isOpen ? "hera-trigger--active" : ""}`}
          onClick={handleToggle}
          onMouseEnter={preloadPanel}
          onFocus={preloadPanel}
          onTouchStart={preloadPanel}
          aria-label={
            isOpen ? "Cerrar chat" : `Abrir chat con ${assistantName}`
          }
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
      )}
    </>
  )
}
