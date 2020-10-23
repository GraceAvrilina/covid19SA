import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'formatTanggal'
})
export class FormatTanggalPipe implements PipeTransform {
  transform(value: any): any {
    value = value.substr(0, 10)
    var hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    // var bulan = ['Januari', 'Februari', 'Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    var bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Juni', 'Juli', 'Agust', 'Sept', 'Okt', 'Nov', 'Des']
    var tanggal = new Date(value).getDate()
    var xhari = new Date(value).getDay()
    var xbulan = new Date(value).getMonth()
    var xtahun = new Date(value).getFullYear()

    var nama_hari = hari[xhari]
    var nama_bulan = bulan[xbulan]

    return nama_hari + ', ' +tanggal + ' ' + nama_bulan + ' ' + xtahun
  }
}
