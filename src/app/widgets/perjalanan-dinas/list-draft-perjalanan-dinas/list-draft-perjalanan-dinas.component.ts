import { Component, Input, OnChanges } from '@angular/core'
import { Router, NavigationExtras } from '@angular/router'
@Component({
  selector: 'app-list-draft-perjalanan-dinas',
  templateUrl: './list-draft-perjalanan-dinas.component.html',
  styleUrls: ['./list-draft-perjalanan-dinas.component.scss']
})
export class ListDraftPerjalananDinasComponent implements OnChanges {
  constructor(private router: Router) {}
  @Input() draft: any = []
  ngOnChanges() {
    console.log(this.draft)
  }

  detailDraft(data) {
    let navigationExtras: NavigationExtras = {
      state: {
        data: data,
        type: 'draft'
      }
    }
    this.router.navigate(['home/perjalanan-dinas/detail'], navigationExtras)
  }
}
