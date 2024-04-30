import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { Countries, createFieldName, FieldNameToFieldId } from '.';

interface FieldState {
  [key: string]: boolean;
}

type FieldStateSetFunction = Dispatch<
  SetStateAction<{
    [key: string]: boolean;
  }>
>;

const createTextInputValidationHandler =
  (textInputState: FieldState, textInputStateSetter: FieldStateSetFunction) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    const fieldId = Number(e.target.id.split('-')[1]);

    const validityState = e.target.validity;
    const validationStatus = validityState.valueMissing || validityState.typeMismatch;

    return textInputStateSetter({ ...textInputState, [fieldId]: !validationStatus });
  };

const createPasswordValidationHandler =
  (passwordStateSetter: FieldStateSetFunction) => (e: ChangeEvent<HTMLInputElement>) => {
    const fieldId = e.target.id.split('-')[1] ?? '';

    switch (FieldNameToFieldId[Number(fieldId)]) {
      case 'password':
        return passwordStateSetter((prevState) => ({
          ...prevState,
          [fieldId]: !e.target.validity.valueMissing,
        }));

      case 'confirmPassword': {
        const confirmPassword = e.target.value;

        const passwordFieldName = createFieldName('customer', +fieldId);
        const password = new FormData(e.target.form ?? undefined).get(passwordFieldName);

        return passwordStateSetter((prevState) => ({
          ...prevState,
          [fieldId]: password === confirmPassword && !e.target.validity.valueMissing,
        }));
      }

      default:
        return passwordStateSetter((prevState) => ({
          ...prevState,
          [fieldId]: !e.target.validity.valueMissing,
        }));
    }
  };

const createPicklistOrTextValidationHandler =
  (picklistWithTextState: FieldState, picklistWithTextStateSetter: FieldStateSetFunction) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    const fieldId = Number(e.target.id.split('-')[1]);

    const validationStatus = e.target.validity.valueMissing;

    return picklistWithTextStateSetter({ ...picklistWithTextState, [fieldId]: !validationStatus });
  };

const createCountryChangeHandler =
  (
    countries: Countries,
    provinceSetter: Dispatch<SetStateAction<Countries[number]['statesOrProvinces']>>,
  ) =>
  (value: string) => {
    const states = countries.find(({ code }) => code === value)?.statesOrProvinces;

    provinceSetter(states ?? []);
  };

export {
  createTextInputValidationHandler,
  createPicklistOrTextValidationHandler,
  createPasswordValidationHandler,
  createCountryChangeHandler,
};
