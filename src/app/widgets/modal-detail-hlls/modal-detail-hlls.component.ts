import { Component, OnInit } from '@angular/core';
import { Platform, NavParams, ModalController } from '@ionic/angular'

@Component({
  selector: 'app-modal-detail-hlls',
  templateUrl: './modal-detail-hlls.component.html',
  styleUrls: ['./modal-detail-hlls.component.scss'],
})
export class ModalDetailHllsComponent implements OnInit {

  public item:any
  public detil

  public data:any={
    object:'',
    status:''
  }
  public data2:any={
    object:'',
    status:''
  }
  public datanya:any =[]
  constructor(
    private modalCtrl: ModalController,) { }

  ngOnInit() {
    console.log(this.item)
    // this.item.forEach(isi => {
      this.detil = this.item.detail
      this.detil.forEach((v,i) => {
        if(v.object == 'Alamat'){
          this.data.object = v.object
          this.data.status = v.status
          // this.detil.splice(i,1)
        }
      });
      this.datanya.push(this.data)

      this.detil.forEach((v,i) => {
        if(v.object == 'Kota/Kabupaten'){
          this.data2.object = v.object
          this.data2.status = v.status
          // this.detil.splice(i,1)
        }
      });
      this.datanya.push(this.data2)
      console.log(this.detil, this.datanya)
    // });
  }

  close() {
    this.modalCtrl.dismiss()
  }

}
