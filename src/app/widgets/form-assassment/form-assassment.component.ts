import { Component, OnInit } from '@angular/core';

import {DeteksidiriService} from '../../api/deteksidiri.service'
import { count } from 'rxjs/operators';
@Component({
  selector: 'app-form-assassment',
  templateUrl: './form-assassment.component.html',
  styleUrls: ['./form-assassment.component.scss'],
})
export class FormAssassmentComponent implements OnInit {

  public dataQ
  public datanya:any = []
  public dataB:any= []
  constructor(private detekservice: DeteksidiriService) { }

  ngOnInit() {
    this.getQuestionInit()
  }

  getQuestionInit(){
    let params = {
      username: localStorage.getItem('username'),
      survey_id: '8766dfaf-eab0-1cd4-25c5-2aee4f383105',
      code: localStorage.getItem('code')
      // task_type: 'Q-DD Init'
    }
    this.detekservice.getQDDInit(params,params.code).subscribe(res=>{
      let resp: any = res
      if(resp.success){
        this.dataQ = resp.data
        this.dataQ.forEach((val, i) => {
          if(i < 12){
            let isi = val
            this.datanya.push(isi)
          }
          if(i > 12){
            this.dataB.push(val)
          }
        });        
        console.log(this.datanya)
        console.log(this.dataB)
      }
    })
  }
}
