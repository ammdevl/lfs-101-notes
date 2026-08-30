import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Holds the client-side search index (built at build time via
 * lib/content-meta.js and passed as getStaticProps on every page).
 * Pages register the index; the ⌘K CommandPalette consumes it.
 */
const SearchContext = createContext({ index: [], register: () => {} });

export function SearchProvider({ children }) {
  const [index, setIndex] = useState([]);
  const register = useCallback((nextIndex) => {
    setIndex(Array.isArray(nextIndex) && nextIndex.length ? nextIndex : []);
  }, []);

  return (
    <SearchContext.Provider value={{ index, register }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  return useContext(SearchContext);
}

// Call inside any page component with the getStaticProps-provided index.
export function useRegisterSearchIndex(index) {
  const { register } = useSearchContext();
  useEffect(() => {
    register(index);
    return () => register([]);
  }, [index, register]);
}
