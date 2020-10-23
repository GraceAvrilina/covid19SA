import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { globalVariable } from '../globalVariable'
import { map } from 'rxjs/operators';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private url = globalVariable.url
  private headers: any
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders()
    this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8')
  }

  public registrasi(params) {
    console.log(params)
    return this.http.post(this.url + '/api/register-mobile', params)
  }
}
