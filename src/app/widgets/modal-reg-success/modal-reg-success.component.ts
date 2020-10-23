import { Component, OnInit } from '@angular/core';
import { Platform, NavParams, ModalController } from '@ionic/angular'

import { Router, ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-modal-reg-success',
  templateUrl: './modal-reg-success.component.html',
  styleUrls: ['./modal-reg-success.component.scss'],
})
export class ModalRegSuccessComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private router: Router) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss()
    this.router.navigate(['login'])
  }
}
