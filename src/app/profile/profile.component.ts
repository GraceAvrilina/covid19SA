import { Component, OnInit, OnChanges } from '@angular/core'
import { Router, NavigationExtras } from '@angular/router'
import { globalVariable } from '../globalVariable'
import { GlobalService } from '../api/global.service'
import { ModalPrevImageComponent } from './../../app/widgets/modal-prev-image/modal-prev-image.component'
import { ModalController } from '@ionic/angular'
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from 'ion2-calendar'
import { Helper } from '../helper'
import { ToastController, LoadingController } from "@ionic/angular";


interface FileReaderEventTarget extends EventTarget {
  result: string
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget
  getMessage(): string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public imageHost = globalVariable.url
  public data_user = {
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    photo: localStorage.getItem('photo_profile'),
    full_name: localStorage.getItem('full_name'),
    code: localStorage.getItem('code')
  }
  public previmg: string = ''
  public ress
  public loading:any
  public user: any = {}

  public eventFile: any
  public file: any = null
  public profile: any = {
    nama:'',
    email: '',
    password:'',
    repassword:''
  }
  public data:any = {
    nik:'',
    ttl:'',
    gender:'',
    nip:'',
    nope:'',
    dinas:'',
    divisi:'',
    alamatktr:'',
    alamat:'',
    kota:'',
    nodar:'',
    pnodar:''
  }
  public nama
  public listdiv
  public listnodar
  public listkantor

  constructor(private modalCtrl: ModalController, 
    private router: Router,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
     private globalService: GlobalService) {}

  ionViewWillEnter() {
    this.getStatus()
    this.getProfile()
  }

  ngOnInit() {
    let params = {
      code: localStorage.getItem('code')
    }
    this.globalService.getDivisi(params.code).subscribe(res=>{
      let resp: any = res
      if (resp.status) {
        this.listdiv = resp.data
      }
    })

    this.globalService.getKantor(params.code).subscribe(res=>{
      let resp: any = res
      if (resp.status) {
        this.listkantor = resp.data
      }
    })
    
    this.globalService.NoDar().subscribe(res=>{
      let resp: any = res
      if (resp.status) {
        this.listnodar = resp.data
      }
    })
    this.getStatus()
    this.getProfile()
  }

  back() {
    this.router.navigate(['home'])
  }

  onChange($event) {
    console.log($event);
  }

  getStatus() {
    let params = {
      code: localStorage.getItem('code')
    }

    this.globalService.getDataUser(this.data_user.username,params.code).subscribe(res => {
      let resp: any = res
    })
  }

  onSubmit(data){
    let formData: FormData = new FormData()
    console.log(data)
    let a = 0
    while (a < Object.keys(data).length) {
      let keys = Object.keys(data)[a]
      let value = data[keys]
      if (value != null) {
        formData.append(keys, value)
      }
      a++
    }

    let user = localStorage.getItem('username')
    formData.append('user_name', user)
    formData.append('code_workspace', this.data_user.code)
    formData.append('avatar_file', this.file)

    // if(data.password != data.repassword){
    //   this.presentToast("Password tidak sama")
    // }
    // else 
    if(this.data.alamat === null || this.data.alamatktr === null || this.data.dinas === null || 
      this.data.gender === null || this.data.kota === null || this.data.nip === null || 
      this.data.nodar === null || this.data.pnodar === null || this.data.nope === null || 
      this.data.ttl === null){
        this.presentToast("Salah satu data masih ada yang kosong");
    }
    else{
    this.presentLoadingWithOptions()
    this.globalService.editProfile(formData).subscribe(
      res=>{
        this.loadingController.dismiss()
        let result:any = res
        console.log(res)
        if(result.status){
          this.getProfile()
            this.presentToast("Edit Profil Berhasil Disimpan");
        }
        else{
          this.loadingController.dismiss()
          this.presentToast(result.message);
        }
      }
     )
    }
  }

  getProfile() {
    let params = {
      code: localStorage.getItem('code')
    }
    this.globalService.getDataProfile(this.data_user.username,params.code).subscribe(val => {
      let hasil:any = val
      this.ress = hasil.data

      this.ress.forEach(el => {
        let d = new Date()
        this.previmg = this.imageHost + el.photo_profile
        localStorage.setItem('photo_profile', this.previmg)

        this.nama = el.first_name
        this.profile.nama= el.first_name
        this.profile.email= el.email

        this.data.nik= el.nik
        this.data.ttl = el.birth_date
        this.data.gender = el.gender
        this.data.nip = el.nip
        this.data.nope = el.mobile_phone
        // console.log(this.listkantor)
        // this.listkantor.forEach(val => {
        //   if(this.data.dinas != val.name) this.data.dinas = null
        //   else this.data.dinas = val.name
        // });
        this.data.dinas = el.dinas
        this.data.divisi = el.divisi
        this.data.alamatktr = el.company_address
        this.data.alamat = el.address
        this.data.kota = el.kota
        this.data.nodar = el.no_darurat
        this.data.pnodar = el.pemilik_no_darurat
      });
    })
  }

  edit() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.user
      }
    }
    this.router.navigate(['profile/update'], navigationExtras)
  }

  readUrl(event) {
    if (event != undefined) {
      let t_files = event.target.files
      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader()
        reader.onload = event => {
          this.eventFile = event
          let local_file = this.eventFile.target.result

          /* preview img */
          let img_src = local_file
          this.previmg = img_src
          let file_img = t_files[0]
          this.file = file_img
        }
        reader.readAsDataURL(t_files[0])
      }
    }
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.loading = await this.loadingController.create(config_loading)
    return await this.loading.present()
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  
  async prevImage() {
    console.log(this.previmg)
    const modal = await this.modalCtrl.create({
      component: ModalPrevImageComponent,
      componentProps: { list_img: [this.previmg] }
    })
    return await modal.present()
  }

}
