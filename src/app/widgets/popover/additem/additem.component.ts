import { Component, OnInit } from '@angular/core'
import { PopoverController } from '@ionic/angular'
@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AdditemComponent implements OnInit {
  constructor(private popoverCtrl: PopoverController) {}

  ngOnInit() {}
  addItem() {
    this.popoverCtrl.dismiss('additem')
  }
  deleteDraft() {
    this.popoverCtrl.dismiss('delete_draft')
  }
}
