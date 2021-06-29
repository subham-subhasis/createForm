import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOrder',
  pure: true
})
export class OrderByPipe implements PipeTransform {

  transform(value: any[], criteria: SortCriteria): any[] {
    if (!value || !criteria) {
      return value;
    }
    const p: string = criteria.property;
    const sortFn: (a: any, b: any) => any = (a, b) => {
      let valueInside = 0;
      if (a[p] === undefined) { valueInside = -1; } else if (b[p] === undefined) { valueInside = 1; } else { valueInside = a[p] > b[p] ? 1 : (b[p] > a[p] ? -1 : 0); }
      return criteria.descending ? (valueInside * -1) : valueInside;
    };
    value.sort(sortFn);
    return value;
  }

}

export interface SortCriteria {
  property: string;
  descending?: boolean;
}
