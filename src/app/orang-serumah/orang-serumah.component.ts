import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from '../api/global.service'
import { Helper } from '../helper';

@Component({
  selector: 'app-orang-serumah',
  templateUrl: './orang-serumah.component.html',
  styleUrls: ['./orang-serumah.component.scss'],
})
export class OrangSerumahComponent implements OnInit {
  public data_user = {
    username: localStorage.getItem('username'),
    code: localStorage.getItem('code')
  }

    public params:any={
      code_workspace: '',
      username: '',
      data: {}
    }
  constructor(private menu: MenuController,
    private toastController: ToastController,
    private router: Router,
    private globalService: GlobalService) {
      this.getOrangSekitar()
    }
    public nama:string=""
    public umur:string=""
    public hubungan:string=""
    public pekerjaan:string=""


    public serumah=[]

  ngOnInit() {
  }

  getOrangSekitar() {
    let params = {
      username: localStorage.getItem('username'),
      code: localStorage.getItem('code')
    }

    this.globalService.getOrangSerumah(this.data_user.username,params.code).subscribe( data=>{
    let resp: any = data
    this.serumah = resp.data
    this.setData(resp.data[0])
    console.log(this.serumah)

    })
  }

  setData(data){
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data != null) {
         }
        }
    }
  }

  onSubmit(data){
    let formData: FormData = new FormData()

    // var stringarr= '['+'{' + 
    // '"nama"' +':"' + data.nama + '" ,'  +
    // '"umur"' +':"' + data.umur + '",'  +
    // '"hubungan"' +':"' + data.hubungan + '",' +
    // '"pekerjaan"' +':"' + data.pekerjaan  
    // + '"}'+']'

    let datapush = {"nama":data.nama,"umur":data.umur,"hubungan":data.hubungan,"pekerjaan":data.pekerjaan}
    this.serumah.push(datapush)

    let json = JSON.stringify(this.serumah)
    console.log(this.serumah)

    // let params:any = {
      this.params.code_workspace = this.data_user.code,
      this.params.username = this.data_user.username,
      this.params.data = json
      
    // }
    let a = 0
    while (a < Object.keys(this.params).length) {
      let keys = Object.keys(this.params)[a]
      let value = this.params[keys]
      if (value != null) {
        formData.append(keys, value)
      }
      a++
    }
    // console.log(data)
    if (data.nama != null && 
      data.umur != null &&
      data.hubungan != null &&
      data.pekerjaan != null) 
      {
        this.nama = ""
        this.umur = ""
        this.pekerjaan = ""
        this.hubungan = ""
    this.globalService.postOrangSerumah(formData).subscribe(
        res=>{
        let result:any = res
        console.log(res)
        if(result.status){
          this.presentToast(result.message);
          console.log(result.status)
          this.getOrangSekitar()
      }
      else{
        this.presentToast(result.message);
      }
      }
    )
    }
    else if(data.nama == null && 
      data.umur == null &&
      data.hubungan == null &&
      data.pekerjaan == null) {
        this.presentToast('Mohon untuk di isi semuanya')
    }
    else if(data.nama == null) {
      this.presentToast('Masukkan Nama')
    }
    else if(data.umur == null) {
      this.presentToast('Masukkan Umur')
    }
    else if(data.hubungan == null) {
      this.presentToast('Masukkan Hubungan')
    }
    else if(data.pekerjaan == null) {
      this.presentToast('Masukkan Pekerjaan')
    }

  }

  onSave(data){
    let formData: FormData = new FormData()

    // var stringarr= '['+'{' + 
    // '"nama"' +':"' + data.nama + '" ,'  +
    // '"umur"' +':"' + data.umur + '",'  +
    // '"hubungan"' +':"' + data.hubungan + '",' +
    // '"pekerjaan"' +':"' + data.pekerjaan  
    // + '"}'+']'

    let datapush = {"nama":data.nama,"umur":data.umur,"hubungan":data.hubungan,"pekerjaan":data.pekerjaan}
    this.serumah.push(datapush)

    let json = JSON.stringify(this.serumah)
    console.log(this.serumah)

    // let params:any = {
      this.params.code_workspace = this.data_user.code,
      this.params.username = this.data_user.username,
      this.params.data = json
      
    // }
    let a = 0
    while (a < Object.keys(this.params).length) {
      let keys = Object.keys(this.params)[a]
      let value = this.params[keys]
      if (value != null) {
        formData.append(keys, value)
      }
      a++
    }
    // console.log(data)
    this.globalService.postOrangSerumah(formData).subscribe(
      res=>{
        let result:any = res
        console.log(res)
        if(result.status){
          this.presentToast(result.message);
          console.log(result.status)
          this.getOrangSekitar()
      }
      else{
        this.presentToast(result.message);
      }
      }
    )
  }

  indexCox(data){
    this.serumah = this.serumah.filter( (item, index) => {
      if (index == data) return true
    })
  }
  
  onDelete(data){
    let formData: FormData = new FormData()

    // var stringarr= '['+'{' + 
    // '"nama"' +':"' + "" + '" ,'  +
    // '"umur"' +':"' + "" + '",'  +
    // '"hubungan"' +':"' + "" + '",' +
    // '"pekerjaan"' +':"' + ""
    // + '"}'+']'

    console.log(data)
    console.log(this.serumah)

    this.serumah.filter( (item, index) => {
      console.log(item, index)
      if (index === data) {
        this.serumah.splice(index, 1)
        return true
      }
    })

    // console.log(srumah)
    let json = JSON.stringify(this.serumah)

      this.params.code_workspace = this.data_user.code,
      this.params.username = this.data_user.username
      this.params.data = json


    let a = 0
    while (a < Object.keys(this.params).length) {
      let keys = Object.keys(this.params)[a]
      let value = this.params[keys]
      if (value != null) {
        formData.append(keys, value)
      }
      a++
    }

    this.globalService.postOrangSerumah(formData).subscribe(
      res=>{
        let result:any = res
        console.log(res)
        if(result.status){
          this.presentToast(result.message);
          console.log(result.status)
          this.getOrangSekitar()
      }
      else{
        this.presentToast(result.message);
      }
      }
    )

  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  close() {
    this.router.navigate(['home'])
  }
}
