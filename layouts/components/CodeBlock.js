"use client";

import { useState } from "react";

const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = typeof children === "string"
      ? children
      : children?.props?.children || "";

    const cleaned = String(text)
      .split("\n")
      .map((line) => line.replace(/^\$\s/, ""))
      .join("\n")
      .trim();

    try {
      await navigator.clipboard.writeText(cleaned);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = cleaned;
      textarea.style.cssText = "position:fixed;left:-9999px;";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-block__header">
        <div className="code-block__dots">
          <span className="code-block__dot code-block__dot--close" />
          <span className="code-block__dot code-block__dot--min" />
          <span className="code-block__dot code-block__dot--max" />
        </div>
        <span className="code-block__title">Terminal</span>
        <button
          className="code-block__copy"
          onClick={handleCopy}
          title="Copy code to clipboard"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      {children}
    </div>
  );
};

export default CodeBlock;
