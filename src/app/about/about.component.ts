import { Component, OnInit } from '@angular/core'
import { MenuController } from '@ionic/angular'
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public version: string = ''
  constructor(private menu: MenuController) {}

  ngOnInit() {
    this.version = localStorage.getItem('version')
  }
  openFirst() {
    this.menu.enable(true, 'custom')
    this.menu.close('custom')
  }
}
