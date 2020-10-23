import { NgModule } from '@angular/core'
import { FormatRupiahPipe } from './format-rupiah.pipe'
import { FormatTanggalPipe } from './format-tanggal.pipe'
import { FormatNumberPipe } from './format-number.pipe'
import {CustomDateIndoPipe} from './custom-date-indo.pipe'
@NgModule({
  declarations: [FormatRupiahPipe, FormatTanggalPipe, FormatNumberPipe, CustomDateIndoPipe],
  imports: [],
  exports: [FormatRupiahPipe, FormatTanggalPipe, FormatNumberPipe, CustomDateIndoPipe]
})
export class PipesModule {}
