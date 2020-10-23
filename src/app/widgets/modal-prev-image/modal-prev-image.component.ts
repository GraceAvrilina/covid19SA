import { Component, HostListener, OnInit } from '@angular/core'
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-modal-prev-image',
  templateUrl: './modal-prev-image.component.html',
  styleUrls: ['./modal-prev-image.component.scss']
})
export class ModalPrevImageComponent {
  constructor(private modalCtrl: ModalController) {}
  list_img: any
  slideOpts = {
    centeredSlides: 'true'
  }
  @HostListener('document:ionBackButton', ['$event'])
  private async overrideHardwareBackAction($event: any) {
    alert()
    await this.modalCtrl.dismiss()
  }
  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss()
  }
}
