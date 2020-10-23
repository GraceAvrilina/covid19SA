import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { Helper } from "../helper";
import { ToastController } from "@ionic/angular";
import {RegisterService} from '../api/register.service'
import { ModalController } from "@ionic/angular";

import{ModalRegSuccessComponent} from '../widgets/modal-reg-success/modal-reg-success.component'
@Component({
  selector: 'app-form-registrasi',
  templateUrl: './form-registrasi.component.html',
  styleUrls: ['./form-registrasi.component.scss'],
})
export class FormRegistrasiComponent implements OnInit {
  email: string = ''
  name: string = ''
  nik: string = ''
  psswd: string = ''
  repsswd: string = ''
  public code


  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  repasswordType: string = 'password';
  repasswordIcon: string = 'eye-off';
  constructor(private router: Router,
    private toastController: ToastController,
    private modalController: ModalController,
    private regservice: RegisterService) { 
      this.code = localStorage.getItem('code')
    }

  ngOnInit() {}

  onSubmit(data){
    let helper = new Helper();
    let formData: FormData = new FormData()

    let params:any ={
      name: data.name,
      nik: data.nik,
      email: data.email,
      password: data.psswd,
      code_workspace: this.code
    }

    console.log(data)
    if(data.name == ''){
      this.presentToast("Username tidak boleh kosong");
    }

    if(data.nik == ''){
      this.presentToast("NIK tidak boleh kosong");
    }

    if(data.email == ''){
      this.presentToast("Email tidak boleh kosong");
    }

    if(data.psswd == ''){
      this.presentToast("Password tidak boleh kosong");
    }
    if(data.psswd != data.repsswd){
      this.presentToast("Password tidak sama");
    }

    
    let i = 0
    while (i < Object.keys(params).length) {
      let keys = Object.keys(params)[i]
      let value = params[keys]
      if (value != null) {
        formData.append(keys, value)
      }
      i++
    }
    
    // this.regsuccess()

      this.regservice.registrasi(formData).subscribe(
        res=>{
          let result:any = res
          console.log(res)
          if(result.status){
              this.regsuccess()
          }
          else{
            this.presentToast(result.message);
          }
        }
      )
  }
  
  close() {
    this.router.navigate(['login'])
  }

  hideShowPassword(type) {
    if(type == 'psswd'){
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }
    else{
    this.repasswordType = this.repasswordType === 'text' ? 'password' : 'text';
    this.repasswordIcon = this.repasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }
}

  async regsuccess(){
    const modal = await this.modalController.create({
      component: ModalRegSuccessComponent
      // componentProps: { value: 123 }
    });

    modal.onDidDismiss().then(res => {});

    return await modal.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
