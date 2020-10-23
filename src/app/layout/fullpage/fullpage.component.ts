import { Component, OnInit } from '@angular/core'
import { GlobalService } from 'src/app/api/global.service'

@Component({
  selector: 'app-fullpage',
  templateUrl: './fullpage.component.html',
  styleUrls: ['./fullpage.component.scss']
})
export class FullpageComponent implements OnInit {
  constructor(
    private globalService: GlobalService,
  ) {
    this.globalService.getWorkspace()
  }

  ngOnInit() {
    this.globalService.getWorkspace().subscribe( data=>{
      let resp: any = data
      localStorage.setItem("code", resp.data.code)
      localStorage.setItem("logo", resp.data.app_logo_img)
      console.log(localStorage.getItem("code"))
    })
  }
}
