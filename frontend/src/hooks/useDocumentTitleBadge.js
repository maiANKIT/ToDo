import { useEffect } from "react";

const BASE_TITLE = "TodoFlow";

/**
 * Sets document.title to "(N) TodoFlow" while there are N > 0 items to
 * flag (typically overdue tasks), reverting to the plain title otherwise.
 * Purely a document.title side-effect — no state, no rendering.
 */
const useDocumentTitleBadge = (count) => {
  useEffect(() => {
    document.title = count > 0 ? `(${count}) ${BASE_TITLE}` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [count]);
};

export default useDocumentTitleBadge;