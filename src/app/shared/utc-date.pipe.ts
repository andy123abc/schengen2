import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDate',
})
export class UtcDate implements PipeTransform {
  transform(value: Date) {
    //Going with UK format so it displays the DD-MMM-YYYY format
    const formatter = new Intl.DateTimeFormat('en-UK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
    return formatter.format(value);
  }
}
