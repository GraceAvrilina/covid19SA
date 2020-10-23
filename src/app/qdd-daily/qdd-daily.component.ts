import { Component, OnInit } from '@angular/core'
import { IonicSelectableComponent } from 'ionic-selectable'
import { Subscription } from 'rxjs'
import { ModalUploadBymediaPage } from '../widgets/modal-upload-bymedia/modal-upload-bymedia.component'
import { ModalController } from '@ionic/angular'
import { TransportationService } from '../api/transportation.service'
import { GlobalService } from '../api/global.service'
import { Helper } from '../helper'

import {FormTransportComponent} from '../widgets/form-transport/form-transport.component'

import { ToastController, LoadingController } from '@ionic/angular'
import { Router, ActivatedRoute } from '@angular/router'
import {DeteksidiriService} from '../api/deteksidiri.service'
import {ModalDetailHAComponent} from '../widgets/modal-detail-ha/modal-detail-ha.component'
import {ResultAssComponent} from '../widgets/result-ass/result-ass.component'
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'app-qdd-daily',
  templateUrl: './qdd-daily.component.html',
  styleUrls: ['./qdd-daily.component.scss'],
  providers:[FormTransportComponent]
})
export class QDDDailyComponent implements OnInit {
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
  public no9
  public no10
  public no11
  public no12
  public no13
  public no14
  public no17
  public no18
  public no21
  public no22
  public no25

  public paramno
  public b1 = false
  public b2 = false
  public b3 = false
  public b4 = false
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
  public alias
  public judulheader
  public code

  public wajib = false

  public param: any ={
    input_q0: '',
  }
  
