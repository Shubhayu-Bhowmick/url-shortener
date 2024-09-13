'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckIcon, CopyIcon } from 'lucide-react'


export default function CopyButton({ text }) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      className="bg-gray-800 hover:bg-slate-600 "
      variant=""
      size="icon"
      onClick={copyToClipboard}
      aria-label="Copy to clipboard"
    >
      {isCopied ? (
        <CheckIcon className="h-4 w-4 text-green-500" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  )
}