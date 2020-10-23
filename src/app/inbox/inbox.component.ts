import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  // public title
  // public body
  public notifikasi

  public notif:any={}

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.notifikasi = JSON.parse(localStorage.getItem('notif'))
    console.log(JSON.parse(localStorage.getItem('notif')))
    // this.title = localStorage.getItem('task')
    // this.body = localStorage.getItem('task-body')
  }

  close() {
    this.router.navigate(['home'])
  }

}
