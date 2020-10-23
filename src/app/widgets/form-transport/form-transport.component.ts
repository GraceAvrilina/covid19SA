import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core'
import { IonicSelectableComponent } from 'ionic-selectable'
import { Subscription } from 'rxjs'
import { ModalUploadBymediaPage } from '../modal-upload-bymedia/modal-upload-bymedia.component'
import { ModalSelectActivityComponent } from '../modal-select-activity/modal-select-activity.component'
import { ModalSelectActivitynameComponent } from '../modal-select-activityname/modal-select-activityname.component'
import { ModalPrevImageComponent } from '../modal-prev-image/modal-prev-image.component'
import { ModalSearchLeaderComponent } from '../modal-search-leader/modal-search-leader.component'
import { ModalController } from '@ionic/angular'
import { TransportationService } from '../../api/transportation.service'
import { GlobalService } from '../../api/global.service'
import { Helper } from '../../helper'

import { ToastController } from '@ionic/angular'
import { AlertController, LoadingController } from '@ionic/angular'
import { Router, NavigationExtras } from '@angular/router'
import { StorageService } from '../../api/storage.service'

import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from 'ion2-calendar'
import imageCompression from 'browser-image-compression'

class Leader {
  public username: string
  public name: string
}

class Transport {
  constructor(
    public nomor_laporan: string = '',
    public aktivitas: any = {
      id: 0,
      name: '',
      is_specify_bendera: 0
    },
    public klien: string = '',
    public project: string = '',
    public bendera_aktivitas: string = '',
    public jenis_transport: string = '',
    public jenis_bayar: string = '',
    public payment_options: any = {},
    public kode_voucher: string = '',
    public nominal: string = '',
    public keterangan: string = '',
    public waktu_tiba: string = '',
    public waktu_berangkat: string = '',
    public ke: string = '',
    public dari: string = ''
  ) {}
}
@Component({
  selector: 'app-form-transport',
  templateUrl: './form-transport.component.html',
  styleUrls: ['./form-transport.component.scss']
})
export class FormTransportComponent implements OnChanges {
  leaders: Leader[]
  leader = { username: '', name: '' }
  transport = new Transport()
  subscription: Subscription
  list_img: any = []
  list_file: any = []
  img_idx
  type_transport_name: string = ''
  public eventFile: any
  loading: any
  placeholder_keterangan: string = ''
  minDate_report: string = ''
  config_min_date: string = ''
  payment_options: any = []
  public list_voucher: any = []
  @Input() typeTransport: any
  @Input() listBendera: any = []
  @Input() oldData: any = []
  @Input() type: string = ''
  @Output()
  reload: EventEmitter<string> = new EventEmitter()
  public info_form: string = localStorage.getItem('info_transportasi')
  constructor(
    public modalController: ModalController,
    private transportService: TransportationService,
    private globalService: GlobalService,
    private storageService: StorageService,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {
    let d = new Date()
    let helper = new Helper()
    this.config_min_date = localStorage.getItem('backdate_transportasi')
    let config_min_date: number = parseInt(localStorage.getItem('backdate_transportasi'))
    config_min_date = config_min_date * -1
    let fulldate = helper.convertMinDateCustom(d, config_min_date)
    this.minDate_report = fulldate.substr(0, 10)
    this.transport.payment_options.voucher_enabled = false
  }

  ngOnChanges() {
    if (this.oldData.length != 0) {
      let helper = new Helper()
      if (this.type == 'sent') {
        this.transport.nomor_laporan = this.oldData.nomor_laporan
        this.transport.klien = this.oldData.klien

        if (this.oldData.id_bendera.id != '') {
          this.transport.aktivitas.is_specify_bendera = this.oldData.id_bendera.is_specify_bendera
          this.transport.bendera_aktivitas = this.oldData.id_bendera.id
        }
        this.transport.project = this.oldData.proyek

        this.transport.aktivitas.id = this.oldData.id_jenis_activity.id
        this.transport.aktivitas.name = this.oldData.id_jenis_activity.name

        this.leader.username = this.oldData.pemberi_tugas.user_name
        let last_name = this.oldData.pemberi_tugas.last_name != null ? this.oldData.pemberi_tugas.last_name : ''
        this.leader.name = this.oldData.pemberi_tugas.first_name + last_name

        this.transport.jenis_transport = this.oldData.id_jenis.id

        this.onChangeType(this.transport.jenis_transport)

        this.transport.jenis_bayar = this.oldData.jenis_bayar.value
        this.changeJenisBayar(this.transport.jenis_bayar)

        this.transport.kode_voucher = this.oldData.kode_voucher
        this.transport.nominal = this.oldData.nominal
        this.transport.dari = this.oldData.asal
        this.transport.ke = this.oldData.tujuan

        this.oldData.waktu_mulai = this.oldData.waktu_mulai.substr(0, 19)
        this.oldData.waktu_berakhir = this.oldData.waktu_berakhir.substr(0, 19)

        this.transport.waktu_berangkat = this.oldData.waktu_mulai
        this.transport.waktu_tiba = this.oldData.waktu_berakhir
        this.transport.keterangan = this.oldData.keterangan

        this.list_img = this.oldData.photo
      } else if (this.type == 'additem') {
        this.transport = new Transport()
        // this.transport.project = this.oldData.proyek
        this.transport.klien = this.oldData.klien

        this.transport.aktivitas.is_specify_bendera = this.oldData.id_jenis_activity.is_specify_bendera
        if (this.oldData.id_bendera.id != undefined) {
          this.transport.bendera_aktivitas = this.oldData.id_bendera.id
        } else {
          this.transport.bendera_aktivitas = this.oldData.id_bendera
        }

        this.transport.aktivitas.id = this.oldData.id_jenis_activity.id
        this.transport.aktivitas.name = this.oldData.id_jenis_activity.name

        if (this.oldData.pemberi_tugas.user_name != undefined) {
          this.leader.username = this.oldData.pemberi_tugas.user_name
          let last_name = this.oldData.pemberi_tugas.last_name != null ? this.oldData.pemberi_tugas.last_name : ''
          this.leader.name = this.oldData.pemberi_tugas.first_name + last_name
        } else {
          this.leader.username = this.oldData.pemberi_tugas
          this.leader.name = this.oldData.leader_name
        }

        this.list_img = []
        this.list_file = []
      } else if (this.type == 'draft') {
        this.transport.klien = this.oldData.klien
        this.transport.project = this.oldData.proyek

        this.transport.aktivitas.id = this.oldData.id_jenis_activity.id
        this.transport.aktivitas.name = this.oldData.id_jenis_activity.name

        this.transport.aktivitas.is_specify_bendera = this.oldData.id_jenis_activity.is_specify_bendera
        this.transport.bendera_aktivitas = this.oldData.id_bendera
        this.leader.username = this.oldData.pemberi_tugas
        this.leader.name = this.oldData.leader_name
        this.transport.jenis_transport = this.oldData.id_jenis
        this.onChangeType(this.transport.jenis_transport)
        this.transport.jenis_bayar = this.oldData.jenis_bayar
        this.changeJenisBayar(this.transport.jenis_bayar)
        this.transport.kode_voucher = this.oldData.kode_voucher
        this.transport.nominal = this.oldData.nominal
        this.transport.dari = this.oldData.asal
        this.transport.ke = this.oldData.tujuan

        let waktu_berangkat = this.oldData.waktu_mulai
        let waktu_tiba = this.oldData.waktu_berakhir
        this.transport.waktu_berangkat = waktu_berangkat
        this.transport.waktu_tiba = waktu_tiba
        this.transport.keterangan = this.oldData.keterangan

        /* for preview img */
        this.list_img = this.oldData.media
        /* convert url img to file */
        this.list_file = []
        this.list_img.forEach((v, i) => {
          let file_blob = helper.dataURItoBlob(v)
          this.list_file.push(file_blob)
        })
      }
    }
  }

  searchLeader(event: { component: IonicSelectableComponent; text: string }) {
    let text = event.text.trim().toLowerCase()
    event.component.startSearch()

    // Close any running subscription.
    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    if (!text) {
      // Close any running subscription.
      if (this.subscription) {
        this.subscription.unsubscribe()
      }

      event.component.items = []
      event.component.endSearch()
      return
    }
    this.leaders = []
    let params = {
      first_name: text,
      startPage: 0,
      endPage: 10
    }
    this.subscription = this.globalService.getListLeader(params).subscribe(res => {
      if (this.subscription.closed) {
        return
      }

      let response: any = res
      if (response.status)
        response.data.forEach(v => {
          if (v.last_name == null) {
            v.last_name = ''
          }

          let obj = {
            username: v.user_name,
            name: v.first_name + v.last_name
          }
          this.leaders.push(obj)
        })

      event.component.items = this.filterLeader(this.leaders, text)
      event.component.endSearch()
    })
  }

  filterLeader(leaders: Leader[], text: string) {
    return leaders.filter(leader => {
      return leader.name.toLowerCase().indexOf(text) !== -1
    })
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalUploadBymediaPage
    })

