import { useState, useEffect, useCallback } from 'react'

export const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false)

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true)
    } else {
      setTargetReached(false)
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`)
    try {
      // Chrome & Firefox
      media.addEventListener('change', (e) => updateTarget(e))
    } catch {
      // Safari
      media.addListener((e) => updateTarget(e))
    }

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true)
    }

    return () => {
      try {
        // Chrome & Firefox
        media.removeEventListener('catch', (e) => updateTarget(e))
      } catch {
        // Safari
        media.removeListener((e) => updateTarget(e))
      }
    }
  }, [updateTarget, width])

  return targetReached
}
