import { Component, OnInit } from '@angular/core';
import { Platform, NavParams, ModalController } from '@ionic/angular'
import { Router, ActivatedRoute , NavigationExtras} from '@angular/router'

@Component({
  selector: 'app-result-ass',
  templateUrl: './result-ass.component.html',
  styleUrls: ['./result-ass.component.scss'],
})
export class ResultAssComponent implements OnInit {
  public item:any
  public username
  public nextTime = false
  public nip
  public dinas
  constructor(
    private modalCtrl: ModalController,
    private router: Router,) {
    this.username = localStorage.getItem('full_name') 
    this.nip = localStorage.getItem('nip') 
    this.dinas = localStorage.getItem('dinas') 
  }

  ngOnInit() {
    if(this.item.skrg == this.item.status){
      this.nextTime = true
    }
    console.log(this.item)
  }

  selectMenu(url) {
    // this.router.navigateByUrl(url)

    let navigationExtras: NavigationExtras = {
      state: {
        reload: true
      }
    }
    this.router.navigate([url], navigationExtras)
    this.modalCtrl.dismiss()
  }

  close() {
    this.modalCtrl.dismiss()
    this.router.navigate(['home'])
  }
}
