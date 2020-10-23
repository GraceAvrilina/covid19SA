import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { Firebase } from '@ionic-native/firebase/ngx'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment'
import { HttpClientModule } from '@angular/common/http'
import { IonicSelectableModule } from 'ionic-selectable'
import { IonicStorageModule } from '@ionic/storage';

import { FullpageComponent } from './layout/fullpage/fullpage.component'
import { MainpageComponent } from './layout/mainpage/mainpage.component'
import { LogoutComponent } from './logout/logout.component'
import { MaintenanceComponent } from './maintenance/maintenance.component'
import { Camera } from '@ionic-native/camera/ngx'
import { ModalPrevImageComponent } from './widgets/modal-prev-image/modal-prev-image.component'
import { FCM } from '@ionic-native/fcm/ngx';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider} from "angularx-social-login";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { Geolocation } from '@ionic-native/geolocation/ngx';

// const config = {
//   apiKey: "AIzaSyDzgW2L2AbZVUcTxXh0yXo4GDsj7aQHGxo",
//   authDomain: "covid19-sa-60629.firebaseapp.com",
//   databaseURL: "https://covid19-sa-60629.firebaseio.com",
//   projectId: "covid19-sa-60629",
//   storageBucket: "covid19-sa-60629.appspot.com",
//   messagingSenderId: "417491468224",
//   appId: "1:417491468224:web:36410b07332152c9da5225",
//   measurementId: "G-Z0R38E9PJ3"
// };

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("761892023644-sj0qd96trla801khl5t7fup5kkuv6r5m.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("366856813991024")
  },
]);
export function provideConfig() {
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
    FullpageComponent,
    LogoutComponent,
    MainpageComponent,
    ModalPrevImageComponent,
    MaintenanceComponent
  ],
  entryComponents: [ModalPrevImageComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('main-sw.js', { enabled: environment.production }),
    IonicSelectableModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    SocialLoginModule
  ],
  exports: [ModalPrevImageComponent],
  providers: [
    Geolocation,
    StatusBar,
    SplashScreen,
    Camera,
    FCM,
    Firebase,
    GooglePlus,
    NativeStorage,
    { 
      // provide: AuthServiceConfig, useFactory: provideConfig, 
      provide: AuthServiceConfig,
      useFactory: provideConfig}
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
