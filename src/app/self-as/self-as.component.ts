import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router'
import { GlobalService } from '../api/global.service'

@Component({
  selector: 'app-self-as',
  templateUrl: './self-as.component.html',
  styleUrls: ['./self-as.component.scss'],
})
export class SelfAsComponent implements OnInit {

  public lat
  public lng
  public status
  constructor(  
    private globalService: GlobalService, 
    private router: Router) { }

  ngOnInit() {
    let params = {
    username: localStorage.getItem('username'),
    code: localStorage.getItem('code')
  }
  this.globalService.getDataUser(params.username,params.code).subscribe(res => {
    let resp: any = res
    
      this.status = resp.data[0].name
  })
}
  selectMenu(url) {
    let navigationExtras: NavigationExtras = {
      state: {
        reload: true
      }
    }
    this.router.navigate([url], navigationExtras)
  }

  close() {
    this.router.navigate(['home'])
  }
}
