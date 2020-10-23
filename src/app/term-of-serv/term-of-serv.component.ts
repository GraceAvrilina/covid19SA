import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../api/global.service'
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-term-of-serv',
  templateUrl: './term-of-serv.component.html',
  styleUrls: ['./term-of-serv.component.scss'],
})
export class TermOfServComponent implements OnInit {
public isi
public config: PerfectScrollbarConfigInterface = {};
  constructor(
    private globalService: GlobalService) { }

  ngOnInit() {
    this.globalService.getSnK().subscribe(result=>{
      let res: any = result
      if(res.status){
        this.isi = res.data
        // console.log(this.isi)
      }
    })
  }

}
