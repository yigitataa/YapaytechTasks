import { useState } from 'react'

const STORAGE_KEY = 'yatatodo.geminiApiKey'

function readStoredKey() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function useGeminiApiKey() {
  const [apiKey, setApiKeyState] = useState(readStoredKey)

  const saveApiKey = (value: string) => {
    const normalized = value.trim()
    try {
      if (normalized) localStorage.setItem(STORAGE_KEY, normalized)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Uygulama, tarayıcı depolaması kapalıyken de mevcut oturumda çalışır.
    }
    setApiKeyState(normalized)
  }

  return { apiKey, saveApiKey }
}
