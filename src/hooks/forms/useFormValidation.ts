import { useMemo } from 'react';

export interface ValidationRule<T = any> {
  validate: (value: T) => boolean;
  message: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: ValidationRule[];
}

export type ValidationSchema<T extends Record<string, any>> = {
  [K in keyof T]?: FieldValidation;
};

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Form validation hook with schema-based validation
 * Returns validation function and error state
 */
export function useFormValidation<T extends Record<string, any>>(
  schema: ValidationSchema<T>
) {
  const validate = useMemo(() => {
    return (values: T): ValidationError[] => {
      const errors: ValidationError[] = [];

      for (const [field, rules] of Object.entries(schema)) {
        const value = values[field as keyof T];

        // Required validation
        if (rules?.required && !value) {
          errors.push({
            field,
            message: `${field} is required`,
          });
          continue;
        }

        // Skip other validations if value is empty and not required
        if (!value && !rules?.required) {
          continue;
        }

        // String validations
        if (typeof value === 'string') {
          if (rules?.minLength && value.trim().length < rules.minLength) {
            errors.push({
              field,
              message: `${field} must be at least ${rules.minLength} characters`,
            });
          }

          if (rules?.maxLength && value.length > rules.maxLength) {
            errors.push({
              field,
              message: `${field} must be at most ${rules.maxLength} characters`,
            });
          }

          if (rules?.pattern && !rules.pattern.test(value)) {
            errors.push({
              field,
              message: `${field} format is invalid`,
            });
          }
        }

        // Number validations
        if (typeof value === 'number') {
          if (rules?.min !== undefined && value < rules.min) {
            errors.push({
              field,
              message: `${field} must be at least ${rules.min}`,
            });
          }

          if (rules?.max !== undefined && value > rules.max) {
            errors.push({
              field,
              message: `${field} must be at most ${rules.max}`,
            });
          }
        }

        // Custom validations
        if (rules?.custom) {
          for (const customRule of rules.custom) {
            if (!customRule.validate(value)) {
              errors.push({
                field,
                message: customRule.message,
              });
            }
          }
        }
      }

      return errors;
    };
  }, [schema]);

  return { validate };
}
