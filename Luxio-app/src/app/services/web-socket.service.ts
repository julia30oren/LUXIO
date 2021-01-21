import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
// import * as Observable from 'rxjs/Observable';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect(`http://localhost:3000`);
  }

  listen(eventneme: string): Observable<any> {
    return new Observable((subscribe) => {
      this.socket.on(eventneme, (date) => {
        subscribe.next(date);
      })
    })
  }

  emit(eventneme: string, date: any) {
    this.socket.emit(eventneme, date);
  }
}
