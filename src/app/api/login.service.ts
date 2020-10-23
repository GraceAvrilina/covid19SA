import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { globalVariable } from '../globalVariable'
import { map } from 'rxjs/operators';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { GlobalService } from './global.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = globalVariable.url
  private headers: any
  constructor(private http: HttpClient,
    private globalService: GlobalService) {
    this.headers = new HttpHeaders()
    this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8')
  }

  getLogin(email, password,code) {
    let params = {}
    params['email'] = email
    params['password'] = password
    let url = this.url + '/mlogin?unique=' + email + '&password=' + password + '&code_workspace=' + code
    
    if(code == null) {
      this.globalService.getWorkspace().subscribe( data=>{
        let resp: any = data
        localStorage.setItem("code", resp.data.code)
        localStorage.getItem("code")
        console.log(localStorage.getItem("code"))
      })
      let url = this.url + '/mlogin?unique=' + email + '&password=' + password + '&code_workspace=' + localStorage.getItem("code")
      return this.http.post(url, { headers: this.headers }).pipe(map(addWorkspaceData => addWorkspaceData))
    }

    return this.http.post(url, { headers: this.headers }).pipe(map(addWorkspaceData => addWorkspaceData))
  }

  getSocmed(id,type,username,email,code){
    let url = this.url + '/mlogin/socmed?socmed_id=' + id + '&socmed_type=' + type + '&username=' +
    username + '&email=' + email + '&code_workspace=' + code

    return this.http.post(url,{headers: this.headers}).pipe(map(addWorkspaceData => addWorkspaceData))
  }
}
