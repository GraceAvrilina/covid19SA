import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateIndo'
})
export class CustomDateIndoPipe implements PipeTransform {

  transform(datestring: any,with_time:boolean = false, separator = ', ') {
    let d = new Date(datestring);
    let arr_bulan = [
                  'Januari',
                  'Februari',
                  'Maret',
                  'April',
                  'Mei',
                  'Juni',
                  'Juli',
                  'Agustus',
                  'September',
                  'Oktober',
                  'November',
                  'Desember'
                ]
    let tanggal = d.getDate()
    let bulan = arr_bulan[d.getMonth()]
    let tahun = d.getFullYear()

    if(with_time){
      let hour:any = d.getHours()
      let minute:any = d.getMinutes()
      if(hour < 10){
        hour = "0" + hour
      }

      if(minute < 10){
        minute = "0" + minute
      }

      return tanggal+' '+bulan+' '+tahun + separator + hour + ':' + minute;
    }else{
      return tanggal+' '+bulan+' '+tahun;
    }
  }

}
