import { Component, Input } from '@angular/core'
import { Platform, NavParams, ModalController } from '@ionic/angular'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'

@Component({
  selector: 'app-modal-upload-bymedia',
  templateUrl: './modal-upload-bymedia.component.html',
  styleUrls: ['./modal-upload-bymedia.component.scss']
})
export class ModalUploadBymediaPage {
  constructor(
    navParams: NavParams,
    private platform: Platform,
    private modalCtrl: ModalController,
    private camera: Camera
  ) {
    // componentProps can also be accessed at construction time using NavParams
    this.modalCtrl.dismiss()
  }

  getCamera() {
    alert(JSON.stringify(this.camera));
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then(
      imageData => {
        alert(imageData)
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = 'data:image/jpeg;base64,' + imageData
        this.modalCtrl.dismiss(base64Image)
      },
      err => {
        // Handle error
        alert(err)
      }
    )
  }
  close() {
    this.modalCtrl.dismiss()
  }

  readUrl(event) {
    this.modalCtrl.dismiss(event)
  }
}
