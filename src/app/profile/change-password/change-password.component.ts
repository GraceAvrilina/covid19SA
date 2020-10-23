import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ToastController, AlertController, LoadingController } from '@ionic/angular'
import { Helper } from '../../helper'
import { GlobalService } from '../../api/global.service'
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public data: any
  public params: any = {
    old_password: '',
    new_password: '',
    confirm_password: ''
  }
  loading: any
  isLoading: boolean = false
  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private serviceGlobal: GlobalService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      let d = new Date()
      this.data = this.router.getCurrentNavigation().extras.state.user
    }
  }

  ngOnInit() {
    console.log(this.data)
    if (this.data == undefined) {
      location.replace('/profile')
      return false
    }
  }
  cancel() {
    this.router.navigateByUrl('profile/update')
  }

  changePassword() {
    let valid = true
    let password = this.params.new_password
    let confirm_password = this.params.confirm_password

    if (confirm_password != password) {
      this.presentToast('Kata sandi baru tidak sama')
      return false
    }

    if (password.length < 8) {
      valid = false
    }

    if (password.search(/\d/) == -1) {
      valid = false
    }

    if (password.replace(/[^A-Z]/g, '').length == 0) {
      valid = false
    }

    if (!valid) {
      this.presentToast('Kata sandi minimal harus 8 karakter dengan huruf kapital dan angka')
      return false
    } else {
      this.presentLoadingWithOptions()
      let username = this.data.user_name
      let params = {
        oldPassword: this.params.old_password,
        newPassword: this.params.new_password,
        email: this.data.email
      }
      this.serviceGlobal.changePassword(params, username).subscribe(res => {
        this.isLoading = false
        let resp: any = res
        if (!resp.success) {
          if (resp.info == 'Old password is incorrect') {
            this.presentToast('Password lama tidak sesuai')
          } else {
            this.presentToast(resp.info)
          }
        } else {
          this.presentToast('Password berhasil diubah')
          setTimeout(() => {
            this.router.navigateByUrl('profile/update')
          }, 1300)
        }
      })
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    })
    toast.present()
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.isLoading = true
    await this.loadingController.create(config_loading).then(a => {
      a.present().then(() => {
        console.log(this.isLoading)
        if (!this.isLoading) {
          a.dismiss().then(() => {
            console.log('abort presenting')
            this.isLoading = false
          })
        }
      })
    })
  }
}
