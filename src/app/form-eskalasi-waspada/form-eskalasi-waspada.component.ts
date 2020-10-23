import { Component, OnInit } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { Helper } from '../helper'

import {FormTransportComponent} from '../widgets/form-transport/form-transport.component'

import { ToastController, LoadingController } from '@ionic/angular'
import { Router, ActivatedRoute } from '@angular/router'
import {DeteksidiriService} from '../api/deteksidiri.service'
import { ModalSelectActivitynameComponent } from '../widgets/modal-select-activityname/modal-select-activityname.component'
import {ModalDetailHAComponent} from '../widgets/modal-detail-ha/modal-detail-ha.component'
import {ResultAssComponent} from '../widgets/result-ass/result-ass.component'
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'app-form-eskalasi-waspada',
  templateUrl: './form-eskalasi-waspada.component.html',
  styleUrls: ['./form-eskalasi-waspada.component.scss'],
  providers:[FormTransportComponent]
})
export class FormEskalasiWaspadaComponent implements OnInit  {
  type_segment: String = 'form'
  firstLoad = true

  public dataQ
  public datanya:any = []
  public dataB:any= []

  public no1
  public no2
  public no3
  public no4
  public no5
  public no6
  public no7
  public no8

  public paramno
  public b1 = false
  public b2 = false
  public b3 = false
  public b4 = false
  public b5 = false
  public list: any 

  
  public warnaIcon
  public score
  public tgllgkp
  public tgljam
  public img
  public saran
  public status
  public lat
  public lng

  loading: any
  public jwbn1
  public username
  public code

  public param: any ={
    input_q0: '',
  }

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    private detekservice: DeteksidiriService,
    private loadingController: LoadingController,
    private router: Router,
    private geolocation: Geolocation,
    private route: ActivatedRoute,
    private formtransport: FormTransportComponent
  ) {
    this.username = localStorage.getItem('username')
    this.code = localStorage.getItem('code')
  }

  ionViewWillEnter() {}

  ngOnInit() {
    this.getQuestionInit()
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
          localStorage.setItem('lat', JSON.stringify(resp.coords.latitude))
          this.lng= resp.coords.longitude
          localStorage.setItem('lng', JSON.stringify(resp.coords.longitude))

          console.log('lat', localStorage.getItem('lat'))
          console.log('long', localStorage.getItem('lng'))
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

  getQuestionInit(){
    this.presentLoadingWithOptions()
    let params = {
      username: localStorage.getItem('username'),
      survey_id: '5471d67e-f2f4-2574-357b-3c9266604e81',
      code: localStorage.getItem('code')
      // task_type: 'Q-DD Init'
    }
    this.detekservice.getQDDInit(params,params.code).subscribe(res=>{
      this.loadingController.dismiss()
      let resp: any = res
      if(resp.success){
        this.dataQ = resp.data
      }
    })
  }

  async searchActivityName() {
    const modal = await this.modalController.create({
      component: ModalSelectActivitynameComponent
      // componentProps: { type: 'transportasi' }
    })

    modal.onDidDismiss().then(res => {
      console.log(res)
      if (res.data != undefined) {
        this.no7 = res.data.nama
      }
    })
    return await modal.present()
  }

  onSubmit(data) {
    console.log(data)
    let formData: FormData = new FormData()
    let params:any ={
      code_workspace: this.code,
      survey_id: '5471d67e-f2f4-2574-357b-3c9266604e81',
      username: this.username,
      latlng: localStorage.getItem('lat') + ',' + localStorage.getItem('lng')
    }

    let a = 0
    while (a < Object.keys(params).length) {
      let keys = Object.keys(params)[a]
      let value = params[keys]
      if (value != null) {
        formData.append(keys, value)
      }
      a++
    }

    // if(data.input_q8 == undefined || data.input_q9 == undefined || data.input_q10 == undefined || data.input_q14 == undefined ||
    //   data.input_q18 == undefined || data.input_q22 == undefined || data.input_q25 == undefined){
    //   this.presentToast("Salah satu data ada yang kosong");
    // }

    let i = 0
    while (i < Object.keys(data).length) {
      let keys = Object.keys(data)[i]
      let value = data[keys]
      if (value != null) {
        formData.append(keys, value)
      }
      i++
    }
    this.presentLoadingWithOptions()

    this.detekservice.postLLS(formData).subscribe(
      res=>{
        this.loadingController.dismiss()
        let result:any = res
        console.log(res)
        if(result.status){
              
          this.warnaIcon = result.data.decription.status.color
          this.score = result.data.decription.score
          this.saran = result.data.decription.status.saran
          this.status = result.data.decription.status.text
          this.img = 'https://covid.indonesiaindicator.com' + result.data.decription.status.image_status
            let param:any = {
            color : this.warnaIcon,
            date: result.data.time*1000,
            jam: result.data.time*1000,
            image_status: this.img,
            saran: this.saran,
            score: this.score,
            status: this.status,
            skrg: 'Waspada',
            notes: 'eskalasi'
          }
        this.presentModalDetailAss(param)
        }
        else{
          this.presentToast(result.message);
        }
      }
    )

    // this.saveData(data, 'sent')
  }

  select(no,val){
    if(no ==  'input_q7'){
      this.no8 = val
    }
    // this.obj[no]=val
    let obj = {
      soalNo: no,
      isi: val
    }
  }


  changestatus( val, no){
    console.log(val, no)
    if(val == 1 && no == 'input_q0'){
      this.b1 = false
      this.no1 = val
    }
    else if(val == 2 && no == 'input_q0')
    {this.b1 = true
     this.no1 = val
    }

    if(val == 1 && no == 'input_q2'){
      this.b2 = false
      this.no3 = val
    }
    else if(val == 2 && no == 'input_q2'){
     this.b2 = true
     this.no3 = val
   }  

    if(val == 1 && no == 'input_q3'){
      this.b3 = false
      this.no4 = val
    }
    else if(val == 2 && no == 'input_q3'){
    this.b3 = true
    this.no4 = val
    }
    
    if((val == 1 || val==2) && no == 'input_q4'){
      this.b4 = false
      this.b5 = false
      this.no5 = val
    }
    else if(val == 3 && no == 'input_q4'){
    this.b4 = true
    this.b5 = true
    this.no5 = val
    }
    
    if(val == 3 && no == 'input_q5'){
      this.b5 = false
      this.no6 = val
    }
    else if((val == 1 || val==2) && no == 'input_q5'){
    this.b5 = true
    this.no6 = val
    }
  }

  segmentChanged(type) {
    if (this.firstLoad) return false
    this.type_segment = type
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

  close() {
    this.router.navigate(['home'])
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.loading = await this.loadingController.create(config_loading)
    return await this.loading.present()
  }
}