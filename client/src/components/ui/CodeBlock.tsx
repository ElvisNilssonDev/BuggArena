import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="code-block">
      <div className="code-block-header">
        <div className="code-block-dots">
          <span className="code-block-dot" />
          <span className="code-block-dot" />
          <span className="code-block-dot" />
        </div>
        {language && <span>{language}</span>}
        <button className="code-block-copy" onClick={handleCopy} type="button">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
