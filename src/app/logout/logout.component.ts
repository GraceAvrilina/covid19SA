import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { StorageService } from '../api/storage.service'
import { AuthService } from 'angularx-social-login'
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private storageService: StorageService, private authService: AuthService) {
    route.params.subscribe(val => {
      // put the code from `ngOnInit` here
      let tempVersion = localStorage.getItem('version')
      this.authService.signOut();
      localStorage.clear()
      alert(tempVersion)
      localStorage.setItem('version', tempVersion)
      this.storageService.clearStorage(() => {
        this.router.navigate(['/'])
      })
    })
  }

  ngOnInit() {}
}
