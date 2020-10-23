import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { Helper } from '../helper';
import { Subscription } from 'rxjs';
import { GlobalService } from '../api/global.service'
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { TransportationService } from '../api/transportation.service';
import { LlsService } from '../api/lls.service';
import { StorageService } from '../api/storage.service';
import { Geolocation } from '@ionic-native/geolocation/ngx'

class Leader {
    public username: string
    public name: string
  }
  
  
  @Component({
    selector: 'app-laporan-lingkungan',
    templateUrl: './laporan-lingkungan.component.html',
    styleUrls: ['./laporan-lingkungan.component.scss']
  })
  export class LaporanLingkunganComponent implements OnInit {
    type_segment: String = 'form'
    typeTransport: any = []
    listBendera: any = []
    start: number = 0
    list_sent: any = []
    list_draft: any = []
    load_more_sent: boolean = true
    placeholder_keterangan: string = ''
    loading_spinner = false
    total_draft = 0
    total_sent = 0
    public lat
    public lng
    firstLoad = true
    public loading: any
    isLoading: boolean = false
    reload: boolean = false
    getSubscribe: Subscription
    constructor(
      public modalController: ModalController,
      private transportService: TransportationService,
      private globalService: GlobalService,
      private storageService: StorageService,
      public toastController: ToastController,
      private loadingController: LoadingController,
      private router: Router,
      private geolocation: Geolocation,
      private llsService: LlsService,
      private route: ActivatedRoute
    ){ 

    }
  
    ionViewWillEnter() {}

    ngOnInit() {
      this.getLocation()
    }

    getLocation(){
      this.geolocation.getCurrentPosition(
        {maximumAge: 1000, timeout: 5000,
        enableHighAccuracy: true }
        ).then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude
            //alert("r succ"+resp.coords.latitude)
            console.log(JSON.stringify( resp.coords));
      
            this.lat= resp.coords.latitude
    
            this.lng= resp.coords.longitude
    
            console.log('lat', this.lat)
            console.log('long', this.lng)
            console.log("i'm tracking you!")
    
          }).catch((error) => {
            //alert('Error getting location'+JSON.stringify(error));
              if (error.code == error.PERMISSION_DENIED) {
              this.router.navigate(['/home'])
              alert('Please Allow Your Location')
              console.log("you denied me :-(")
              console.log('Error getting location - '+JSON.stringify(error)) 
            }
            });
          }
  
    close() {
      this.router.navigate(['home'])
    }
  }
