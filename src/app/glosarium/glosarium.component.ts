import { Component } from '@angular/core';
import { GlobalService } from '../api/global.service'
import { LoadingController } from '@ionic/angular'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-glosarium',
  templateUrl: './glosarium.component.html',
  styleUrls: ['./glosarium.component.scss'],
})
export class GlosariumComponent {

  tableStyle = 'material';
  gloslist:any[]=[]
  public keyword: String = ''
  public subscription: Subscription
  public numPages: number = 0
  public p: number = 0
  public bigTotalItems: number = 0
  public bigCurrentPage: number = 1
  public totalPages: number = 0
  public itemsPerPage: number = 10

  constructor(
    private loadingController: LoadingController,  
    private router: Router,
    private globalService: GlobalService
  ) { 
    this.getGlosList()
  }
  
  searching(event) {
    // console.log(event)
    if(event && event.key === "Enter"){
      this.keyword = this.keyword
      // this.itemByInput.proyek = this.keyword
      if (this.subscription) {
        this.subscription.unsubscribe()
      }

      if (this.keyword != '') {
        // Close any running subscription.
        if (this.subscription) {
          this.subscription.unsubscribe()
        }
        this.getGlosList()
      } else {
        this.getGlosList()
      }
    }
  } 

  async getGlosList(){
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 2000
    });
    await loading.present();

    let params: any= {
      start: this.numPages,
      rows: this.itemsPerPage,
      keyword: this.keyword
    }

    let params2 = {
      code: localStorage.getItem('code')
    }
    console.log(localStorage.getItem('code'))
    this.globalService.getGlosarium(params, params2.code).subscribe( val=>{
    let result: any = val
    this.gloslist = result.data

    let total_data = result.count
    this.bigTotalItems = total_data
    let data = result.data

    let count_currentdata = data.length
    let total_pages = this.numPages + count_currentdata
    this.totalPages = total_pages
    loading.dismiss()
    })
  }

  public pageChanged(event: any){
    this.numPages = (event - 1) * this.itemsPerPage
    this.getGlosList()
  }


  close() {
    this.router.navigate(['home'])
  }

}
