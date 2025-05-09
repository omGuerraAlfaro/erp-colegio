import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumeros'
})
export class FormatNumberPipe implements PipeTransform {

  transform(value: number): string {
    const formatted = new Intl.NumberFormat().format(value);
    return '$' + formatted.replace(/,/g, '.');
  }

}
