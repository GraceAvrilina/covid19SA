import { Component, Input } from '@angular/core'
import { Platform, NavParams, ModalController } from '@ionic/angular'
import { AlertController, LoadingController } from '@ionic/angular'
import { GlobalService } from '../../../api/global.service'
import { ModalCorrectionComponent } from '../../perjalanan-dinas/modal-correction/modal-correction.component'
import { Helper } from '../../../helper'
import { PerjalananDinasService } from './../../../api/perjalanan-dinas.service'
@Component({
  selector: 'app-detail-approval-dinas',
  templateUrl: './detail-approval-dinas.component.html',
  styleUrls: ['./detail-approval-dinas.component.scss']
})
export class DetailApprovalDinasComponent {
  @Input() data: any
  loading: any
  constructor(
    navParams: NavParams,
    private platform: Platform,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private globalService: GlobalService,
    private perjalanDinasService: PerjalananDinasService
  ) {}

  close() {
    this.modalCtrl.dismiss({ reload: false })
  }

  async confirmApprove(status, data) {
    let header = 'Approve Perjalanan Dinas'
    if (status == 'rejected') {
      header = 'Tolak Perjalanan Dinas'
    }
    let message = 'Apakah anda yakin setujui perjalanan dinas ini ?'
    if (status == 'rejected') message = 'Apakah anda yakin menolak perjalanan dinas ini ?'
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      inputs: [],
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah')
          }
        },
        {
          text: 'Ya',
          handler: res => {
            this.saveStatus(data)
          }
        }
      ]
    })

    await alert.present()
  }

  async showModalCorrection(data, key) {
    data.status = this.data.status
    const modal = await this.modalCtrl.create({
      component: ModalCorrectionComponent,
      componentProps: { data: data }
    })
    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        let pemakaian_koreksi = 0
        let sisa_koreksi = 0
        let arr_koreksi_item = []
        this.data.dinas_item.forEach(v => {
          pemakaian_koreksi = pemakaian_koreksi + v.harga_total_koreksi
          if (v.jumlah_koreksi == null) {
            pemakaian_koreksi = pemakaian_koreksi + v.harga_total
          }
          let koreksi_item: any = {}
          koreksi_item.id = v.id
          koreksi_item.jumlah_koreksi = v.jumlah_koreksi
          koreksi_item.alasan_koreksi = v.alasan_koreksi
          koreksi_item.unit_koreksi = v.unit_koreksi
          koreksi_item.harga_unit_koreksi = v.harga_unit_koreksi
          koreksi_item.harga_total_koreksi = v.harga_total_koreksi
          arr_koreksi_item.push(koreksi_item)
        })

        sisa_koreksi = this.data.cash_advance - pemakaian_koreksi
        this.data.pemakaian = pemakaian_koreksi
        this.data.sisa = sisa_koreksi
      }
    })
    if (this.data.status == 'approved') {
      /* cek apakah ada koreksi */
      if (data.unit_koreksi != null || data.harga_unit_koreksi != null || data.jumlah_koreksi != null) {
        if (
          data.unit_koreksi == data.unit &&
          data.harga_unit_koreksi == data.harga_unit &&
          data.jumlah == data.jumlah_koreksi
        ) {
          return await modal.present()
        } else {
          this.alertInfoItemBiaya(data, modal)
        }
      } else {
        return await modal.present()
      }
    } else {
      return await modal.present()
    }
  }

  changeStatus(status) {
    let formData = new FormData()
    let pemakaian_koreksi = 0
    let sisa_koreksi = 0
    let arr_koreksi_item = []
    this.data.dinas_item.forEach(v => {
      if (v.harga_total_koreksi == null) {
        pemakaian_koreksi = pemakaian_koreksi + v.harga_total
      } else {
        pemakaian_koreksi = pemakaian_koreksi + v.harga_total_koreksi
      }
      let koreksi_item: any = {}
      koreksi_item.id = v.id
      koreksi_item.jumlah_koreksi = v.jumlah_koreksi
      koreksi_item.alasan_koreksi = v.alasan_koreksi
      koreksi_item.unit_koreksi = v.unit
      koreksi_item.harga_unit_koreksi = v.harga_unit_koreksi
      koreksi_item.harga_total_koreksi = v.harga_total_koreksi
      arr_koreksi_item.push(koreksi_item)
    })

    sisa_koreksi = this.data.cash_advance - pemakaian_koreksi
    let str_pemakaian_koreksi = ''
    let str_sisa_koreksi = ''
    if (pemakaian_koreksi != 0) {
      str_pemakaian_koreksi = pemakaian_koreksi.toString()
    }

    if (sisa_koreksi != 0) {
      str_sisa_koreksi = sisa_koreksi.toString()
    }

    let params = {
      pemakaian_koreksi: str_pemakaian_koreksi,
      sisa_koreksi: str_sisa_koreksi,
      koreksi: arr_koreksi_item
    }
    formData.append('id', this.data.id)
    formData.append('pemakaian_koreksi', str_pemakaian_koreksi)
    formData.append('sisa_koreksi', str_sisa_koreksi)
    formData.append('koreksi_item', JSON.stringify(arr_koreksi_item))
    formData.append('status', status)
    formData.append('type', '')
    this.confirmApprove(status, formData)
  }

  saveStatus(data) {
    this.presentLoadingWithOptions()
    this.perjalanDinasService.saveStatus(data).subscribe(res => {
      let resp: any = res
      this.loadingCtrl.dismiss()
      this.modalCtrl.dismiss({ reload: true })
    })
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.loading = await this.loadingCtrl.create(config_loading)
    return await this.loading.present()
  }

  async alertInfoItemBiaya(data, modal) {
    let jumlah_koreksi = 0
    if (data.jumlah_koreksi != null) jumlah_koreksi = data.jumlah_koreksi

    let harga_unit_koreksi = 0
    if (data.harga_unit_koreksi != null) harga_unit_koreksi = data.harga_unit_koreksi

    let harga_total_koreksi = 0
    if (data.harga_total_koreksi != null) harga_total_koreksi = data.harga_total_koreksi

    let helper = new Helper()
    let header = 'Koreksi Nominal Pemakaian'
    let message =
      'Item pemakaian ini telah dikoreksi dengan data sebagai berikut <br> Jumlah Awal : <span class="red-label">' +
      helper.convertToCustomNominal(data.jumlah) +
      '</span><br>Jumlah Koreksi: ' +
      helper.convertToCustomNominal(jumlah_koreksi) +
      '<br>Harga perunit awal : <span class="red-label">' +
      helper.convertToRupiah(data.harga_unit) +
      '</span><br> Harga Unit Koreksi: ' +
      helper.convertToRupiah(harga_unit_koreksi) +
      '<br> Harga Total Awal: <span class="red-label">' +
      helper.convertToRupiah(data.harga_total) +
      '</span><br> Harga Total Koreksi: ' +
      helper.convertToRupiah(harga_total_koreksi) +
      '<br> Alasan Koreksi :' +
      data.alasan_koreksi

    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: res => {}
        }
      ]
    })

    await alert.present()
    return await modal.present()
  }
}
