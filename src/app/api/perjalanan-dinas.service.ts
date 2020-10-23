import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { globalVariable } from '../globalVariable'
import { HttpHeaders } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class PerjalananDinasService {
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

  public saveData(params) {
    return this.http.post(this.url + '/saveDinasTrip', params)
  }
  public getListDinas(params) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.get(this.url + '/listDinas?' + encodeParams)
  }

  public listApprovalDinas(params) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.get(this.url + '/listApprovalDinas?' + encodeParams)
  }

  public saveStatus(postData) {
    return this.http.post(this.url + '/updateStatusDinas', postData)
  }
}
