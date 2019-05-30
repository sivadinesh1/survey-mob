import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import * as socketIo from 'socket.io-client';

import socketIo from 'socket.io-client';


import { Socket } from '../shared/interfaces';

declare var io : {
  connect(url: string): Socket;
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  socket: Socket; 
  observer: Observer<number>;

  getQuotes() : Observable<number> {
    this.socket = socketIo('http://localhost:5070');

    this.socket.on('data', (res) => {
      this.observer.next(res.data);
    });

    return this.createObservable();
  }

  createObservable() : Observable<number> {
      return new Observable<number>(observer => {
        this.observer = observer;
      });
  }



}

// npm i socket.io-client