import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router'
import { globalVariable } from '../../globalVariable'
import { GlobalService } from '../../api/global.service'
import { ToastController, AlertController, LoadingController } from '@ionic/angular'
import { Helper } from '../../helper'
@Component({
  selector: 'app-update-data',
  templateUrl: './update-data.component.html',
  styleUrls: ['./update-data.component.scss']
})
export class UpdateDataComponent implements OnInit {
  public imageHost = globalVariable.url
  public data: any
  public file: any = null
  public eventFile: any
  public previmg: string = ''
  public loading: any
  constructor(
    public toastController: ToastController,
    private loadingController: LoadingController,
    public alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let d = new Date()
        this.data = this.router.getCurrentNavigation().extras.state.user
        this.previmg = this.imageHost + this.data.photo_profile + '?' + d.getTime()
      }
    })
  }

  ngOnInit() {
    if (this.data == undefined) {
      location.replace('/profile')
      return false
    }
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

  saveProfile() {
    let formData = new FormData()
    formData.append('first_name', this.data.first_name)
    formData.append('email', this.data.email)
    let mobile_phone = this.data.mobile_phone.toString()

    if (mobile_phone.substr(0, 2) == '62') {
      mobile_phone = mobile_phone.replace('62', '0')
    }
    if (mobile_phone.substr(0, 1) != '0') {
      mobile_phone = '0' + mobile_phone
    }

    formData.append('handphone', mobile_phone)
    let params: any = {
      user_name: this.data.user_name,
      email: this.data.email,
      mobile_phone: mobile_phone
    }
    this.presentLoadingWithOptions()
    if (this.file != null) {
      this.saveAvatar()
    }
    this.globalService.updateProfile(params, formData).subscribe(res => {
      let resp: any = res
      this.loading.dismiss()
      if (resp.success) {
        this.presentToast('profile berhasil diubah')
        setTimeout(() => {
          this.router.navigateByUrl('profile')
        }, 1000)
      } else {
        this.presentToast('gagal ubah data profile')
      }
    })
  }

  saveAvatar() {
    let formData = new FormData()
    formData.append('username', this.data.user_name)
    formData.append('avatar_file', this.file)
    this.globalService.updateAvatar(this.data.user_name, this.data.email, formData).subscribe(res => {
      console.log(res)
    })
  }

  changePasswordPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.data
      }
    }
    this.router.navigate(['profile/update/password'], navigationExtras)
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
    })
    toast.present()
  }
  close() {
    this.router.navigateByUrl('profile')
  }
}
