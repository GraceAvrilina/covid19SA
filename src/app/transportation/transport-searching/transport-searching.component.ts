import { Component, OnInit } from '@angular/core'
import { TransportationService } from '../../api/transportation.service'
import { Router, NavigationExtras } from '@angular/router'
class Transport {
  constructor(
    public keyword: string = '',
    public jenis_transport: number = -1,
    public jenis_bayar: string = '',
    public tgl_kirim: string = '',
    public tgl_berangkat: string = '',
    public status: string = ''
  ) {}
}

@Component({
  selector: 'app-transport-searching',
  templateUrl: './transport-searching.component.html',
  styleUrls: ['./transport-searching.component.scss']
})
export class TransportSearchingComponent implements OnInit {
  typeTransport: any = []
  status: any = []
  transport = new Transport()
  constructor(private transportService: TransportationService, private router: Router) {
    this.status = [
      {
        value: '',
        text: 'Semua Status'
      },
      {
        value: 'waiting',
        text: 'Menunggu Persetujuan'
      },
      {
        value: 'rejected',
        text: 'Ditolak'
      },
      {
        value: 'approved',
        text: 'Disetujui'
      }
    ]
  }

  ngOnInit() {
    let obj = {
      id: 0,
      name: 'Semua Jenis Transport'
    }
    this.typeTransport.push(obj)
    this.getTypeTransport()
  }
  getTypeTransport(callback = null) {
    this.transportService.getTypeTransportation().subscribe(res => {
      let response: any = res
      if (response.status) {
        response.data.forEach(element => {
          this.typeTransport.push(element)
        })
      }
    })
  }

  onChangeType(id) {}

  search() {
    let navigationExtras: NavigationExtras = {
      state: {
        filter: this.transport
      }
    }
    this.router.navigate(['home/transportation/search/result'], navigationExtras)
  }
  reset() {
    this.transport = new Transport()
  }
  close() {
    this.router.navigate(['home/transportation'])
  }
}
