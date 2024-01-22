import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mount'
})
export class MountPipe implements PipeTransform {

  transform(value: number)
  {
    return "$" + new Intl.NumberFormat().format(value);
  }

}
