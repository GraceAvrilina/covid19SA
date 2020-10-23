import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {
  transform(angka: any): any {
    if (angka != undefined || angka != '') {
      var rupiah = ''
      var angkarev = angka
        .toString()
        .split('')
        .reverse()
        .join('')
      for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.'
      return rupiah
        .split('', rupiah.length - 1)
        .reverse()
        .join('')
    } else {
      return rupiah
    }
  }
}
