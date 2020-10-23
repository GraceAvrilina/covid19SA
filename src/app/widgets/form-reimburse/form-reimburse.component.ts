import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core'
import { IonicSelectableComponent } from 'ionic-selectable'
import { Subscription } from 'rxjs'
import { ModalUploadBymediaPage } from '../modal-upload-bymedia/modal-upload-bymedia.component'
import { ModalSelectActivityComponent } from '../modal-select-activity/modal-select-activity.component'
import { ModalSelectActivitynameComponent } from '../modal-select-activityname/modal-select-activityname.component'
import { ModalPrevImageComponent } from '../modal-prev-image/modal-prev-image.component'
import { ModalSearchLeaderComponent } from '../modal-search-leader/modal-search-leader.component'
import { ModalController } from '@ionic/angular'
import { ReimburseService } from '../../api/reimburse.service'
import { GlobalService } from '../../api/global.service'
import { Helper } from '../../helper'
import { ToastController, AlertController, LoadingController } from '@ionic/angular'
import { Router, NavigationExtras } from '@angular/router'
import { StorageService } from '../../api/storage.service'

class Leader {
  public username: string
  public name: string
}
class Reimburse {
  constructor(
    public nomor_laporan: string = '',
    public aktivitas: any = {
      id: 0,
      name: '',
      is_specify_bendera: 0
    },
    public klien: string = '',
    public bendera_aktivitas: string = '',
    public project: string = '',
    public jenis_reimburse: string = '',
    public nominal: string = '',
    public keterangan: string = '',
    public tgl_kejadian: string = '',
    public pemberi_tugas: string = ''
  ) {}
}
@Component({
  selector: 'app-form-reimburse',
  templateUrl: './form-reimburse.component.html',
  styleUrls: ['./form-reimburse.component.scss']
})
export class FormReimburseComponent implements OnChanges {
  leaders: Leader[]
  leader = { username: '', name: '' }
  reimburse = new Reimburse()
  subscription: Subscription
  list_img: any = []
  list_file: any = []
  img_idx
  type_reimburse_name: string = ''
  public eventFile: any
  loading: any
  @Input() typeReimburse: any
  @Input() listBendera: any = []
  @Input() oldData: any = []
  @Input() type: string = ''
  @Output()
  reload: EventEmitter<string> = new EventEmitter()
  placeholder_keterangan: string = ''
  minDate_report: string = ''
  config_min_date: string = ''
  public info_form: string = localStorage.getItem('info_reimburse')
  constructor(
    public modalController: ModalController,
    private reimburseService: ReimburseService,
    private globalService: GlobalService,
    private storageService: StorageService,
    public toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    public alertCtrl: AlertController
  ) {
    let d = new Date()
    let helper = new Helper()
    this.config_min_date = localStorage.getItem('backdate_reimburse')
    let config_min_date: number = parseInt(localStorage.getItem('backdate_reimburse'))
    config_min_date = config_min_date * -1
    let fulldate = helper.convertMinDateCustom(d, config_min_date)
    this.minDate_report = fulldate.substr(0, 10)
  }

