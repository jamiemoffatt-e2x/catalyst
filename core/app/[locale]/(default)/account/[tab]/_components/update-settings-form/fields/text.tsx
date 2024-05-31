import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';

import { Field, FieldControl, FieldLabel, FieldMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';

import { FieldNameToFieldId } from '..';

interface TextProps {
  defaultValue?: string;
  entityId: number;
  name?: string;
  isRequired?: boolean;
  isValid?: boolean;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email';
}

export const Text = ({
  defaultValue,
  entityId,
  isRequired = false,
  isValid,
  name,
  label,
  onChange,
  type = 'text',
}: TextProps) => {
  const t = useTranslations('Account.Settings.validationMessages');
  const nameById = FieldNameToFieldId[entityId];
  const fieldName = name ?? nameById ?? `field-${entityId}`;

  return (
    <Field className="relative space-y-2 pb-7" name={fieldName}>
      <FieldLabel htmlFor={fieldName} isRequired={isRequired}>
        {label}
      </FieldLabel>
      <FieldControl asChild>
        <Input
          defaultValue={defaultValue}
          id={`field-${entityId}`}
          onChange={isRequired ? onChange : undefined}
          onInvalid={isRequired ? onChange : undefined}
          required={isRequired}
          type={type}
          variant={isValid === false ? 'error' : undefined}
        />
      </FieldControl>
      {isRequired && (
        <FieldMessage
          className="absolute inset-x-0 bottom-0 inline-flex w-full text-xs font-normal text-error-secondary"
          match="valueMissing"
        >
          {t(nameById ?? 'empty')}
        </FieldMessage>
      )}
    </Field>
  );
};
