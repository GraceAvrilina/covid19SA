import { Component, OnInit, OnChanges } from '@angular/core'
import { Router } from '@angular/router'
import { globalVariable } from '../../globalVariable'
import { AlertController } from '@ionic/angular'
import { StorageService } from '../../api/storage.service'
import { AuthService } from 'angularx-social-login'
import { MenuController } from '@ionic/angular'
import { GlobalService } from '../../api/global.service'
@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnChanges {
  public imageHost = globalVariable.url
  public open = false
  public foto
  public data_user = {
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    photo : localStorage.getItem('photo_profile'),
    full_name: localStorage.getItem('full_name')
  }
  public appPages = [
    // {
    //   title: 'Beranda',
    //   url: '/home',
    //   icon: 'home'
    // },
    {
      title: 'Identitas Orang Serumah',
      url: '/orang-serumah',
      icon: 'heart'
    },
//    {
//      title: 'Pesan Masuk',
//      url: '/inbox',
//      icon: 'list-box'
//    }
  ]
  constructor(
    private router: Router,
    private alertController: AlertController,
    private storageService: StorageService,
    private menu: MenuController,
    private authService: AuthService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.data_user.photo = localStorage.getItem('photo_profile')
  }
  ngOnChanges(){
    this.data_user.photo = localStorage.getItem('photo_profile')
  }
  ionViewWillEnter(){
    this.menu.open('end');
    let params = {
      code: localStorage.getItem('code')
    }
    this.globalService.getDataProfile(this.data_user.username,params.code).subscribe(val => {
      let res:any = val

      this.foto = globalVariable.url + res.data[0].photo_profile
    })
  }
  showProfile() {
    this.router.navigate(['/profile'])
  }
  navigate(url) {
    if (url == '/logout') {
      this.confirmSignOut(url)
    } else {
      this.router.navigateByUrl(url)
    }
  }

  nav(url) {
    if (url == '/beranda') {
      this.router.navigate(['/home'])
      this.router.onSameUrlNavigation = "reload"
      this.menu.enable(true, 'first')
      this.menu.close('first')
      this.open = false
    } 
  }

  async confirmSignOut(url) {
    const alert = await this.alertController.create({
      header: '',
      message: 'Apakah anda ingin keluar?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {}
        },
        {
          text: 'Ya',
          handler: () => {
            this.authService.signOut();
            let tempVersion = localStorage.getItem('version')
            localStorage.clear()
            localStorage.setItem('version', tempVersion)
            this.storageService.clearStorage(() => {
              this.router.navigateByUrl('/')
            })
          }
        }
      ]
    })

    await alert.present()
  }
}
