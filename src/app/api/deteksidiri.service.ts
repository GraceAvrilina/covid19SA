import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { globalVariable } from '../globalVariable'
import { map } from 'rxjs/operators';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DeteksidiriService {
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
  
  public getQDDInit(params,code) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.get(this.url + '/api/survey/getform2?code_workspace='+ code +'&' + encodeParams )
  }

  public getLLS(params,code) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.get(this.url + '/api/survey/getform2?code_workspace='+ code + '&'  + encodeParams )
  }

  public getHistoryAssesment(params,code) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.get(this.url + '/api/history_assesment?code_workspace=' + code + '&' + encodeParams )
  }

  public postLLS(params) {
    // console.log(params)
    return this.http.post(this.url + '/api/survey/postsurvey2', params)
  }

}
