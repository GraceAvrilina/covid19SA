import { Component, Input, OnChanges } from '@angular/core'
import { Router, NavigationExtras } from '@angular/router'
@Component({
  selector: 'app-list-sent-perjalanan-dinas',
  templateUrl: './list-sent-perjalanan-dinas.component.html',
  styleUrls: ['./list-sent-perjalanan-dinas.component.scss']
})
export class ListSentPerjalananDinasComponent implements OnChanges {
  @Input() sent: any = []
  constructor(private router: Router) {}

  ngOnChanges() {
    console.log(this.sent)
  }
  detailSent(data) {
    let navigationExtras: NavigationExtras = {
      state: {
        data: data,
        type: 'sent'
      }
    }
    this.router.navigate(['home/perjalanan-dinas/detail'], navigationExtras)
  }
}
