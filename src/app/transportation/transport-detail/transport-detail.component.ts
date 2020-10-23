import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router'
import { TransportationService } from '../../api/transportation.service'
import { GlobalService } from '../../api/global.service'
import { ModalController, PopoverController, LoadingController, AlertController, NavController } from '@ionic/angular'
import { AdditemComponent } from '../../widgets/popover/additem/additem.component'
import { Helper } from '../../helper'
@Component({
  selector: 'app-transport-detail',
  templateUrl: './transport-detail.component.html',
  styleUrls: ['./transport-detail.component.scss']
})
export class TransportDetailComponent implements OnInit {
  data: any
  type: string
  typeTransport: any = []
  listBendera: any = []
  title: string = 'Detail Transportasi'
  loading: any
  alert: any
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transportService: TransportationService,
    private globalService: GlobalService,
    public popoverController: PopoverController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.transport
        this.type = this.router.getCurrentNavigation().extras.state.type
      }
    })
  }

  ngOnInit() {
    if (this.data == undefined) {
      location.replace('/home/transportation')
      return false
    }
    this.presentLoadingWithOptions()
    this.getTypeTransport(() => {
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

  getTypeTransport(callback) {
    this.transportService.getTypeTransportation().subscribe(res => {
      let response: any = res
      if (response.status) {
        this.typeTransport = response.data
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
        this.title = 'Add Item'
      }
    })
    return await popover.present()
  }

  addItem() {
    this.type = 'additem'
    this.title = 'Transportasi'
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
    this.alert = await this.alertController.create({
      header: 'Koreksi Nominal Transportasi',
      message:
        '<div>Laporan transportasi ini telah dikoreksi dengan data sebagai berikut </div><br> Nominal Awal: <span class="red-label">' +
        this.data.custom_nominal +
        '</span><br> Nominal Koreksi : ' +
        this.data.custom_nominal_koreksi +
        '<br>' +
        '<br>' +
        'Alasan Koreksi : ' +
        this.data.alasan_koreksi,
      buttons: ['OK']
    })

    await this.alert.present()
  }

  ionViewDidLeave() {
    //this.modalCtrl.dismiss()
  }
}
