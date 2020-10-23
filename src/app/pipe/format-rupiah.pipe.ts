import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'formatRupiah'
})
export class FormatRupiahPipe implements PipeTransform {
  transform(angka: any): any {
    if (angka != undefined || angka != '') {
      if (typeof angka == 'string') {
        angka = parseInt(angka.split('.').join(''))
      }
      var rupiah = ''
      var angkarev = angka
        .toString()
        .split('')
        .reverse()
        .join('')
      for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.'
      return (
        'Rp ' +
        rupiah
          .split('', rupiah.length - 1)
          .reverse()
          .join('')
      )
    } else {
      return rupiah
    }
  }
}
