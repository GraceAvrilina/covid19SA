import { Component, OnChanges, OnInit } from '@angular/core'
import { Router, NavigationExtras } from '@angular/router'
import { GlobalService } from '../api/global.service'
import { ToastController, LoadingController } from '@ionic/angular'
import { DeteksidiriService } from '../api/deteksidiri.service'
import { MenuController } from '@ionic/angular'
// import {ModalDetailHAComponent} from '../widgets/modal-detail-ha/modal-detail-ha.component'
import {ResultAssComponent} from '../widgets/result-ass/result-ass.component'
import { ModalController } from "@ionic/angular";
import { Helper } from '../helper'
import {formatDate} from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {ProfileComponent} from '../profile/profile.component'
import * as localforage  from 'localforage'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [ProfileComponent]
})
export class HomePage implements OnInit {
  public photo
  public lat:any=''
  public lng:any=''
  public logo
  public statusUser
  public warnaIcon
  public score
  public tgl
  public tgllgkp
  public tgljam
  public img
  public saran
  public status
  public total_approval_waiting: number = 0
  public total_approval_pd_waiting: number = 0
  public open = false
  public loading:any
  public listhis: any
  public listlls: any
  public goInit
  public ganormal
  public tglan
  public tglbln
  public inisiatif
  public countnya
  public countnya2
  public goprofile
  constructor(private router: Router, 
    private loadingController: LoadingController, 
    private globalService: GlobalService, 
    private modalController: ModalController,
    private deteksidiriService: DeteksidiriService,
    private menu: MenuController,
    public toastController: ToastController,
    private profile: ProfileComponent,
    private geolocation: Geolocation) {
      this.ionViewWillEnter()
    }

    async presentLoadingWithOptions() {
      let helper = new Helper()
      let config_loading = helper.getConfigLoading()
      this.loading = await this.loadingController.create(config_loading)
      return await this.loading.present()
    }
  

  ionViewWillEnter() {
    this.ngOnInit()
    this.cekprofil()
    this.menu.open('end');
    let params = {
      username: localStorage.getItem('username'),
      code: localStorage.getItem('code'),
      photo: localStorage.getItem('photo_profile')
    }
    this.globalService.getDataUser(params.username, params.code).subscribe(res => {
      let resp: any = res
      
      if(resp.data[0].name != 'Normal'){
        this.ganormal = true
      }
      else
      this.ganormal = false

      this.statusUser = resp.data[0].status
      this.warnaIcon = resp.data[0].color
      this.score = resp.data[0].score
      this.saran = resp.data[0].saran
      this.status = resp.data[0].status
      this.img = 'https://covid.indonesiaindicator.com' + resp.data[0].image_status
      this.tgljam = resp.data[0].updated_at.substr(11,5)
      this.tgllgkp = resp.data[0].updated_at.substr(0,10)
      let value = resp.data[0].updated_at.substr(0,10)
      var hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      var bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Juni', 'Juli', 'Agust', 'Sept', 'Okt', 'Nov', 'Des']
      var tanggal = new Date(value).getDate()
      var xhari = new Date(value).getDay()
      var xbulan = new Date(value).getMonth()
      var xtahun = new Date(value).getFullYear()
  
      var nama_hari = hari[xhari]
      var nama_bulan = bulan[xbulan]

      this.tgl = nama_hari + ', ' +tanggal + ' ' + nama_bulan + ' ' + xtahun
    })
  }

cekprofil(){  
  this.photo = localStorage.getItem('photo_profile')
  this.profile.getProfile()
  if(this.profile.data.alamat == null || this.profile.data.alamatktr == null || this.profile.data.dinas == null || 
    this.profile.data.gender == null || this.profile.data.kota == null || this.profile.data.nip == null || 
    this.profile.data.nodar == null || this.profile.data.pnodar == null || this.profile.data.nope == null || 
    this.profile.data.ttl == null ){
      this.goprofile = true
  }
  else{
    localStorage.setItem("nip", this.profile.data.nip);
    localStorage.setItem("dinas", this.profile.data.dinas);
    this.goprofile = false
  }
}

toastprofile(){
  this.presentToast("Mohon lengkapi data profile terlebih dahulu");
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

  ngOnInit(){
    // this.ionViewWillEnter()
    this.logo = localStorage.getItem('logo')
    this.photo = localStorage.getItem('photo_profile')
    this.tglan= formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.tglbln= formatDate(new Date(), 'dd MMMM yyyy HH:MM:ss', 'en');
    let params = {
      username: localStorage.getItem('username'),
      type: 'assesment',
        code: localStorage.getItem('code')
    }

    this.geolocation.getCurrentPosition(
      {maximumAge: 1000, timeout: 5000,
      enableHighAccuracy: true }
      ).then((resp) => {

          this.lat=resp.coords.latitude
          this.lng=resp.coords.longitude

          console.log('lat', this.lat)
          console.log('long', this.lng)
          },er=>{
            console.log('Can not retrieve Location')
          }).catch((error) => {
          console.log('Error getting location - '+JSON.stringify(error))
          });

  this.deteksidiriService.getHistoryAssesment(params,params.code).subscribe( data=>{
    let res: any = data
    this.listhis= res.data
    if(this.listhis.length > 0){
      this.goInit = false
      
    let tglnya = res.data[0].create_time
    let cektgl = tglnya.substr(0,10)
    if(this.tglan == cektgl){
      this.inisiatif = 'Inisiatif'
      this.countnya = false
      localStorage.setItem("inisiatif", this.inisiatif);
    }
    else{
      this.countnya = true
      this.inisiatif = 'Kondisi hari ini'
      localStorage.setItem("inisiatif", this.inisiatif);
    } 
    }
    else{
    this.goInit = true
    this.countnya = true
    }
  })


  let param = {
    username: localStorage.getItem('username'),
    type: 'laporan_lingkungan',
    code: localStorage.getItem('code')
  }

  this.deteksidiriService.getHistoryAssesment(param,param.code).subscribe( data=>{
    let res: any = data
    let dataLLS = res.data
    
    if(dataLLS.length> 0){
      this.listlls= res.data[0].create_time.slice(0, -8)
      this.tglbln = this.tglbln.slice(0, -8)
      // console.log(this.listlls)
      // console.log(this.tglbln)

      console.log(this.tglbln, this.listlls)
          if(this.tglbln == this.listlls){
            console.log(this.tglbln, this.listlls)
            this.countnya2 = false
          }
          else{
            this.countnya2 = true
          }   
      }
      else{
        this.countnya2 = true
      }
      })

  }

  godetail(){
    let param:any = {
      color : this.warnaIcon,
      date: this.tgllgkp,
      jam: this.tgljam,
      image_status: this.img,
      saran: this.saran,
      score: this.score,
      status: this.status,
      notes: "statushome"
    }
    console.log(param)
    this.presentModalDetailAss(param)
  }

  async presentModalDetailAss(val) {
    const modal = await this.modalController.create({
      component: ResultAssComponent,
      componentProps: { item: val },
      backdropDismiss: false
    });

    modal.onDidDismiss().then(res => {});

    return await modal.present();
  }

  openFirst() {
    this.menu.enable(true, 'first')
    this.menu.open('first')
    this.open = true
  }

  closeFirst() {
    this.menu.enable(true, 'first')
    this.menu.close('first')
    this.open = false
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
