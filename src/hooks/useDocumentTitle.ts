import { useEffect } from 'react';

const APP_NAME = 'PrepRoute';

/**
 * Sets the document `<title>` to `"<pageTitle> | PrepRoute"`.
 * Resets to the base app name when the component unmounts.
 *
 * @example
 * useDocumentTitle('Create Test');  // => "Create Test | PrepRoute"
 */
export const useDocumentTitle = (pageTitle: string): void => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = pageTitle ? `${pageTitle} | ${APP_NAME}` : APP_NAME;

    return () => {
      document.title = previousTitle;
    };
  }, [pageTitle]);
};

export default useDocumentTitle;
