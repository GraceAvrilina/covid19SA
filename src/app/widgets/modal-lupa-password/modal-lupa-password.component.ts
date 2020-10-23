import { Component, Input } from '@angular/core'
import { Platform, NavParams, ModalController } from '@ionic/angular'
import { ToastController, AlertController, LoadingController } from '@ionic/angular'
import { Helper } from '../../helper'
import { GlobalService } from '../../api/global.service'
@Component({
  selector: 'app-modal-lupa-password',
  templateUrl: './modal-lupa-password.component.html',
  styleUrls: ['./modal-lupa-password.component.scss']
})
export class ModalLupaPasswordComponent {
  public email: string = ''
  loading: any
  public logo
  constructor(
    navParams: NavParams,
    private platform: Platform,
    private modalCtrl: ModalController,
    public toastController: ToastController,
    private loadingController: LoadingController,
    public alertCtrl: AlertController,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
   this.logo = localStorage.getItem("logo")
	}
  close() {
    this.modalCtrl.dismiss()
  }
  send() {
    if (this.email == '') {
      this.presentToast('silahkan masukan email anda')
      return false
    } else {
      let helper = new Helper()
      let valid_email = helper.validateEmail(this.email)
      if (!valid_email) {
        this.presentToast('format email tidak sesuai')
        return false
      }
    }
    let formData = new FormData()
    formData.append('email', this.email)
    this.presentLoadingWithOptions()
    this.globalService.forgetPassword(formData).subscribe(res => {
      this.loading.dismiss()
      this.presentToast('Link lupa password dikirim ke email anda')
      setTimeout(() => {
        this.modalCtrl.dismiss()
      }, 2000)
    })
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
}
