# IONIC-rev

Forked from <https://git.blackeye.id/covid-sa-hybrid/covid19-sa-ionic>

## Steps

### Pertama kali setelah clone

### 1.  `npm run afterdeletelock`

```bash
> npm shrinkwrap && node -e "require('fs').rename('npm-shrinkwrap.json', 'package-lock.json', function(err) { if (err) console.log(err); console.log('File successfully renamed!') })"

npm notice created a lockfile as npm-shrinkwrap.json. You should commit this file.
File successfully renamed!
```

### 2. `npm install`

```bash
> npx npm-force-resolutions
...

added 1401 packages from 1225 contributors and audited 54777 packages in 52.569s

25 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

```

### 3. Selanjutnya bisa lihat di package.json bagian script: lint, test, test:headless, build, etc

## Saat ada perubahan package.json

### 1. Jalankan kembali  `npm install`

### 2. Pastikan `npm audit` tidak ada vulnerability

### 3. Jika ada masalah, bisa lakukan

`npm audit`

misal yg bermasalah adalah package minimist:

`npm ls minimist`

lalu edit `package.json` seperti ini:

```json
"resolutions": {
    "minimist": "1.2.5"
},
```

