import { Component, OnInit } from '@angular/core' 
import { Storage } from '@ionic/storage';
import { Platform, AlertController, LoadingController,ToastController } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
// import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';
import { SwPush, SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
// import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { GlobalService } from './api/global.service';


interface PushUser {
  subscription: {
    endpoint: string;
    expirationTime: number | null;
    keys: {
      auth: string;
      p256dh: string;
    }
  };
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Laporan Saya',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Logout',
      url: '/logout',
      icon: 'list'
    }
  ];

  deferredPrompt;
  notificationToast: HTMLIonToastElement;
  isInstallPromotionDisplayed = false;
  showBackdrop = false;
  // Notification = Notification;
  // pushUsersCollection: AngularFirestoreCollection<PushUser>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertController: AlertController,
    private loadingController: LoadingController,
    // private fcm: FCM,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private router: Router,
    private globalService: GlobalService,
    private storage: Storage,
    private toastController: ToastController,
    // private db: AngularFirestore,
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
    });
    this.initializeApp()
    // this.pushUsersCollection = db.collection<PushUser>('pushUsers');
  }

  async ngOnInit() {
    // The rest of ngOnInit
    this.globalService.getWorkspace().subscribe( data=>{
      let resp: any = data
      localStorage.setItem("code", resp.data.code)
      localStorage.setItem("alias", resp.data.alias)
      localStorage.getItem("code")
      console.log(localStorage.getItem("code"))
    })
    this.getCodeWorkspace();
    // this.subscribeToPushMessages();
    // this.subscribeToWebPush();
    await this.showIosInstallBanner();
    this.handleAppUpdate();
    this.hijackInstallPrompt();
    // this.subscribeToNotificationClicks();
    this.setExperimentalAppBadge();
  }

  getCodeWorkspace(){
    this.globalService.getWorkspace().subscribe( data=>{
      let resp: any = data
      localStorage.setItem("code", resp.data.code)
      localStorage.setItem("alias", resp.data.alias)
      localStorage.getItem("code")
      console.log(localStorage.getItem("code"))
    })
  }

  // subscribeToPushMessages() {
  //   this.swPush.messages.subscribe((msg: {
  //     notification: NotificationOptions & {
  //       title: string;
  //     }
  //   }) => {
  //     localStorage.setItem('notif', JSON.stringify(msg.notification))
  //     // localStorage.setItem('task', msg.notification.title  )
  //     // localStorage.setItem('task-body', msg.notification.body )
  //     console.log('Received a message in client app', msg);
  //     // Only display the toast message if the app is in the foreground
  //   });
  // }

  // addPushUser(pushUser: PushUser) {
  //   return this.pushUsersCollection.doc(pushUser.subscription.keys.auth).set(pushUser, { merge: true });
  // }

  // navigateOnNotificationClick(notificationAction: string) {
  //   const [action] = notificationAction.split(':');
  
  //   if (action == 'task') {
  //     this.router.navigateByUrl('/home/history');
  //   }
  //   else if(action == 'intruksi'){
  //     this.router.navigateByUrl('/home/inbox');
  //   }
  // }
  
  // subscribeToNotificationClicks() {
  //   this.swPush.notificationClicks.subscribe(msg => {
  //     console.log('notification click', msg);
  
  //     // If there's no action in notification payload, do nothing
  //     if (!msg.action) {
  //       return;
  //     }
  
  //     this.navigateOnNotificationClick(msg.action);
  //     if (this.notificationToast) {
  //       this.notificationToast.dismiss();
  //     }
  //   });
  // }

  handleAppUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(async (event: UpdateAvailableEvent) => {
        const alert = await this.alertController.create({
          header: `App update!`,
          message: `Newer version - v${((event.available.appData) as any).version} is available.
                    Change log: ${((event.available.appData) as any).changelog}`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            }, {
              text: 'Refresh',
              handler: () => {
                this.swUpdate.activateUpdate().then(() => window.location.reload());
              },
            },
          ],
        });

        await alert.present();
      });
    }
  }

  async showIosInstallBanner() {
  // Put the functions for assertion here
  const isIos = () => {
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  };
  
  const isInStandaloneMode = () => ('standalone' in (window as any).navigator) && ((window as any).navigator.standalone);
  
  const isBannerShown = await this.storage.get('isBannerShown');
  
  if (isIos() && !isInStandaloneMode() && isBannerShown == null) {
    
    const toast = await this.toastController.create({
      showCloseButton: true,
      closeButtonText: 'OK',
      cssClass: 'your-class-here-if-need-to-customize',
      position: 'bottom',
      message: `To install the app, tap "Share" icon below and select "Add to Home Screen".`,
    });
    toast.present();
    this.storage.set('isBannerShown', true);
  }
}

hijackInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 76 and later from showing the mini-infobar
    e.preventDefault();

    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;

    // Toggle the install promotion display
    this.showInstallPromotion();
  });
}

showInstallPromotion() {
  this.isInstallPromotionDisplayed = true;
}

showInstallPrompt() {
  this.showBackdrop = true;

  // Show the prompt
  this.deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  this.deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        // Hide the install promotion UI as user just installed it
        this.isInstallPromotionDisplayed = false;
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      this.deferredPrompt = null;
      this.showBackdrop = false;
    }).catch(() => {
    this.showBackdrop = false;
  });
}

// subscribeToWebPush() {
//   if ('Notification' in window && Notification.permission === 'granted') {

//     this.swPush.requestSubscription({
//       serverPublicKey: 'BDEPaCB1045hlH9-d2Io9hOPUD2FwnkShMW23Vq-_GOr7cxAuVleWRixDk_09ntonLQunvhTZRUrYVpwIlwj89o',
//     }).then((sub) => {
//       const subscription = JSON.parse(JSON.stringify(sub));
//       console.log('subscribeToWebPush successful');
//       console.log(subscription);
//       this.addPushUser({ subscription });
//     }).catch((err) => {
//       console.log('subscribeToWebPush error', err);
//     });
//   }

// }

// requestNotificationPermission() {
//   // We will use the backdrop to create user focus on permission dialog
//   this.showBackdrop = true;

//   if ('Notification' in window) {
//     Notification.requestPermission().then((permission: NotificationPermission) => {
//       this.showBackdrop = false;

//       if (permission === 'granted') {
//         console.log('Notification permission is granted');

//         // Since we have the permission now, let's subscribe to Web Push server
//         this.subscribeToWebPush();
//       } else {
//         console.log('Notification permission is not granted: ', permission);
//       }
//     }).catch((err) => {
//       console.log('Error on requestNotificationPermission', err);
//       this.showBackdrop = false;
//     });
//   }
// }

  initializeApp() {
    // this.globalService.checkVersion().subscribe(res => {
    //   let resp: any = res
    //   let version = localStorage.getItem('version')
    //   let last_version = resp.data[0].version_name
    //   localStorage.setItem('version', last_version)
    //   if (version == undefined || version != last_version) {
    //     this.loadingClearCache()
    //     setTimeout(() => {
    //       window.location.reload(true)
    //     }, 7000)
    //   }
    // })
    // this.fcm.getToken().then(token => {
    //   console.log(token);
    // });
    // this.fcm.onTokenRefresh().subscribe(token => {
    //   console.log(token);
    // });

    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
    })
  }

  // async confrim_new_version() {
  //   const alert = await this.alertController.create({
  //     header: 'Versi Baru',
  //     message: 'Apakah anda akan perbaharui versi dengan yang terbaru  ?',
  //     buttons: [
  //       {
  //         text: 'Tidak',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: blah => {}
  //       },
  //       {
  //         text: 'Ya',
  //         handler: () => {
  //           window.location.reload(true)
  //         }
  //       }
  //     ]
  //   })

  //   await alert.present()
  // }
  setExperimentalAppBadge() {
    if ('setExperimentalAppBadge' in navigator) {
      const unreadCount = 4;
      // @ts-ignore
      navigator.setExperimentalAppBadge(unreadCount);
    }
  }

  async loadingClearCache() {
    let config: any = {
      spinner: 'lines',
      message: 'Bersihkan Cache...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      duration: 5000
    }
    const loading = await this.loadingController.create(config)
    return await loading.present()
  }
}
