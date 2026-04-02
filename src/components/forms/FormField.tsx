import type { ReactNode } from 'react';
import { Input, type InputProps } from '../ui/Input';
import { Textarea, type TextareaProps } from '../ui/Textarea';
import { Select, type SelectProps } from '../ui/Select';
import { Switch, type SwitchProps } from '../ui/Switch';
import { Slider, type SliderProps } from '../ui/Slider';

export type FormFieldType = 'input' | 'textarea' | 'select' | 'switch' | 'slider' | 'custom';

interface BaseFormFieldProps {
  type: FormFieldType;
  error?: string;
}

interface InputFieldProps extends BaseFormFieldProps {
  type: 'input';
  inputProps: InputProps;
}

interface TextareaFieldProps extends BaseFormFieldProps {
  type: 'textarea';
  textareaProps: TextareaProps;
}

interface SelectFieldProps extends BaseFormFieldProps {
  type: 'select';
  selectProps: SelectProps;
}

interface SwitchFieldProps extends BaseFormFieldProps {
  type: 'switch';
  switchProps: SwitchProps;
}

interface SliderFieldProps extends BaseFormFieldProps {
  type: 'slider';
  sliderProps: SliderProps;
}

interface CustomFieldProps extends BaseFormFieldProps {
  type: 'custom';
  children: ReactNode;
}

export type FormFieldProps =
  | InputFieldProps
  | TextareaFieldProps
  | SelectFieldProps
  | SwitchFieldProps
  | SliderFieldProps
  | CustomFieldProps;

/**
 * Unified form field component
 * Renders different input types with consistent error handling
 */
export function FormField(props: FormFieldProps) {
  const renderField = () => {
    switch (props.type) {
      case 'input':
        return <Input {...props.inputProps} />;
      case 'textarea':
        return <Textarea {...props.textareaProps} />;
      case 'select':
        return <Select {...props.selectProps} />;
      case 'switch':
        return <Switch {...props.switchProps} />;
      case 'slider':
        return <Slider {...props.sliderProps} />;
      case 'custom':
        return props.children;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderField()}
      {props.error && (
        <p className="mt-1 text-sm text-jarvis-orange">{props.error}</p>
      )}
    </div>
  );
}
