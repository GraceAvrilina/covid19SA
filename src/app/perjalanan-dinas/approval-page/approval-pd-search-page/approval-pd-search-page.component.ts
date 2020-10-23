import { Component, OnInit } from '@angular/core'
import { GlobalService } from '../../../api/global.service'
import { ModalController } from '@ionic/angular'
import { ModalSelectActivityComponent } from '../../../widgets/modal-select-activity/modal-select-activity.component'
import { Router, NavigationExtras } from '@angular/router'

@Component({
  selector: 'app-approval-pd-search-page',
  templateUrl: './approval-pd-search-page.component.html',
  styleUrls: ['./approval-pd-search-page.component.scss']
})
export class ApprovalPdSearchPageComponent implements OnInit {
  public params: any = {
    keyword: '',
    id_jenis: '',
    aktivitas_name: '',
    id_bendera: '',
    tgl_dinas: '',
    status: ''
  }
  public listBendera: any = []

  constructor(private globalService: GlobalService, private modalController: ModalController, private router: Router) {}

  ngOnInit() {
    this.getListBendera()
  }

  getListBendera() {
    this.globalService.getListBendera().subscribe(res => {
      let response: any = res
      if (response.status) {
        this.listBendera = response.data
      }
    })
  }

  close() {
    this.router.navigate(['home/perjalanan-dinas/approval'])
  }

  async searchTypeActivity() {
    const modal = await this.modalController.create({
      component: ModalSelectActivityComponent
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.params.id_jenis = res.data.id
        this.params.aktivitas_name = res.data.name
      }
    })
    return await modal.present()
  }

  search() {
    let navigationExtras: NavigationExtras = {
      state: {
        filter: this.params
      }
    }
    this.router.navigate(['home/perjalanan-dinas/approval/search/result'], navigationExtras)
  }
  reset() {
    this.params = {
      keyword: '',
      id_jenis: '',
      aktivitas_name: '',
      id_bendera: '',
      tgl_dinas: ''
    }
  }
}
