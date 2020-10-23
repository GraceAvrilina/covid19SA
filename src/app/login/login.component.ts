import { Component, OnInit } from "@angular/core";
import { Helper } from "../helper";
import { LoginService } from "../api/login.service";
import { GlobalService } from "../api/global.service";
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router, NavigationExtras } from "@angular/router";
import { ModalLupaPasswordComponent } from "../widgets/modal-lupa-password/modal-lupa-password.component";
import { ModalController,LoadingController,ToastController,Platform,AlertController } from "@ionic/angular";
import { environment } from '../../environments/environment';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import * as localforage  from 'localforage'
declare var window: any;
declare var FB: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  public params: any = {
    email: "",
    password: "",
    code: localStorage.getItem('code')
  }

  // public uName;
  // public uPassword;
  // public loginName;
  // public validate:boolean=false;
  // private user: SocialUser;

  public user: SocialUser;
  public workspace:any;
  public logo
  private loggedIn: boolean;
  loading: any;
  isLoading: boolean = false;
  passwordType: string = 'password';
 passwordIcon: string = 'eye-off';
  constructor(
    private service: LoginService,
    private globalService: GlobalService,
    private router: Router,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private nativeStorage: NativeStorage,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {
    this.globalService.getWorkspace()
    let checkLogin = this.checkLogin();
    if (checkLogin) {
      this.router.navigateByUrl("/home");
    }
  }

  ngOnInit() {
    this.logo = localStorage.getItem('logo')
    localStorage.getItem("code")
    console.log(this.logo)
    this.globalService.getWorkspace().subscribe( data=>{
      let resp: any = data
      this.workspace = resp.data.app_logo_img
      console.log(this.workspace)
      localStorage.setItem("code", resp.data.code)
      localStorage.setItem("alias", resp.data.alias)
      localStorage.setItem("logo", resp.data.app_logo_img)
      console.log(localStorage.getItem("code"))
    })
    console.log(location);

    this.authService.authState.subscribe((user) => {
      this.user = user;
      let params = {
        code: localStorage.getItem('code')
      }
      console.log("user:::",this.user);
      this.service.getSocmed(this.user.id,this.user.provider,this.user.name,this.user.email,params.code).subscribe(
        res => {
          let response: any = res;
          if (response.status != undefined) {
            if (response.status == "granted") {
              let params = {
                code: localStorage.getItem('code')
              }
              this.globalService
              .getDataUser(response.username,params.code)
              .subscribe(res => {
                localStorage.setItem("status", response.status);
                localStorage.setItem("full_name", response.fullname);
                localStorage.setItem("username", response.username);
                localStorage.setItem("is_activated", response.is_activate);
  
                let resp: any = res;
                localStorage.setItem("statusCovid", resp.data.status);
                
                this.router.navigate(['/home'])
              });
            }
          } 
        }
      )
    });
    
  }

  signInWithGoogle(): void {
    var a = this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    console.log("Google ::",a);
    this.router.navigate(['/home'])
  }

  signInWithFB(): void {
    var a = this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    console.log("Facebook ::",a);
    this.router.navigate(['/home'])
  } 

  // googleLoginClick(){
  //   var a= this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  
  //    console.log("Google ::",a);
  //    this.authService.authState.subscribe((user) => {
  //     this.user = user;
  //     console.log("user:::",this.user);
  //     this.router.navigateByUrl("/home");
  //     // this.loggedIn = (user != null);
  //   });

  //   var b=this.authService.signOut(false);
  //   console.log(b);
  // }
  
  // facebookLoginClick(){
      
  //    var a= this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  
  //    console.log("Facebook",a);
     
  //    this.authService.authState.subscribe((user) => {
  //     this.user = user;
  //     console.log("user:::",this.user);
  //     this.router.navigateByUrl("/home");
      
  //   });
  //   var b=this.authService.signOut(false); 
  //   console.log(b);
      
  //   } 

  onSubmit() {
    let helper = new Helper();

    if (this.params.email == "" || this.params.password == "") {
      this.presentToast("email/password tidak boleh kosong");
      return false;
    }
    let valid_email = helper.validateEmail(this.params.email);

    if (valid_email) {
      /* process auth */

      this.presentLoadingWithOptions();

      this.service.getLogin(this.params.email, this.params.password,this.params.code).subscribe(
        res => {
          let response: any = res;
          let err_msg = response.error;
          localStorage.getItem('code')
          if (response.status != undefined) {
            if (response.status == "granted") {
              let params = {
                code: localStorage.getItem('code')
              }
                this.globalService
                  .getDataUser(response.username, params.code)
                  .subscribe(res => {
                    localStorage.setItem("status", response.status);
                    // localStorage.setItem("email", this.params.email);                    
                    localStorage.setItem("full_name", response.fullname);
                    localStorage.setItem("username", response.username);
                    localStorage.setItem("is_activated", response.is_activate);

                    let resp: any = res;
                    localStorage.setItem("statusCovid", resp.data.status);
                    // localStorage.setItem("photo_profile", resp.photo_profile);
                    this.router.navigate(['/home'])
                  });
              // });
            } 
            else if (response.status == "denied") {
              let params = {
                code: localStorage.getItem('code')
              }
              if (
                response.error ==
                "A user was found to match all plain text credentials however hashed credential [password] did not match."
              ) {
                err_msg = "Password tidak sesuai";
              } else if(params.code == null) {
                this.globalService.getWorkspace().subscribe( data=>{
                  let resp: any = data
                  localStorage.setItem('code', resp.data.code)
                  console.log(localStorage.getItem("code"))
                })
              } 
              else if(response.error == 
                "User not found"
              ) {
                this.globalService.getWorkspace().subscribe( data=>{
                  let resp: any = data
                  localStorage.setItem('code', resp.data.code)
                  console.log(localStorage.getItem("code"))
                })
                err_msg = "User tidak ada"
              } else if (
                response.error ==
                "Your account not authorized to acccess this app"
              ) {
                err_msg = "Akun tidak ditemukan";
              }
            } else if (response.status == "banned") {
              err_msg = "Login anda tidak diaktifkan, silahkan hubungi admin";
            } else if (response.status == "unactivated") {
              err_msg =
                "Konfirmasi akun baru anda lewat tautan yang dikirim ke email anda";
            } else if (response.status == "deleted") {
              err_msg = "Akun anda telah dihapus";
            }
          } else {
            localStorage.setItem("status", "unauthorize");
          }
          if (response.status != "granted") {
            this.presentToast(err_msg);
          }
          this.loadingController.dismiss();
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
          this.presentToast("Error");
          this.loadingController.dismiss();
        }
      );
    } else {
      this.presentToast("format email tidak sesuai");
      return false;
    }
  }
  checkLogin() {
    if (localStorage.getItem("status") == "granted") {
      return true;
    } else {
      return false;
    }
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
  
  selectMenu(url) {
    // this.router.navigateByUrl(url)

    let navigationExtras: NavigationExtras = {
      state: {
        reload: true
      }
    }
    this.router.navigate([url], navigationExtras)
  }

  async presentModalForgetPass() {
    const modal = await this.modalController.create({
      component: ModalLupaPasswordComponent,
      // componentProps: { value: 123 }
    });

    modal.onDidDismiss().then(res => {});

    return await modal.present();
  }

  async doGoogleLogin(){
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.googlePlus.login({
      'scopes': '', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': environment.googleWebClientId, // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      })
      .then(user => {
        //save user data on the native storage
        this.nativeStorage.setItem('google_user', {
          name: user.displayName,
          email: user.email,
          picture: user.imageUrl
        })
        .then(() => {
           this.router.navigate(["/user"]);
        }, (error) => {
          console.log(error);
        })
        loading.dismiss();
      }, err => {
        console.log(err);
        if(!this.platform.is('cordova')){
          this.presentAlert();
        }
        loading.dismiss();
      })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
       message: 'Cordova is not available on desktop. Please try this in a real device or in an emulator.',
       buttons: ['OK']
     });

    await alert.present();
  }


  async presentLoading(loading) {
    return await loading.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentLoadingWithOptions() {
    let helper = new Helper();
    let config_loading = helper.getConfigLoading();
    this.isLoading = true;
    this.loading = await this.loadingController
      .create(config_loading)
      .then(a => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => console.log("abort presenting"));
          }
        });
      });
  }
}
