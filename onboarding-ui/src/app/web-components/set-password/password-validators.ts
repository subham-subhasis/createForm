import { AbstractControl, ValidationErrors } from '@angular/forms';

// tslint:disable-next-line: only-arrow-functions
export const PasswordStrengthValidator = function(control: AbstractControl): ValidationErrors | null {

    const value: string = control.value || '';

    if (!value) {
        return null;
    }

    const upperCaseCharacters = /[A-Z]+/g;
    if (upperCaseCharacters.test(value) === false) {
        return { passwordStrength: `It should contain at least 1 upper case characters.` };
    }

    const lowerCaseCharacters = /[a-z]+/g;
    if (lowerCaseCharacters.test(value) === false) {
        return { passwordStrength: `It should contain at least 1 lower case characters.` };
    }


    const numberCharacters = /[0-9]+/g;
    if (numberCharacters.test(value) === false) {
        return { passwordStrength: `It should contain at least 1 number.` };
    }

    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialCharacters.test(value) === false) {
        return { passwordStrength: `It should contain at least 1 special character.` };
    }
    return null;
};

