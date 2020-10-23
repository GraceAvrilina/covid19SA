import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular'
import { GlobalService } from '../api/global.service'

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss'],
})
export class TipsComponent { 
public data: any
public show = true

  constructor(
    private loadingController: LoadingController,  
    private router: Router,
    private globalService: GlobalService) {
      this.getTipsList()
    }

    tipslist:any=[]

    async getTipsList() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 2000
    });
    await loading.present();

    let params = {
      code: localStorage.getItem('code')
    }

    this.globalService.getTips(params.code).subscribe( data=>{
    let resp: any = data
    this.tipslist = resp.data
    console.log(this.tipslist)
    this.show = true

    loading.dismiss()
    })
  }

  goToDrivePage(id){
    this.show = false
    this.tipslist.forEach(val => {
      if(val.id == id){
        this.data= val
        console.log(this.data)
      }
    });
}

close() {
  if(this.show == false){
    this.show = true
    this.router.navigate(['home/tips'])  
  }
  else
  this.router.navigate(['home'])
}

  // async getTipsList() {
  //   const loading = await this.loadingController.create({
  //     message: 'Loading...',
  //     duration: 2000
  //   });
  //   await loading.present();

  //   this.globalService.getTips().subscribe( data=>{
  //   let resp: any = data
  //   this.tipslist = data["data"]
  //   loading.dismiss()
  //   })
  // }

  filterTechnologies(param : any) : void
  {

     let val : string 	= param;

     // DON'T filter the technologies IF the supplied input is an empty string
     if (val.trim() !== '') 
     {
        this.tipslist = this.tipslist.filter((x) => 
        {
          return x.title.toLowerCase().indexOf(val.toLowerCase()) > -1 || x.short_desc.toLowerCase().indexOf(val.toLowerCase()) > -1;
        })
     } 
     if(val.trim() == '') {
       this.getTipsList()
     }
  }


}
