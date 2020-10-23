import { Component, OnInit } from '@angular/core'
import { ReimburseService } from '../../api/reimburse.service'
import { Router, NavigationExtras } from '@angular/router'
class Params {
  constructor(
    public keyword: string = '',

    public tgl_kirim: string = '',
    public tgl_kejadian: string = '',
    public jenis_laporan: string = 'transport'
  ) {}
}

@Component({
  selector: 'app-search-approval',
  templateUrl: './search-approval.component.html',
  styleUrls: ['./search-approval.component.scss']
})
export class SearchApprovalComponent implements OnInit {
  params = new Params()
  constructor(private router: Router) {}

  ngOnInit() {}
  search() {
    let navigationExtras: NavigationExtras = {
      state: {
        filter: this.params
      }
    }
    this.router.navigate(['home/approval-leader/search/result'], navigationExtras)
  }
  reset() {
    this.params = new Params()
  }
  close() {
    this.router.navigate(['home/approval-leader'])
  }
}
