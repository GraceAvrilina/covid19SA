import { Component, OnInit, Input } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { Helper } from './../../../helper'
import { ModalSelectUnitComponent } from '../../modal-select-unit/modal-select-unit.component'
import { ModalPrevImageComponent } from '../../modal-prev-image/modal-prev-image.component'
@Component({
  selector: 'app-modal-correction',
  templateUrl: './modal-correction.component.html',
  styleUrls: ['./modal-correction.component.scss']
})
export class ModalCorrectionComponent implements OnInit {
  @Input() data: any = []
  public res: any
  constructor(private modalCtrl: ModalController) {
    this.res = {
      alasan_koreksi: '',
      harga_unit: '',
      unit: '',
      jumlah: '',
      harga_total: ''
    }
  }

  ngOnInit() {
    console.log(this.data)
    let helper = new Helper()

    this.res.jumlah = this.data.jumlah
    if (this.data.jumlah_koreksi != null) this.res.jumlah = this.data.jumlah_koreksi

    this.res.harga_total = helper.tandaPemisahTitik(this.data.harga_total)
    if (this.data.harga_total_koreksi != null)
      this.res.harga_total = helper.tandaPemisahTitik(this.data.harga_total_koreksi)

    this.res.harga_unit = this.data.harga_unit
    if (this.data.harga_unit_koreksi != null) this.res.harga_unit = this.data.harga_unit_koreksi

    this.res.unit = this.data.unit
    if (this.data.unit_koreksi != null) this.res.unit = this.data.unit_koreksi

    if (this.data.alasan_koreksi != null) this.res.alasan_koreksi = this.data.alasan_koreksi
    this.calculate()
  }

  save() {
    if (this.res.alasan_koreksi != '') this.data.alasan_koreksi = this.res.alasan_koreksi
    if (this.res.unit != '') this.data.unit_koreksi = this.res.unit
    if (this.res.harga_unit != '') this.data.harga_unit_koreksi = this.convertNumber(this.res.harga_unit)
    if (this.res.jumlah != '') this.data.jumlah_koreksi = this.convertNumber(this.res.jumlah)
    if (this.res.harga_total != '') this.data.harga_total_koreksi = this.convertNumber(this.res.harga_total)
    this.modalCtrl.dismiss(this.data)
  }

  cancel() {
    this.modalCtrl.dismiss()
  }

  calculate() {
    let helper = new Helper()
    let jumlah = 0
    let harga_unit = 0
    let total_harga = 0

    if (this.res.jumlah != '')
      jumlah = parseInt(
        this.res.jumlah
        // .toString()
        // .split('.')
        // .join('')
      )

    if (this.res.harga_unit != '')
      harga_unit = parseInt(
        this.res.harga_unit
        // .toString()
        // .split('.')
        // .join('')
      )

    total_harga = harga_unit * jumlah
    this.res.harga_total = helper.tandaPemisahTitik(total_harga)
  }

  changeFormatNominal(value, key) {
    // if (value != '') {
    //   var isNotNum = /^[a-zA-Z]+$/.test(value)
    //   if (isNotNum) {
    //     this.res[key] = ''
    //     return false
    //   }

    //   let helper = new Helper()
    //   if (value.indexOf('.') !== -1) {
    //     value = value.split('.').join('')
    //   }
    //   value = helper.tandaPemisahTitik(parseInt(value))
    //   this.res[key] = value
    // }
    this.calculate()
  }

  convertNumber(str) {
    let res = parseInt(
      str
        .toString()
        .split('.')
        .join('')
    )
    return res
  }

  async selectUnit() {
    const modal = await this.modalCtrl.create({
      component: ModalSelectUnitComponent
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.res.unit = res.data.unit
      }
    })
    return await modal.present()
  }

  async prevImage() {
    const modal = await this.modalCtrl.create({
      component: ModalPrevImageComponent,
      componentProps: { list_img: this.data.photo }
    })
    return await modal.present()
  }
}
