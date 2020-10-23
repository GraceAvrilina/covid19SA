import { Component, OnInit } from '@angular/core';
import { Platform, NavParams, ModalController } from '@ionic/angular'

@Component({
  selector: 'app-modal-detail-ha',
  templateUrl: './modal-detail-ha.component.html',
  styleUrls: ['./modal-detail-ha.component.scss'],
})
export class ModalDetailHAComponent implements OnInit {
  public item:any
  public username
  public nip
  public dinas
  
  constructor(
    private modalCtrl: ModalController,) {
    this.username = localStorage.getItem('full_name')
    this.nip = localStorage.getItem('nip') 
    this.dinas = localStorage.getItem('dinas') 
   }

  ngOnInit() {
    // console.log(this.item)
  }

  close() {
    this.modalCtrl.dismiss()
  }
}
