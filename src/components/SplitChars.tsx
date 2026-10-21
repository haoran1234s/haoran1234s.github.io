import { Fragment } from 'react'

/**
 * Splits text into `.split-word` > `.split-char` spans so characters can be animated
 * individually while words still wrap naturally.
 */
export function SplitChars({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {wordIndex > 0 && ' '}
          <span className="split-word">
            {Array.from(word).map((char, charIndex) => (
              <span className="split-char" key={charIndex}>
                {char}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  )
}
