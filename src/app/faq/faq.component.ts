import { Component, OnInit } from '@angular/core'
import { MenuController,LoadingController } from '@ionic/angular'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../api/global.service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  constructor(
    // private menu: MenuController,
    private loadingController: LoadingController,  
    // private sanitizer: DomSanitizer,
    private router: Router,
    private globalService: GlobalService) {
      this.getFaqList()
    }

    faqlist:any[]=[]
    automaticClose = false;

    toogleSection(index) {
      this.faqlist[index].open = !this.faqlist[index].open;

      if (this.automaticClose && this.faqlist[index].open) {
        this.faqlist
        .filter((x, xIndex) => xIndex != index)
        .map(x => x.open = false);
      }
    }

    toogleItem(index, childIndex){
      this.faqlist[index].children[childIndex].open = !this.faqlist[index].open;
    }

    async getFaqList(){
      const loading = await this.loadingController.create({
        message: 'Loading...',
        duration: 2000
      });
      await loading.present();

      let params = {
        code: localStorage.getItem('code')
      }
      console.log(localStorage.getItem('code'))
      this.globalService.getFaq(params.code).subscribe( data=>{
      this.faqlist=data["data"]
      this.faqlist[0].open = false;
      loading.dismiss()
      })
    }

  // ngOnInit() {
  //   this.safeFaqUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.faq_url)
  // }

  // openFirst() {
  //   this.menu.enable(true, 'custom')
  //   this.menu.close('custom')
  // }

  close() {
    this.router.navigate(['home'])
  }
}
