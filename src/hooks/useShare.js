import { useState, useCallback } from 'react'
import { useT } from './useT'

/**
 * Share the current page with desktop feedback.
 *
 * Uses the native share sheet when available; otherwise copies the URL to the
 * clipboard and flips `copied` so the button can confirm it. The previous inline
 * handlers copied silently on desktop (and no-op'd with no feedback when the
 * clipboard API was missing), so the button looked broken.
 *
 * @param {string} shareTitle Title passed to the native share sheet.
 * @returns {{ share: () => void, copied: boolean, copiedLabel: string }}
 */
export function useShare(shareTitle) {
  const t = useT('articleLayout')
  const [copied, setCopied] = useState(false)

  const share = useCallback(async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url })
      } catch {
        // User dismissed the share sheet — not an error.
      }
      return
    }
    try {
      await navigator.clipboard?.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (insecure context / unsupported) — fail quietly.
    }
  }, [shareTitle])

  return { share, copied, copiedLabel: t.shareCopied }
}
