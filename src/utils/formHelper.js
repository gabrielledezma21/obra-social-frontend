export const getErrorProps = (error, fieldName, idPrefix = '') => {
  const fullFieldName = idPrefix ? `${idPrefix}${fieldName}` : fieldName;
  const hasError = error?.field === fullFieldName;

  return {
    error: hasError,
    helperText: hasError ? error.message : '',
  };
};