  ngOnChanges() {
    if (this.oldData.length != 0) {
      let helper = new Helper()
      if (this.type == 'sent') {
        this.reimburse.nomor_laporan = this.oldData.nomor_laporan
        this.reimburse.klien = this.oldData.klien
        if (this.oldData.id_bendera.id != '') {
          this.reimburse.aktivitas.is_specify_bendera = this.oldData.id_bendera.is_specify_bendera
          this.reimburse.bendera_aktivitas = this.oldData.id_bendera.id
        }

        this.reimburse.project = this.oldData.proyek

        this.reimburse.aktivitas.id = this.oldData.id_jenis_activity.id
        this.reimburse.aktivitas.name = this.oldData.id_jenis_activity.name

        this.leader.username = this.oldData.pemberi_tugas.user_name
        let last_name = this.oldData.pemberi_tugas.last_name != null ? this.oldData.pemberi_tugas.last_name : ''
        this.leader.name = this.oldData.pemberi_tugas.first_name + last_name
        this.reimburse.jenis_reimburse = this.oldData.id_jenis.id
        this.reimburse.nominal = this.oldData.nominal

        this.oldData.waktu_kejadian = this.oldData.waktu_kejadian.substr(0, 19)
        this.reimburse.tgl_kejadian = this.oldData.waktu_kejadian

        this.reimburse.keterangan = this.oldData.keterangan
        this.list_img = this.oldData.photo
      } else if (this.type == 'draft') {
        this.reimburse.klien = this.oldData.klien
        this.reimburse.project = this.oldData.proyek

        this.reimburse.aktivitas.id = this.oldData.id_jenis_activity.id
        this.reimburse.aktivitas.name = this.oldData.id_jenis_activity.name

        this.reimburse.aktivitas.is_specify_bendera = this.oldData.id_jenis_activity.is_specify_bendera
        this.reimburse.bendera_aktivitas = this.oldData.id_bendera

        this.leader.username = this.oldData.pemberi_tugas
        this.leader.name = this.oldData.leader_name

        this.reimburse.jenis_reimburse = this.oldData.id_jenis
        this.type_reimburse_name = this.oldData.type_reimburse_name
        this.reimburse.nominal = this.oldData.nominal

        let timedate = this.oldData.waktu_kejadian

        this.reimburse.tgl_kejadian = timedate
        this.reimburse.keterangan = this.oldData.keterangan

        /* for preview img */
        this.list_img = this.oldData.media
        /* convert url img to file */
        this.list_file = []
        this.list_img.forEach((v, i) => {
          let file_blob = helper.dataURItoBlob(v)
          this.list_file.push(file_blob)
        })
      } else if ((this.type = 'additem')) {
        this.reimburse = new Reimburse()
        this.reimburse.klien = this.oldData.klien
        // this.reimburse.project = this.oldData.proyek

        this.reimburse.aktivitas.id = this.oldData.id_jenis_activity.id
        this.reimburse.aktivitas.name = this.oldData.id_jenis_activity.name

        this.reimburse.aktivitas.is_specify_bendera = this.oldData.id_jenis_activity.is_specify_bendera
        if (this.oldData.id_bendera.id != undefined) {
          this.reimburse.bendera_aktivitas = this.oldData.id_bendera.id
        } else {
          this.reimburse.bendera_aktivitas = this.oldData.id_bendera
        }

        if (this.oldData.pemberi_tugas.user_name != undefined) {
          this.leader.username = this.oldData.pemberi_tugas.user_name
          let last_name = this.oldData.pemberi_tugas.last_name != null ? this.oldData.pemberi_tugas.last_name : ''
          this.leader.name = this.oldData.pemberi_tugas.first_name + last_name
        } else {
          this.leader.username = this.oldData.pemberi_tugas
          this.leader.name = this.oldData.leader_name
        }

        this.oldData.waktu_kejadian = this.oldData.waktu_kejadian.substr(0, 19)
        this.reimburse.tgl_kejadian = this.oldData.waktu_kejadian

        this.list_img = []
        this.list_file = []
      }
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalUploadBymediaPage
    })

    modal.onDidDismiss().then(res => {
      let event: any = res.data
      if (event != undefined) {
        let t_files = event.target.files
        if (event.target.files && event.target.files[0]) {
          let reader = new FileReader()
          reader.onload = event => {
            this.eventFile = event
            let local_file = this.eventFile.target.result

            /* preview img */
            let img_src = local_file
            this.list_img.push(img_src)
            /* img file for save file to db */
            let file_img = t_files
            this.list_file.push(file_img)
          }
          reader.readAsDataURL(t_files[0])
        }
      }
    })

    return await modal.present()
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

