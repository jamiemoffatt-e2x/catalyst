import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';

import { Field, FieldLabel, FieldMessage } from '~/components/ui/form';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioItem } from '~/components/ui/radio-group';

import { AddressFields } from '..';

type RadioButtonsType = Extract<
  NonNullable<AddressFields>[number],
  { __typename: 'RadioButtonsFormField' }
>;

interface RadioButtonsTypeProps {
  defaultValue?: string;
  field: RadioButtonsType;
  isValid?: boolean;
  name: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const RadioButtons = ({
  defaultValue,
  field,
  isValid,
  name,
  onChange,
}: RadioButtonsTypeProps) => {
  const t = useTranslations('Account.Register.validationMessages');
  const validationError = field.isRequired && isValid === false;

  return (
    <Field className="relative space-y-2" name={name}>
      <fieldset>
        <RadioGroup
          aria-labelledby={name}
          defaultValue={defaultValue}
          name={name}
          onChange={onChange}
          onInvalid={onChange}
          required={field.isRequired}
        >
          <FieldLabel asChild id={name}>
            <legend className="mb-2.5 inline-flex w-full items-center justify-between text-base font-semibold">
              <span>{field.label}</span>
              {field.isRequired && (
                <span className="text-xs font-normal text-gray-500">Required</span>
              )}
            </legend>
          </FieldLabel>
          {field.options.map((option) => {
            const itemId = option.entityId;

            return (
              <div className="mb-2" key={itemId}>
                <Label className="flex w-full cursor-pointer gap-3 ps-4 font-normal">
                  <RadioItem
                    id={`${itemId}`}
                    value={`${itemId}`}
                    variant={validationError ? 'error' : undefined}
                  />
                  <p>{option.label}</p>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        <div className="relative h-7">
          {validationError && (
            <FieldMessage className="inline-flex w-full text-xs font-normal text-error-secondary">
              {t('empty')}
            </FieldMessage>
          )}
        </div>
      </fieldset>
    </Field>
  );
};
