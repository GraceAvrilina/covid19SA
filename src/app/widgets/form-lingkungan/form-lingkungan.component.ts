import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import {DeteksidiriService} from '../../api/deteksidiri.service'
import { ToastController, LoadingController } from "@ionic/angular";
import { Router, ActivatedRoute } from '@angular/router'
import { Helper } from '../../helper'
import {formatDate} from '@angular/common'
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'app-form-lingkungan',
  templateUrl: './form-lingkungan.component.html',
  styleUrls: ['./form-lingkungan.component.scss']
})
export class FormLingkunganComponent implements OnInit {
  public dataQ
  name:string;
  public radioo:any = []
  public no
  public obj:any={}
  public r1
  public r2
  public r3
  public r4
  public r5
  public r6
  public r7
  public r8
  public r9
  public lat
  public lng
  public username
  loading: any
  public tglbln
  
  public code
  // @ViewChild('jelajah')
  // jelajah: ElementRef
  // @ViewChild('wrapper',{static: true})
  // wrapper: ElementRef
  constructor(
    private detekservice: DeteksidiriService,
    private router: Router,
    private geolocation: Geolocation,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.code = localStorage.getItem('code')
    this.username = localStorage.getItem('username')
   }

  ngOnInit() {
    this.getLLS()
  }

  getLLS(){
    this.presentLoadingWithOptions()
    let params = {
      username: localStorage.getItem('username'),
      survey_id: 'b039d352-b29f-6774-31f1-3e02c8acbd74',
      code: localStorage.getItem('code')
    }
    this.detekservice.getLLS(params,params.code).subscribe(res=>{
      this.loadingController.dismiss()
      let resp: any = res
      if(resp.success){
        this.dataQ = resp.data
      }
    })
  }
  
    select(no,val){
      if(no ==  'input_q2'){
        this.r1 = val
      }
      else if(no ==  'input_q3'){
        this.r2 = val
      }
      else if(no ==  'input_q4'){
        this.r3 = val
      }
      else if(no ==  'input_q5'){
        this.r4 = val
      }
      else if(no ==  'input_q6'){
        this.r5 = val
      }
      else if(no ==  'input_q7'){
        this.r6 = val
      }
      else if(no ==  'input_q8'){
        this.r7 = val
      }
      else if(no ==  'input_q9'){
        this.r8 = val
      }
      else if(no ==  'input_q10'){
        this.r9 = val
      }
      // this.obj[no]=val
      let obj = {
        soalNo: no,
        isi: val
      }
      // obj[no] = val
      // console.log(obj)
      // this.radioo.push(obj)
      // console.log('push '+this.radioo)

      // let theradio = val+no
      // this.radioo.push(theradio)
    }

    saveData(data){
      data.forEach((v,i) => {
        
      });
      let isi = data.substr(0,1)
      let nomer = data.substr(1,9)
      console.log(nomer, isi)
    }

  submit(data) {
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
        })
    let formData: FormData = new FormData()
    let params:any ={
      code_workspace: this.code,
      survey_id: 'b039d352-b29f-6774-31f1-3e02c8acbd74',
      username: this.username
    }

    let a = 0
    while (a < Object.keys(params).length) {
      let keys = Object.keys(params)[a]
      let value = params[keys]
      if (value != null) {
        console.log(keys, value)
        formData.append(keys, value)
      }
      a++
    }

    console.log(data);

    if(data.input_q0 == null){
      this.presentToast("Alamat tidak boleh kosong");
    }
    if(data.input_q1 == null){
      this.presentToast("Kota/Kabupaten tidak boleh kosong");
    }
    let i = 0
    while (i < Object.keys(data).length) {
      let keys = Object.keys(data)[i]
      let value = data[keys]
      if (value != null) {
        console.log(keys, value)
        formData.append(keys, value)
      }
      i++
    }    

    if(data.input_q0 != null && data.input_q1 != null){
      this.presentLoadingWithOptions()
    this.detekservice.postLLS(formData).subscribe(
      res=>{
        this.loadingController.dismiss()
        let result:any = res
        console.log(res)
        if(result.status){
          // this.tglbln= formatDate(new Date(), 'dd MMMM yyyy HH:MM:ss', 'en');
          // localStorage.setItem("historyLLS", this.tglbln);
            // this.regsuccess()
            this.router.navigate(['home'])
            this.presentToast("Lapor Lingkungan Sekitar Berhasil Disimpan");
        }
        else{
          this.presentToast(result.message);
        }
      }
    )
    }
    else{
      this.presentToast("Salah satu data masih kosong")
    }
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
