import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { globalVariable } from '../globalVariable'
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { encode } from 'punycode'
@Injectable({
  providedIn: 'root'
})
export class TransportationService {
  private url = globalVariable.url
  private headers: any
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders()
    this.headers = this.headers.set('Content-Type', 'application/json')
  }

  public generateJsonToUrlParams(json) {
    let url = Object.keys(json)
      .map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(json[k])
      })
      .join('&')
    return url
  }

  public getTypeTransportation() {
    return this.http.get(this.url + '/transportasi/getdata')
  }

  public saveDataTransport(params) {
    return this.http.post(this.url + '/saveTransportasi', params)
  }

  public getListTransport(params) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.get(this.url + '/listsenttransportasi?' + encodeParams)
  }

  public getListVoucher(params) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.get(this.url + '/listvoucher/getdata?' + encodeParams)
  }
}
