import { Injectable } from '@angular/core';
import { Client, IMessage  } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../enviroments/environment';


@Injectable({
  providedIn: 'root'
})

export class WebSocketDispositivos {
  private stompClient: Client;
  private posicionesSubject: Subject<any> = new Subject<any>();
  private connected: boolean = false;

  constructor() {
    this.conectar();
  }

  public conectar(): void {
    this.stompClient = new Client({
      brokerURL: environment.websocketUrl+"ws",
      debug: (str) => {
        //console.log(str);
      },
      /*
      reconnectDelay: 5000, // Opcional: configurar el tiempo de reconexión
      heartbeatIncoming: 4000, // Opcional: configurar el heartbeat entrante
      heartbeatOutgoing: 4000 // Opcional: configurar el heartbeat saliente
      */
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Conectado: ' + frame);
      this.connected = true;
      this.stompClient.subscribe('/topic/dispositivos', (message: IMessage) => {
        this.posicionesSubject.next(JSON.parse(message.body));
      });
    };

    this.stompClient.onWebSocketClose = () => {
      console.log('Conexión cerrada. Intentando reconectar...');
      this.connected = false;
      setTimeout(() => this.conectar(), 5000);
    };

    this.stompClient.activate();
  }

  public obtenerDispositivos(): Observable<any> {
    return this.posicionesSubject.asObservable();
  }

  public desconectar(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }

  /*
  public enviarPosicion(posicion: any): void {
    if (this.connected) {
      this.stompClient.publish({ destination: '/app/posicion', body: JSON.stringify(posicion) });
    } else {
      console.error('No hay conexión activa con el servidor STOMP.');
    }
  }
  */
}