  public previmg: string = ''
  public eventFile: any
  public file: any = null

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    private detekservice: DeteksidiriService,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private geolocation: Geolocation,
    private formtransport: FormTransportComponent
  ) {
    this.username = localStorage.getItem('username')
    this.judulheader = localStorage.getItem('inisiatif')
    this.code = localStorage.getItem('code')
    this.alias = localStorage.getItem('alias')
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
    let params = {
      username: localStorage.getItem('username'),
      survey_id: 'f7d09f2f-10c8-51a4-3dfd-0f9ebda06453',
      code: localStorage.getItem('code')
      // task_type: 'Q-DD Init'
    }
    this.presentLoadingWithOptions()
    this.detekservice.getQDDInit(params,params.code).subscribe(res=>{
      this.loadingController.dismiss()
      let resp: any = res
      if(resp.success){
        this.dataQ = resp.data
        this.dataQ.forEach((val, i) => {
        if(this.alias == 'pdsi'){
          if(i < 10){
            let isi = val
            this.datanya.push(isi)
          }
          if(i >= 10){
            this.dataB.push(val)
          }
        }
        else{
          if(i < 9){
            let isi = val
            this.datanya.push(isi)
          }
          if(i >= 9){
            this.dataB.push(val)
          }
        }
        });     
        this.dataB.forEach(element => {
          if(element.input_type == 'radio'){
          this.list = element.list
          this.list.forEach(el => {
            if(el.hasOwnProperty('jump_to')){
              el.jumpfrom = true
            }
            else{
              el.jumpfrom = false
            }

          });
          }
        });   
      }
    })
  }

  onSubmit(data) {

    let formData: FormData = new FormData()
    let params:any ={
      code_workspace: this.code,
      survey_id: 'f7d09f2f-10c8-51a4-3dfd-0f9ebda06453',
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

    let R = 0
    while (R < Object.keys(this.jwbn1).length) {
      let keys = Object.keys(this.jwbn1)[R]
      let value = this.jwbn1[keys]
      if (value != null) {
        formData.append(keys, value)
      }
      R++
    }

    let i = 0
    while (i < Object.keys(data).length) {
      let keys = Object.keys(data)[i]
      let value = data[keys]
      if (value != null) {
        formData.append(keys, value)
      }
      i++
    }

    if(this.alias == 'pdsi') formData.append('input_q0', this.file)
    
    if(this.alias == 'pdsi'){
      if(data.input_q9 == null || data.input_q10 == null || data.input_q11 == null ||
        data.input_q15 == null || data.input_q19 == null || data.input_q23 == null || data.input_q26 == null){
        this.presentToast("Salah satu data ada yang kosong");
        this.wajib = true
      }
      else{
        this.wajib = false
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
              notes: 'qdd'
            }
          this.presentModalDetailAss(param)
          }
          else{
            this.presentToast(result.message);
          }
        }
      )
      }
    }
    else{
    if(data.input_q8 == null || data.input_q9 == null || data.input_q10 == null || data.input_q14 == null ||
      data.input_q18 == null || data.input_q22 == null || data.input_q25 == null){
      this.presentToast("Salah satu data ada yang kosong");
      this.wajib = true
    }
    else{
      this.wajib = false
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
            notes: 'qdd'
          }
        this.presentModalDetailAss(param)
        }
        else{
          this.presentToast(result.message);
        }
      }
    )
    }
  }
  }

  select(no,val){
  if(this.alias == 'pdsi'){
    if(no ==  'input_q1'){
      this.no1 = val
    }
    else if(no ==  'input_q2'){
      this.no2 = val
    }
    else if(no ==  'input_q3'){
      this.no3 = val
    }
    else if(no ==  'input_q4'){
      this.no4 = val
    }
    else if(no ==  'input_q5'){
      this.no5 = val
    }
    else if(no ==  'input_q6'){
      this.no6 = val
    }
    else if(no ==  'input_q7'){
      this.no7 = val
    }
  }
  else{
    if(no ==  'input_q0'){
      this.no1 = val
    }
    else if(no ==  'input_q1'){
      this.no2 = val
    }
    else if(no ==  'input_q2'){
      this.no3 = val
    }
    else if(no ==  'input_q3'){
      this.no4 = val
    }
    else if(no ==  'input_q4'){
      this.no5 = val
    }
    else if(no ==  'input_q5'){
      this.no6 = val
    }
    else if(no ==  'input_q6'){
      this.no7 = val
    }
  }
  }

  select2(no,val){
  if(this.alias == 'pdsi'){
    if(no ==  'input_q9'){
      this.no8 = val
    }
    else if(no ==  'input_q10'){
      this.no9 = val
    }
    else if(no ==  'input_q26'){
      this.no25 = val
    }
  }
  else{
    if(no ==  'input_q8'){
      this.no8 = val
    }
    else if(no ==  'input_q9'){
      this.no9 = val
    }
    else if(no ==  'input_q25'){
      this.no25 = val
    }
  }
  }

  next(data) {
    if(this.alias == 'pdsi'){
      if(data.input_q1 == undefined || data.input_q2 == undefined || data.input_q3 == undefined ||
        data.input_q4 == undefined || data.input_q5 == undefined ||  data.input_q6 == undefined ||  data.input_q8 == false){
        this.presentToast("Salah satu data ada yang kosong");
        this.wajib= true
      }
      else {
        this.wajib = false
      this.jwbn1 = data
      this.type_segment = 'form2'
      }
    }
    else{
      if(data.input_q0 == undefined || data.input_q1 == undefined || data.input_q2 == undefined || data.input_q3 == undefined ||
        data.input_q4 == undefined || data.input_q5 == undefined ||  data.input_q7 == false){
        this.presentToast("Salah satu data ada yang kosong");
        this.wajib= true
      }
      else {
        this.wajib = false
      this.jwbn1 = data
      this.type_segment = 'form2'
      }
  }
  }


  changestatus( val, no){
    console.log(val, no)
    if(this.alias == 'pdsi'){
      if(val == 1 && no == 'input_q11'){
        this.b1 = false
        this.no10 = val
      }
      else if(val == 2 && no == 'input_q11')
      {this.b1 = true
       this.no10 = val
      }
  
      if(val == 1 && no == 'input_q15'){
        this.b2 = false
        this.no14 = val
      }
      else if(val == 2 && no == 'input_q15'){
       this.b2 = true
       this.no14 = val
     }  
  
      if(val == 1 && no == 'input_q19'){
        this.b3 = false
        this.no18 = val
      }
      else  if(val == 2 && no == 'input_q19'){
      this.b3 = true
      this.no18 = val
      }
      
      if(val == 1 && no == 'input_q23'){
        this.b4 = false
        this.no22 = val
      }
      else if(val == 2 && no == 'input_q23'){
      this.b4 = true
      this.no22 = val
      }
    }
    else{
    if(val == 1 && no == 'input_q10'){
      this.b1 = false
      this.no10 = val
    }
    else if(val == 2 && no == 'input_q10')
    {this.b1 = true
     this.no10 = val
    }

    if(val == 1 && no == 'input_q14'){
      this.b2 = false
      this.no14 = val
    }
    else if(val == 2 && no == 'input_q14'){
     this.b2 = true
     this.no14 = val
   }  

    if(val == 1 && no == 'input_q18'){
      this.b3 = false
      this.no18 = val
    }
    else  if(val == 2 && no == 'input_q18'){
    this.b3 = true
    this.no18 = val
    }
    
    if(val == 1 && no == 'input_q22'){
      this.b4 = false
      this.no22 = val
    }
    else if(val == 2 && no == 'input_q22'){
    this.b4 = true
    this.no22 = val
    }
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