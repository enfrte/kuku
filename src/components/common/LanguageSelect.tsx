import { useState } from 'react'
import { languageLabel, searchLanguages } from '../../data/languages'

export function LanguageSelect({
  id,
  label,
  value,
  onChange,
  required = false,
}: {
  id: string
  label: string
  value: string
  onChange: (code: string) => void
  required?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const results = searchLanguages(query)

  return (
    <div className="position-relative">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        type="text"
        className="form-control"
        autoComplete="off"
        value={open ? query : languageLabel(value)}
        placeholder="Search languages…"
        required={required}
        aria-expanded={open}
        aria-controls={`${id}-options`}
        role="combobox"
        onFocus={() => {
          setOpen(true)
          setQuery('')
        }}
        onBlur={() => setOpen(false)}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
      />
      {open ? (
        <div
          id={`${id}-options`}
          className="list-group position-absolute w-100 shadow-sm"
          style={{ zIndex: 1050, maxHeight: 300, overflowY: 'auto' }}
          role="listbox"
        >
          {results.length === 0 ? (
            <div className="list-group-item text-secondary">No languages found.</div>
          ) : (
            results.map((language) => (
              <button
                key={language.code}
                type="button"
                role="option"
                aria-selected={language.code === value}
                className={`list-group-item list-group-item-action${
                  language.code === value ? ' active' : ''
                }`}
                onMouseDown={(event) => {
                  event.preventDefault()
                  onChange(language.code)
                  setOpen(false)
                  setQuery('')
                }}
              >
                {language.name}
                <span
                  className={`float-end font-monospace${
                    language.code === value ? ' text-white-50' : ' text-secondary'
                  }`}
                >
                  {language.code}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
