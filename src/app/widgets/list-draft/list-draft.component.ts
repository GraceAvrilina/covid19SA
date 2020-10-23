import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { Router, NavigationExtras } from '@angular/router'
@Component({
  selector: 'app-list-draft',
  templateUrl: './list-draft.component.html',
  styleUrls: ['./list-draft.component.scss']
})
export class ListDraftComponent implements OnChanges {
  private selectedItem: any

  @Input() data: any = []
  @Input() type: any
  constructor(private router: Router) {}

  ngOnChanges() {}

  navigate(item) {
    if (this.type == 'reimburse') {
      let navigationExtras: NavigationExtras = {
        state: {
          reimbuse: item,
          type: 'draft'
        }
      }
      this.router.navigate(['home/reimburse/detail'], navigationExtras)
    } else if (this.type == 'transportation') {
      let navigationExtras: NavigationExtras = {
        state: {
          transport: item,
          type: 'draft'
        }
      }
      this.router.navigate(['home/transportation/detail'], navigationExtras)
    }
  }
}
