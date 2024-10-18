import { AbstractControl, ValidatorFn } from '@angular/forms';

export function rutValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const rut = control.value;
    if (!rut) {
      return null; // Si no hay valor, no se aplica la validación
    }

    // Eliminar puntos y guiones
    const cleanedRut = rut.replace(/[\.\-]/g, '');
    const match = cleanedRut.match(/^(\d{1,8})([K\d])$/);
    if (!match) {
      return { invalidRut: true }; // Formato incorrecto
    }

    const rutNumber = match[1];
    const dv = match[2];

    // Validar dígito verificador
    let sum = 0;
    let multiplier = 2;

    for (let i = rutNumber.length - 1; i >= 0; i--) {
      sum += parseInt(rutNumber.charAt(i), 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const calculatedDV = 11 - (sum % 11);
    const calculatedDVString = calculatedDV === 10 ? 'K' : calculatedDV === 11 ? '0' : calculatedDV.toString();

    return calculatedDVString === dv.toUpperCase() ? null : { invalidRut: true }; // RUT inválido
  };
}