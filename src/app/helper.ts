// var moment = require('moment');
export class Helper {
  /** get Location */
  public getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition)
    } else {
      let infoGeolocate = 'Geolocation is not supported by this browser.'
    }
  }
  public showPosition(position) {
    let infoGeolocate = 'Latitude: ' + position.coords.latitude + '<br>Longitude: ' + position.coords.longitude
    return position
  }

  public validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }

  public convertDateCustom(date) {
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()

    let hh = date.getHours()
    let minute = date.getMinutes()
    let sec = date.getSeconds()

    if (sec < 10) {
      sec = '0' + sec
    }

    if (minute < 10) {
      minute = '0' + minute
    }

    if (hh < 10) {
      hh = '0' + hh
    }

    if (m < 10) {
      m = '0' + m
    }
    if (d < 10) {
      d = '0' + d
    }
    return y + '-' + m + '-' + d + ' ' + hh + ':' + minute + ':' + sec
  }

  public convertMinDateCustom(date, minusdate) {
    date.setDate(date.getDate() - parseInt(minusdate))
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d: any = date.getDate()

    let hh = date.getHours()
    let minute = date.getMinutes()
    let sec = date.getSeconds()

    if (sec < 10) {
      sec = '0' + sec
    }

    if (minute < 10) {
      minute = '0' + minute
    }

    if (hh < 10) {
      hh = '0' + hh
    }

    if (m < 10) {
      m = '0' + m
    }
    if (d < 10) {
      d = '0' + d
    }
    return y + '-' + m + '-' + d + ' ' + hh + ':' + minute + ':' + sec
  }

  convertToRupiah(angka) {
    if (angka != undefined || angka != '') {
      var rupiah = ''
      var angkarev = angka
        .toString()
        .split('')
        .reverse()
        .join('')
      for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.'
      return (
        'Rp ' +
        rupiah
          .split('', rupiah.length - 1)
          .reverse()
          .join('')
      )
    } else {
      return rupiah
    }
  }

  convertToCustomNominal(angka) {
    if (angka != undefined || angka != '') {
      var nominal = ''
      var angkarev = angka
        .toString()
        .split('')
        .reverse()
        .join('')
      for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) nominal += angkarev.substr(i, 3) + '.'
      return nominal
        .split('', nominal.length - 1)
        .reverse()
        .join('')
    } else {
      return nominal
    }
  }

  getConfigLoading() {
    let config = {
      spinner: null,
      message: 'Mohon Tunggu...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
      // duration: 4000
    }
    return config
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    let extension = '.jpg'
    if (mime == 'image/png') {
      extension = '.png'
    }
    filename = filename + extension
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  extractMimeTypeFromBase64(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1]
    return mime
  }

  urltoFile(url, filename, mimeType) {
    return fetch(url)
      .then(function(res) {
        return res.arrayBuffer()
      })
      .then(function(buf) {
        return new File([buf], filename, { type: mimeType })
      })
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1])

    // separate out the mime component
    var mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length)
    var ia = new Uint8Array(ab)
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab])
    return bb
  }

  fileToBlob(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = function(evt: any) {
        resolve(evt.target.result)
      }
      reader.onerror = function() {
        reader.abort()
        reject(new DOMException('Unable to read the file.'))
      }
      reader.readAsArrayBuffer(file)
    })
  }

  tandaPemisahTitik(b) {
    let minus = false
    if (b < 0) {
      b = b * -1
      minus = true
    }

    var number_string = b.toString(),
      sisa = number_string.length % 3,
      rupiah = number_string.substr(0, sisa),
      ribuan = number_string.substr(sisa).match(/\d{3}/g)

    if (ribuan) {
      let separator = sisa ? '.' : ''
      rupiah += separator + ribuan.join('.')

      if (minus) {
        rupiah = '-' + rupiah
      }
      return rupiah
    } else {
      return number_string
    }
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date()
    b.name = fileName

    //Cast to a File() type
    return <File>theBlob
  }
}