    modal.onDidDismiss().then(res => {
      console.log(res)
      alert(JSON.stringify(res))
      let event: any = res.data
      if (event != undefined) {
        this.compressImg(event)
      }
    })

    return await modal.present()
  }

  uploadImgFile(event) {
    this.loadingController.dismiss()
    let helper = new Helper()
    let file = helper.blobToFile(event, event.name)
    // let t_files = event.target.files
    // if (event.target.files && event.target.files[0]) {
    //   let reader = new FileReader()
    //   reader.onload = event => {
    //     this.eventFile = event
    //     let local_file = this.eventFile.target.result

    //     /* preview img */
    //     let img_src = local_file
    //     this.list_img.push(img_src)
    //     /* img file for save file to db */
    //     let file_img = t_files
    //     this.list_file.push(file_img)
    //   }
    //   reader.readAsDataURL(t_files[0])
    // }

    if (file) {
      let reader = new FileReader()
      // reader.onload = event => {
      //   this.eventFile = event
      //   let local_file = this.eventFile.target.result

      //   /* preview img */
      //   let img_src = local_file
      //   this.list_img.push(img_src)
      //   /* img file for save file to db */
      //   let file_img = t_files
      //   this.list_file.push(file_img)
      // }
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        var base64data = reader.result

        this.list_img.push(base64data)
        this.list_file.push(file)

        console.log(base64data)
      }
    }
  }
  selectImg(idx) {
    if (this.img_idx == idx) {
      this.img_idx = -1
      return false
    }
    this.img_idx = idx
  }
  removeImg(idx) {
    this.list_img.splice(idx, 1)
    this.list_file.splice(idx, 1)
  }
  onSubmit(data) {
    this.saveData(data, 'sent')
  }

  onUpdateDraft(data) {
    this.saveData(data, 'update_draft')
  }

  onSaveToDraft(data) {
    this.saveData(data, 'draft')
  }

  saveData(data, type) {
    let helper = new Helper()
    let now = new Date()
    let timenow = helper.convertDateCustom(now)

    let params: any = {
      id: helper.uuidv4(),
      created_by: localStorage.getItem('username'),
      proyek: data.project,
      id_jenis_activity: data.activity_id,
      id_bendera: data.bendera_aktivitas,
      klien: data.klien,
      id_jenis: data.jenis_transport,
      jenis_bayar: data.jenis_bayar,
      kode_voucher: data.kode_voucher,
      nominal: data.nominal,
      keterangan: data.keterangan,
      asal: data.dari,
      tujuan: data.ke,
      status: 'waiting'
    }

    if (data.project == '') {
      this.presentToast('silahkan pilih aktivitas')
      return false
    }

    if (data.activity_id == 0 || data.activity_id == '') {
      this.presentToast('silahkan isi jenis aktivitas')
      return false
    }
    if (data.klien == '') {
      this.presentToast('silahkan isi nama klien')
      return false
    }

    if (this.leader.name == undefined || this.leader.name == '') {
      this.presentToast('silahkan isi pemberi tugas')
      return false
    }

    if (data.jenis_transport == '') {
      this.presentToast('silahkan pilih salah satu jenis transport')
      return false
    }

    if (data.jenis_bayar == '') {
      this.presentToast('silahkan pilih salah satu jenis bayar')
      return false
    }

    if (this.transport.payment_options.voucher_enabled) {
      if (params.kode_voucher == '' || params.kode_voucher == undefined) {
        this.presentToast('silahkan pilih kode voucher')
        return false
      }
    }

    if (data.nominal == '') {
      this.presentToast('silahkan isi nominal')
      return false
    } else {
      data.nominal = data.nominal.toString()
      data.nominal = parseInt(data.nominal.split('.').join(''))
      params.nominal = data.nominal
      var isnum = /^\d+$/.test(data.nominal)
      if (!isnum) {
        this.presentToast('format tidak sesuai')
        return false
      }
    }

    if (data.dari == '' || data.ke == '') {
      this.presentToast('tempat asal / tempat tujuan tidak boleh kosong')
      return false
    }

    if (data.waktu_berangkat == '' || data.waktu_tiba == '') {
      this.presentToast('silahkan isi waktu berangkat & waktu tiba')
      return false
    } else {
      let waktu_berangkat = new Date(data.waktu_berangkat)
      let waktu_tiba = new Date(data.waktu_tiba)

      if (waktu_tiba < waktu_berangkat) {
        this.presentToast('waktu tiba tidak boleh kurang dari waktu berangkat')
        return false
      }
    }

    if (this.list_file.length == 0) {
      this.presentToast('silahkan isi min 1 foto')
      return false
    }

    if (data.waktu_berangkat != '' && data.waktu_tiba != '') {
      if (type == 'sent') {
        let waktu_berangkat = new Date(data.waktu_berangkat)
        let string_waktu_berangkat = helper.convertDateCustom(waktu_berangkat)

        let waktu_tiba = new Date(data.waktu_tiba)
        let string_waktu_tiba = helper.convertDateCustom(waktu_tiba)

        params.waktu_mulai = string_waktu_berangkat
        params.waktu_berakhir = string_waktu_tiba
      } else {
        let waktu_berangkat = new Date(data.waktu_berangkat)
        params.waktu_mulai = waktu_berangkat
        let waktu_tiba = new Date(data.waktu_tiba)
        params.waktu_berakhir = waktu_tiba
      }
    }

    ;(params.pemberi_tugas = this.leader.username), (params.waktu_buat = timenow)
    params.waktu_update = timenow

    if (type == 'draft') {
      /* save to local */

      let obj = []
      let d = new Date()
      let postData: any = params
      postData.id = d.getTime()
      postData.media = this.list_img
      postData.leader_name = this.leader.name
      postData.id_jenis_activity = this.transport.aktivitas
      this.storageService.getDraft('transport_draft', v => {
        if (v != undefined) {
          v.forEach(element => {
            obj.push(element)
          })
        }

        if (this.type_transport_name != '') postData.type_transport_name = this.type_transport_name
        obj.push(postData)
        this.storageService.saveDraft('transport_draft', obj, () => {
          this.presentToast('simpan berhasil')
          this.clearForm()
          this.reload.emit()
          if (this.type == 'additem') this.directToHomeMenu(true)
        })
      })
    } else if (type == 'update_draft') {
      let obj = []
      let postData: any = params

      postData.id = this.oldData.id
      postData.media = this.list_img
      postData.id_jenis_activity = this.transport.aktivitas
      postData.leader_name = this.leader.name
      postData.type_transport_name = this.oldData.type_transport_name
      if (this.type_transport_name != '') postData.type_transport_name = this.type_transport_name
      postData.waktu_buat = this.oldData.waktu_buat

      this.storageService.getDraft('transport_draft', v => {
        if (v != undefined) {
          v.forEach(element => {
            if (element.id == postData.id) {
              element = postData
            }
            obj.push(element)
          })
        }

        this.storageService.saveDraft('transport_draft', obj, () => {
          this.presentToast('simpan berhasil')
          this.directToHomeMenu(true)
        })
      })
    } else if (type == 'sent') {
      let formData: FormData = new FormData()
      let i = 0

      while (i < Object.keys(params).length) {
        let keys = Object.keys(params)[i]
        let value = params[keys]
        if (value != null) {
          formData.append(keys, value)
        }
        i++
      }

      this.list_file.forEach(files => {
        if (files != undefined) {
          let fileList: FileList = files
          if (fileList.length > 0) {
            let file: File = fileList[0]
            formData.append('photo[]', file, file.name)
          } else {
            formData.append('photo[]', files)
          }
        }
      })

      this.presentLoadingWithOptions()
      this.transportService.saveDataTransport(formData).subscribe(
        res => {
          this.loadingController.dismiss()
          let resp: any = res
          if (resp.status) {
            this.presentToast('Data berhasil disimpan')
            if (this.oldData.id != undefined) {
              this.deleteDataDraft(false)
            }
            this.confirmNextTransaction()
          } else {
            this.presentToast(resp.message)
          }
        },
        err => {
          this.loading.dismiss()
          this.presentToast('Error')
        }
      )
    }
  }

  deleteDataDraft(direct) {
    let obj = []
    this.storageService.getDraft('transport_draft', v => {
      if (v != undefined) {
        v.forEach(element => {
          if (element.id != this.oldData.id) {
            obj.push(element)
          }
        })
      }
      this.storageService.saveDraft('transport_draft', obj, () => {
        if (direct) {
          this.presentToast('draft berhasil dihapus')
          this.directToHomeMenu(true)
        }
      })
    })
  }
  async deleteDraft() {
    const alert = await this.alertCtrl.create({
      header: 'Hapus Draft',
      message: 'Apakah anda yakin akan menghapus draft ini ?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            this.type = 'draft'
          }
        },
        {
          text: 'Ya',
          handler: () => {
            let res = this.deleteDataDraft(true)
          }
        }
      ]
    })

    await alert.present()
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    })
    toast.present()
  }

  searchArr(id, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].id == id) {
        return myArray[i]
      }
    }
  }

  searchArrCustom(key, value, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      let arr = myArray[i]
      if (arr[key] == value) {
        return arr
      }
    }
  }

  onChangeType(id) {
    let type = this.searchArr(id, this.typeTransport)

    this.transport.kode_voucher = ''
    this.list_voucher = []
    this.payment_options = []
    if (type != undefined) {
      this.placeholder_keterangan = type.placeholder
      this.type_transport_name = type.name
      this.payment_options = type.payment_options
      if (type.name == 'Taksi') {
        this.list_voucher = []
      }
    }
  }

  changeJenisBayar(value) {
    let jenis_bayar = this.searchArrCustom('value', value, this.payment_options)
    this.transport.payment_options = jenis_bayar
    this.list_voucher = []
    if (this.transport.payment_options != undefined) {
      this.transport.kode_voucher = ''

      if (this.transport.payment_options.voucher_enabled) {
        /* get list voucher from be */
        let params = {
          jenis_transport: this.transport.jenis_transport,
          username: localStorage.getItem('username'),
          jenis_pembayaran: this.transport.jenis_bayar
        }
        this.transportService.getListVoucher(params).subscribe(res => {
          let resp: any = res
          if (resp.status) {
            this.list_voucher = resp.data
          }
        })
      }
    }
  }

  directToHomeMenu(reload) {
    this.setFormForNewTransaction()
    setTimeout(() => {
      let navigationExtras: NavigationExtras = {
        state: {
          reload: reload
        }
      }
      this.router.navigate(['home/transportation'], navigationExtras)
    }, 1000)
  }

  clearForm() {
    this.transport.project = ''
    this.transport.klien = ''
    this.leader.username = ''
    this.leader.name = ''
    this.reload.emit()
    this.setFormForNewTransaction()
  }

  setFormForNewTransaction() {
    ;(this.transport.jenis_transport = ''),
      (this.transport.jenis_bayar = 'voucher'),
      (this.transport.kode_voucher = ''),
      (this.transport.nominal = ''),
      (this.transport.keterangan = ''),
      (this.transport.waktu_tiba = ''),
      (this.transport.waktu_berangkat = '')
    this.transport.ke = ''
    this.transport.dari = ''
    this.placeholder_keterangan = ''
    this.list_img = []
    this.list_file = []
    this.img_idx = -1
  }

  async confirmNextTransaction() {
    const alert = await this.alertCtrl.create({
      header: 'Buat Laporan Baru',
      message:
        'Apakah anda ingin membuat laporan transportasi dengan jenis bendera aktivitas dan nama klien yang sama?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            this.clearForm()
            this.directToHomeMenu(true)
          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.setFormForNewTransaction()
          }
        }
      ]
    })

    await alert.present()
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.loading = await this.loadingController.create(config_loading)
    return await this.loading.present()
  }

  async searchActivityName() {
    const modal = await this.modalController.create({
      component: ModalSelectActivitynameComponent,
      componentProps: { type: 'transportasi' }
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.transport.project = res.data.proyek
      }
    })
    return await modal.present()
  }

  async searchTypeActivity() {
    const modal = await this.modalController.create({
      component: ModalSelectActivityComponent
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.transport.aktivitas = res.data

        if (this.transport.aktivitas.is_specify_bendera == 0) {
          this.transport.bendera_aktivitas = ''
        }
      }
    })
    return await modal.present()
  }

  async showModalLeader() {
    const modal = await this.modalController.create({
      component: ModalSearchLeaderComponent
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.leader.username = res.data.user_name
        this.leader.name = res.data.first_name
      }
    })
    return await modal.present()
  }

  changeFormatNominal(value) {
    if (value != '') {
      var isNotNum = /^[a-zA-Z]+$/.test(value)
      if (isNotNum) {
        this.transport.nominal = ''
        return false
      }

      let helper = new Helper()
      if (value.indexOf('.') !== -1) {
        value = value.split('.').join('')
      }
      value = helper.tandaPemisahTitik(parseInt(value))
      this.transport.nominal = value
    }
  }
  async prevImage() {
    const modal = await this.modalController.create({
      component: ModalPrevImageComponent,
      componentProps: { list_img: this.list_img }
    })
    return await modal.present()
  }

  async compressImg(event) {
    //this.presentLoadingWithOptions()
    const imageFile = event.target.files[0]
    console.log('originalFile instanceof Blob', imageFile instanceof Blob) // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)
    alert(JSON.stringify(event));
    var options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    try {
      const compressedFile = await imageCompression(imageFile, options)
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob) // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`) // smaller than maxSizeMB

      return await this.uploadImgFile(compressedFile) // write your own logic
    } catch (error) {
      console.log(error)
    }
  }
}
