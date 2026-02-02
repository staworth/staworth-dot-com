import React, { useEffect, useRef, useState } from "react";

type FilterOption = {
  id: string;
  label: string;
};

interface ArticleFiltersProps {
  selectedTags: string[];
  selectedYears: string[];
  onToggleTag: (tag: string) => void;
  onToggleYear: (year: string) => void;
  onClearTags: () => void;
  onClearYears: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

const TAG_OPTIONS: FilterOption[] = [
  { id: "beefy", label: "Beefy" },
  { id: "staworth", label: "Staworth" },
  { id: "octav", label: "Octav" },
  { id: "kpk", label: "kpk" },
];

const YEAR_OPTIONS: FilterOption[] = [
  { id: "2023", label: "2023" },
  { id: "2024", label: "2024" },
  { id: "2025", label: "2025" },
  { id: "2026", label: "2026" },
];

export default function ArticleFilters({
  selectedTags,
  selectedYears,
  onToggleTag,
  onToggleYear,
  onClearTags,
  onClearYears,
  searchQuery,
  onSearchChange,
  onClearSearch,
}: ArticleFiltersProps) {
  const [tagsOpen, setTagsOpen] = useState(false);
  const [yearsOpen, setYearsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (event.target instanceof Node && !containerRef.current.contains(event.target)) {
        setTagsOpen(false);
        setYearsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tagLabel = selectedTags.length ? `Tag (${selectedTags.length})` : "Tag";
  const yearLabel = selectedYears.length ? `Year (${selectedYears.length})` : "Year";

  return (
    <div className="filter-bar" ref={containerRef}>
      <div className="filter-search">
        <input
          className="filter-search-input"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search articles"
        />
        <span className="filter-search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      </div>

      <div className="filter-controls">
        <div className={`filter-dropdown${tagsOpen ? " is-open" : ""}`}>
          <button
            className="filter-button"
          type="button"
          onClick={() => {
            setTagsOpen((prev) => !prev);
            setYearsOpen(false);
          }}
          aria-expanded={tagsOpen}
        >
          <span className="filter-button-label">{tagLabel}</span>
          <span className="filter-caret" aria-hidden="true">▾</span>
        </button>
        {tagsOpen && (
          <div className="filter-menu" role="listbox" aria-label="Filter by tag">
            {TAG_OPTIONS.map((option) => (
              <label key={option.id} className="filter-option">
                <input
                  className="filter-checkbox"
                  type="checkbox"
                  checked={selectedTags.includes(option.id)}
                  onChange={() => onToggleTag(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}
        </div>

        <div className={`filter-dropdown${yearsOpen ? " is-open" : ""}`}>
        <button
          className="filter-button"
          type="button"
          onClick={() => {
            setYearsOpen((prev) => !prev);
            setTagsOpen(false);
          }}
          aria-expanded={yearsOpen}
        >
          <span className="filter-button-label">{yearLabel}</span>
          <span className="filter-caret" aria-hidden="true">▾</span>
        </button>
        {yearsOpen && (
          <div className="filter-menu" role="listbox" aria-label="Filter by year">
            {YEAR_OPTIONS.map((option) => (
              <label key={option.id} className="filter-option">
                <input
                  className="filter-checkbox"
                  type="checkbox"
                  checked={selectedYears.includes(option.id)}
                  onChange={() => onToggleYear(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}
        </div>
        <button
          className="filter-clear-all"
          type="button"
          onClick={() => {
            onClearTags();
            onClearYears();
            onClearSearch();
            setTagsOpen(false);
            setYearsOpen(false);
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
