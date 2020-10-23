import { Component, OnInit } from '@angular/core'
import { ReimburseService } from '../../api/reimburse.service'
import { Router, NavigationExtras } from '@angular/router'
class Reimburse {
  constructor(
    public keyword: string = '',
    public jenis_reimburse: number = -1,
    public tgl_kirim: string = '',
    public tgl_kejadian: string = '',
    public status: string = ''
  ) {}
}
@Component({
  selector: 'app-reimburse-search',
  templateUrl: './reimburse-search.component.html',
  styleUrls: ['./reimburse-search.component.scss']
})
export class ReimburseSearchComponent implements OnInit {
  type_reimburse: any = []
  status: any = []
  reimburse = new Reimburse()
  constructor(private reimburseService: ReimburseService, private router: Router) {
    this.status = [
      {
        value: '',
        text: 'Semua Status'
      },
      {
        value: 'waiting',
        text: 'Menunggu Persetujuan'
      },
      {
        value: 'rejected',
        text: 'Ditolak'
      },
      {
        value: 'approved',
        text: 'Disetujui'
      }
    ]
    this.getTypeReimburse()
  }

  ngOnInit() {
    let obj = {
      id: 0,
      name: 'Semua Jenis Reimburse'
    }
    this.type_reimburse.push(obj)
  }
  getTypeReimburse() {
    this.reimburseService.getTypeReimburse().subscribe(res => {
      let resp: any = res
      if (resp.status) {
        resp.data.forEach(element => {
          this.type_reimburse.push(element)
        })
      }
    })
  }
  search() {
    let navigationExtras: NavigationExtras = {
      state: {
        filter: this.reimburse
      }
    }
    this.router.navigate(['home/reimburse/search/result'], navigationExtras)
  }
  reset() {
    this.reimburse = new Reimburse()
  }
  close() {
    this.router.navigate(['home/reimburse'])
  }
}
