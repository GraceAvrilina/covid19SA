import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { globalVariable } from '../globalVariable'
import { map } from 'rxjs/operators';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LlsService {
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

  public getFormLls(code) {
    return this.http.get(this.url + '/api/survey/form-task?code_workspace='+ code +'&task_type=Q-LLS')
  }

  public postFormLls(postData) {
    return this.http.post(this.url + '/api/survey/postsurvey2', postData)
  }

}
