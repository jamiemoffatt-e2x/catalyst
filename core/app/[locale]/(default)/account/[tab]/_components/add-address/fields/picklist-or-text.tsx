import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';

import { Field, FieldControl, FieldLabel, FieldMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem } from '~/components/ui/select';

import { AddressFields, FieldNameToFieldId } from '..';

type PicklistOrTextType = Extract<
  NonNullable<AddressFields>[number],
  { __typename: 'PicklistOrTextFormField' }
>;

interface PicklistOrTextProps {
  defaultValue?: string;
  field: PicklistOrTextType;
  name: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
  options: Array<{ label: string; entityId: string | number }>;
  variant?: 'error';
}

export const PicklistOrText = ({
  defaultValue,
  field,
  name,
  onChange,
  options,
}: PicklistOrTextProps) => {
  const t = useTranslations('Account.Register');

  return (
    <Field className="relative space-y-2 pb-7" name={name}>
      <FieldLabel htmlFor={`field-${field.entityId}`} isRequired={field.isRequired}>
        {field.label}
      </FieldLabel>
      <FieldControl asChild>
        {field.entityId === FieldNameToFieldId.stateOrProvince && options.length === 0 ? (
          <Input
            id={`field-${field.entityId}`}
            onChange={field.isRequired ? onChange : undefined}
            onInvalid={field.isRequired ? onChange : undefined}
            required={field.isRequired}
            type="text"
          />
        ) : (
          <Select
            aria-label={field.label}
            defaultValue={defaultValue}
            disabled={false}
            id={`field-${field.entityId}`}
            placeholder={field.label}
            required={field.isRequired}
          >
            <SelectContent position="item-aligned">
              {field.entityId === FieldNameToFieldId.stateOrProvince &&
                options.map(({ entityId, label }) => {
                  return (
                    <SelectItem key={entityId} value={entityId.toString()}>
                      {label}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        )}
      </FieldControl>
      {field.isRequired && options.length === 0 && (
        <FieldMessage
          className="absolute inset-x-0 bottom-0 inline-flex w-full text-xs font-normal text-red-200"
          match="valueMissing"
        >
          {t('emptyTextValidatoinMessage')}
        </FieldMessage>
      )}
    </Field>
  );
};
