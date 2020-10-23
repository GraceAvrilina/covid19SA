import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { Router, NavigationExtras } from '@angular/router'
@Component({
  selector: 'app-list-sent',
  templateUrl: './list-sent.component.html',
  styleUrls: ['./list-sent.component.scss']
})
export class ListSentComponent implements OnChanges {
  @Input() data: any
  @Input() menu: any
  @Output()
  reloadData: EventEmitter<string> = new EventEmitter()
  constructor(private router: Router) {}

  ngOnChanges() {}
  navigate(item) {
    if (this.menu == 'reimburse') {
      let navigationExtras: NavigationExtras = {
        state: {
          reimbuse: item,
          type: 'sent'
        }
      }
      this.router.navigate(['home/reimburse/detail'], navigationExtras)
    } else if (this.menu == 'transport') {
      let navigationExtras: NavigationExtras = {
        state: {
          transport: item,
          type: 'sent'
        }
      }
      this.router.navigate(['home/transportation/detail'], navigationExtras)
    }
  }
}
