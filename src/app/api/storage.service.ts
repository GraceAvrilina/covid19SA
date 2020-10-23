import { Injectable } from '@angular/core'
import * as LocalForage from 'localforage'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  dbPromise
  constructor() {
    LocalForage.config({
      driver: LocalForage.WEBSQL, // Force WebSQL; same as using setDriver()
      name: 'myApp',
      version: 1.0,
      size: 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
      description: 'some description'
    })
  }

  saveDraft(key, data, callback) {
    LocalForage.setItem(key, data)
      .then(function() {
        callback()
      })
      .then(function(value) {
        // we got our value
      })
      .catch(function(err) {
        // we got an error
      })
  }

  getDraft(key, callback) {
    LocalForage.getItem(key)
      .then(function(value) {
        // This code runs once the value has been loaded
        // from the offline store.
        callback(value)
      })
      .catch(function(err) {
        // This code runs if there were any errors
        console.log(err)
      })
  }
  clearStorage(callback){
    LocalForage.clear().then(function() {
      callback()
    })
    .then(function(value) {
      // we got our value
    })
    .catch(function(err) {
      // we got an error
    })
  }
}
