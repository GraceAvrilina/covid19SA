import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { globalVariable } from '../globalVariable'
import { HttpHeaders } from '@angular/common/http'
import * as localforage  from 'localforage'
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private url = globalVariable.url
  private headers: any
  private alias = 'ionica'
  private code:any={}
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

  public getListLeader(params) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.get(this.url + '/getleader?' + encodeParams, { headers: this.headers })
  }

  public getListApproval(params) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.get(this.url + '/listApproval?' + encodeParams)
  }

  public changeStatus(data) {
    return this.http.post(this.url + '/updateStatus', data)
  }

  public getDataUser(username,code) {
    return this.http.get(this.url + '/api/user_covid19_status?code_workspace='+ code +'&username=' + username)
  }

  public getDataProfile(username,code) {
    return this.http.get(this.url + '/api/data-profile?code_workspace='+ code +'&user_name=' + username )
  }

  public getDivisi(code){
    return this.http.get(this.url + '/api/get-divisi?code_workspace=' + code )
  }

  public getKantor(code){
    return this.http.get(this.url + '/api/get-kantor?code_workspace=' + code )
  }

  public getSnK(){
    return this.http.get(this.url + '/api/terms-of-service?code_workspace=covid19ws_ebdesk_dev' )
  }

  public NoDar(){
    return this.http.get(this.url + '/api/user-emergency-phone' )
  }

  public editProfile(params) {
    // console.log(params)
    return this.http.post(this.url + 'api/edit-profile', params)
  }

  public updateProfile(params, data) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.post(this.url + '/user/editprofile/' + params.user_name + '?' + encodeParams, data)
  }
  public updateAvatar(username, email, data) {
    return this.http.post(this.url + '/user/updateavatar/' + username + '/' + email + '', data)
  }
  public changePassword(params, username) {
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.post(this.url + '/user/changepassword/' + username + '?' + encodeParams, encodeParams)
  }
  public forgetPassword(data) {
    return this.http.post(this.url + '/mresetpassword', data)
  }
  public getListBendera() {
    return this.http.get(this.url + '/listbendera/getdata')
  }
  public getTypeActivity(keyword) {
    return this.http.get(this.url + '/jenisactivity/getdata/?params=' + keyword)
  }
  public getNameActivity(keyword, type) {
    return this.http.get(this.url + '/getActivity?params=' + keyword + '&type=' + type + '&startPage=0' + '&endPage=10')
  }

  public getRsRujukan(keyword,code) {
    return this.http.get(this.url + 'api/get-rs-rujukan?code_workspace='+ code +'&keyword=' + keyword )
  }

  public getConfigMinDate() {
    return this.http.get(this.url + '/getbackdate')
  }
  public getUnit(keyword) {
    return this.http.get(this.url + '/getUnit?params=' + keyword)
  }

  public getBubleApprovalPD(username) {
    return this.http.get(this.url + '/bubleDinas?username=' + username)
  }

  public getFaq(code){
    return this.http.get(this.url + '/api/faq?languange=ID&code_workspace=' + code)
  }

  public getTips(code){
    return this.http.get(this.url + '/api/tips_trick?code_workspace='+ code +'&start=0&rows=10')
  }

  public getGlosarium(params,code){
    let encodeParams = this.generateJsonToUrlParams(params)
    return this.http.get(this.url + '/api/glosarium?code_workspace='+ code + '&' + encodeParams)
  }

  public checkVersion() {
    return this.http.get(this.url + '/checkVersion')
  }

  public getOrangSerumah(username,code){
    return this.http.get(this.url + 'api/get-orang-serumah?code_workspace='+ code +'&username=' + username)
  }

  public postOrangSerumah(params){
    return this.http.post(this.url + 'api/identitas-orang-serumah', params)
  }

  public getWorkspace(){
    return this.http.get(this.url + 'api/workspace_by_alias?alias=' + this.getAlias() )
  }

  private getAlias(){
    var str = location.hostname; 
    var splitted = str.split(".", 1); 
    console.log(splitted[0])
    return splitted
  }
}
