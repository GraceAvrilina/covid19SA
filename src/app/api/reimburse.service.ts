import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { globalVariable } from '../globalVariable'
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class ReimburseService {
  private url = globalVariable.url
  private headers: any
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders()
    this.headers = this.headers.set('Content-Type', 'application/json; charset=utf-8')
  }

  public generateJsonToUrlParams(json) {
    let url = Object.keys(json)
      .map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(json[k])
      })
      .join('&')
    return url
  }

  getTypeReimburse() {
    return this.http.get(this.url + '/reimburse/getdata')
  }

  saveReimburse(data) {
    return this.http.post(this.url + '/saveReimburse', data)
  }

  getDataReimburse(data) {
    let encodeParams = this.generateJsonToUrlParams(data)
    return this.http.get(this.url + '/listsentreimburse?' + encodeParams)
  }
}
