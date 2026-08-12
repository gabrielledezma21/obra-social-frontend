import { useFormValidationContext } from '../context/FormValidationContext';

export const useFormValidation = (validator) => {
  const { setValidationError, clearErrors } = useFormValidationContext();

  const validateBeforeSave = (formData, onValid) => {
    const validation = validator(formData);

    if (validation) {
      setValidationError(validation.field, validation.message);

      const el = document.querySelector(`[data-field="${validation.field}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return false;
    }

    clearErrors();
    if (onValid) onValid();
    return true;
  };

  return { validateBeforeSave };
};
