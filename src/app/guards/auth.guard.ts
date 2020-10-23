import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
import { Location } from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, location: Location) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let userAuthenticated = false // Get the current authentication state from a Service!
    if (localStorage.getItem('status') == 'granted') {
      userAuthenticated = true
    }

    if (userAuthenticated) {
      return true
    } else {
      this.router.navigateByUrl('/login')
      /* maintenance mode*/
      // this.router.navigateByUrl('')
    }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('status') == 'granted') {
      this.router.navigateByUrl('/home')
      /* maintenance mode*/
      // this.router.navigateByUrl('')
    } else {
      return true
    }
  }
}
