export const handleArrayChange = (setState) => (field, newValues) => {
  setState((prev) => ({
    ...prev,
    [field]: newValues,
  }));
};