  onChangeType(id) {
    let type = this.searchArr(id, this.typeReimburse)
    if (type != undefined) {
      this.placeholder_keterangan = type.placeholder
      this.type_reimburse_name = type.name
    }
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

    /* validasi */
    let valid = this.validateForm(data)
    if (valid == false) {
      return false
    }

    let params: any = {
      id: helper.uuidv4(),
      created_by: localStorage.getItem('username'),
      proyek: data.project,
      id_jenis_activity: data.activity_id,
      id_bendera: data.bendera_aktivitas,
      klien: data.klien,
      id_jenis: data.jenis_reimburse,
      nominal: data.nominal,
      keterangan: data.keterangan,
      status: 'waiting'
    }

    data.nominal = data.nominal.toString()
    data.nominal = parseInt(data.nominal.split('.').join(''))
    params.nominal = data.nominal
    var isnum = /^\d+$/.test(data.nominal)
    if (!isnum) {
      this.presentToast('format tidak sesuai')
      return false
    }

    params.pemberi_tugas = this.leader.username

    if (data.tgl_kejadian != '') {
      let waktu_kejadian = new Date(data.tgl_kejadian)
      params.waktu_kejadian = waktu_kejadian

      if (type == 'sent') {
        let string_waktu_kejadian = helper.convertDateCustom(waktu_kejadian)
        params.waktu_kejadian = string_waktu_kejadian
      }
    }

    params.waktu_buat = timenow
    params.waktu_update = timenow

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

    if (type == 'sent') {
      this.presentLoadingWithOptions()
      this.reimburseService.saveReimburse(formData).subscribe(res => {
        this.loadingController.dismiss()
        let resp: any = res
        if (resp.status) {
          /* delete from draft */
          if (this.oldData.id != undefined) {
            this.deleteDataDraft(false)
          }
          this.presentToast('Data berhasil disimpan')
          this.confirmNextTransaction()
        } else {
          this.presentToast(resp.message)
        }
      })
    } else if (type == 'draft') {
      let obj = []
      let d = new Date()
      let postData: any = params
      postData.id = d.getTime()
      postData.media = this.list_img
      postData.leader_name = this.leader.name
      postData.id_jenis_activity = this.reimburse.aktivitas
      this.storageService.getDraft('reimburse_draft', v => {
        if (v != undefined) {
          v.forEach(element => {
            obj.push(element)
          })
        }

        if (this.type_reimburse_name != '') postData.type_reimburse_name = this.type_reimburse_name
        obj.push(postData)
        this.storageService.saveDraft('reimburse_draft', obj, () => {
          this.presentToast('simpan berhasil')
          this.clearForm()
          this.reload.emit()
        })
      })
    } else if (type == 'update_draft') {
      let obj = []
      let postData: any = params

      postData.id = this.oldData.id
      postData.media = this.list_img
      postData.id_jenis_activity = this.reimburse.aktivitas
      postData.leader_name = this.leader.name
      postData.type_reimburse_name = this.type_reimburse_name

      postData.type_reimburse_name = this.oldData.type_reimburse_name
      if (this.type_reimburse_name != '') postData.type_reimburse_name = this.type_reimburse_name

      postData.waktu_buat = this.oldData.waktu_buat

      this.storageService.getDraft('reimburse_draft', v => {
        if (v != undefined) {
          v.forEach(element => {
            if (element.id == postData.id) {
              element = postData
            }
            obj.push(element)
          })
        }

        this.storageService.saveDraft('reimburse_draft', obj, () => {
          this.presentToast('simpan berhasil')
          this.directToHomeMenu(true)
        })
      })
    }
  }
  deleteDataDraft(direct) {
    let obj = []
    this.storageService.getDraft('reimburse_draft', v => {
      if (v != undefined) {
        v.forEach(element => {
          if (element.id != this.oldData.id) {
            obj.push(element)
          }
        })
      }
      this.storageService.saveDraft('reimburse_draft', obj, () => {
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

  searchArr(id, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].id == id) {
        return myArray[i]
      }
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    })
    toast.present()
  }

  validateForm(data) {
    if (data.project == '') {
      this.presentToast('silahkan isi nama proyek')
      return false
    }

    if (data.activity_id == '') {
      this.presentToast('silahkan pilih jenis aktivitas')
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

    if (data.jenis_reimburse == '') {
      this.presentToast('silahkan pilih jenis reimburse')
      return false
    }

    if (data.nominal == '') {
      this.presentToast('silahkan isi nominal')
      return false
    }

    if (data.tgl_kejadian == '') {
      this.presentToast('silahkan isi waktu kejadian')
      return false
    }

    if (data.keterangan == '') {
      this.presentToast('silahkan isi keterangan')
      return false
    }

    if (this.list_file.length == 0) {
      this.presentToast('silahkan isi min 1 foto')
      return false
    }
    return true
  }

  async confirmNextTransaction() {
    const alert = await this.alertCtrl.create({
      header: 'Buat Laporan Baru',
      message: 'Apakah anda ingin membuat laporan reimburse dengan jenis bendera aktivitas dan nama klien yang sama?',
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
            this.type = 'additem'
            this.setFormForNewTransaction()
          }
        }
      ]
    })

    await alert.present()
  }

  directToHomeMenu(reload) {
    this.setFormForNewTransaction()
    setTimeout(() => {
      let navigationExtras: NavigationExtras = {
        state: {
          reload: reload
        }
      }
      this.router.navigate(['home/reimburse'], navigationExtras)
    }, 1000)
  }

  clearForm() {
    this.reimburse.project = ''
    this.reimburse.klien = ''
    this.leader.username = ''
    this.leader.name = ''
    this.reload.emit()
    this.setFormForNewTransaction()
  }

  setFormForNewTransaction() {
    this.reimburse.jenis_reimburse = ''
    this.reimburse.nominal = ''
    this.reimburse.tgl_kejadian = ''
    this.reimburse.keterangan = ''
    this.placeholder_keterangan = ''
    this.list_img = []
    this.list_file = []
    this.img_idx = -1
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.loading = await this.loadingController.create(config_loading)
    return await this.loading.present()
  }

  async searchTypeActivity() {
    const modal = await this.modalController.create({
      component: ModalSelectActivityComponent
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.reimburse.aktivitas = res.data
        if (this.reimburse.aktivitas.is_specify_bendera == 0) {
          this.reimburse.bendera_aktivitas = ''
        }
      }
    })
    return await modal.present()
  }

  async searchActivityName() {
    const modal = await this.modalController.create({
      component: ModalSelectActivitynameComponent,
      componentProps: { type: 'reimburse' }
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.reimburse.project = res.data.proyek
      }
    })
    return await modal.present()
  }

  changeFormatNominal(value) {
    if (value != '') {
      var isNotNum = /^[a-zA-Z]+$/.test(value)
      if (isNotNum) {
        this.reimburse.nominal = ''
        return false
      }

      let helper = new Helper()
      if (value.indexOf('.') !== -1) {
        value = value.split('.').join('')
      }
      value = helper.tandaPemisahTitik(parseInt(value))
      this.reimburse.nominal = value
    }
  }

  async prevImage() {
    const modal = await this.modalController.create({
      component: ModalPrevImageComponent,
      componentProps: { list_img: this.list_img }
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
}
