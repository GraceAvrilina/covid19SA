import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ReimburseService } from '../../api/reimburse.service'
import { GlobalService } from '../../api/global.service'
import { NavController, PopoverController, LoadingController, AlertController } from '@ionic/angular'
import { AdditemComponent } from '../../widgets/popover/additem/additem.component'
import { Helper } from '../../helper'
@Component({
  selector: 'app-reimburse-detail',
  templateUrl: './reimburse-detail.component.html',
  styleUrls: ['./reimburse-detail.component.scss']
})
export class ReimburseDetailComponent implements OnInit {
  data: any
  type: string
  type_reimburse: any = []
  listBendera: any = []
  title: string = 'Detail Reimburse'
  loading: any
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reimburseService: ReimburseService,
    private globalService: GlobalService,
    public popoverController: PopoverController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.reimbuse
        this.type = this.router.getCurrentNavigation().extras.state.type
      }
    })
  }

  ngOnInit() {
    if (this.data == undefined) {
      location.replace('home/reimburse')
      return false
    }
    this.presentLoadingWithOptions()
    this.getTypeReimburse(() => {
      this.getListBendera(() => {
        this.loading.dismiss()
        if (
          (this.data.nominal_koreksi != null || this.data.alasan_koreksi != null) &&
          this.data.nominal_koreksi != this.data.nominal
        ) {
          this.alertCorrection()
        }
      })
    })
  }

  getTypeReimburse(callback) {
    this.reimburseService.getTypeReimburse().subscribe(res => {
      let resp: any = res
      if (resp.status) {
        this.type_reimburse = resp.data
      }
      return callback()
    })
  }

  getListBendera(callback) {
    this.globalService.getListBendera().subscribe(res => {
      let response: any = res
      if (response.status) {
        this.listBendera = response.data
      }
      return callback()
    })
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: AdditemComponent,
      event: ev,
      translucent: true
    })

    popover.onDidDismiss().then(res => {
      if (res.data == 'additem') {
        this.type = 'additem'
      }
    })
    return await popover.present()
  }
  addItem() {
    this.type = 'additem'
    this.title = 'Reimburse'
  }
  close() {
    this.navCtrl.pop()
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.loading = await this.loadingController.create(config_loading)
    return await this.loading.present()
  }

  async alertCorrection() {
    const alert = await this.alertController.create({
      header: 'Info Koreksi',
      message:
        '<div>Laporan reimburse ini telah dikoreksi dengan data sebagai berikut </div><br> Nominal Awal: <span class="red-label">' +
        this.data.custom_nominal +
        '</span><br> Nominal Koreksi : ' +
        this.data.custom_nominal_koreksi +
        '<br>' +
        '<br>' +
        'Alasan Koreksi : ' +
        this.data.alasan_koreksi
    })

    await alert.present()
  }
}
