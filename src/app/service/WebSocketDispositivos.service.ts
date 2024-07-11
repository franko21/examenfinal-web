import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketDispositivos {
  private stompClient: Client;
  private posicionesSubject: Subject<any> = new Subject<any>();
  private estadosSubject: Subject<any> = new Subject<any>();
  private alertasSubject: Subject<any> = new Subject<any>();
  private connected: boolean = false;

  constructor() {
    this.conectar();
  }

  public conectar(): void {
    this.stompClient = new Client({
      brokerURL: environment.websocketUrl + 'ws',
      debug: (str) => {
        //console.log(str);
      }
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Conectado: ' + frame);
      this.connected = true;

      // Suscripción a los diferentes topics
      this.stompClient.subscribe('/topic/posiciones', (message: IMessage) => {
        this.posicionesSubject.next(JSON.parse(message.body));
      });

      this.stompClient.subscribe('/topic/estados', (message: IMessage) => {
        this.estadosSubject.next(JSON.parse(message.body));
      });

      this.stompClient.subscribe('/topic/alertas', (message: IMessage) => {
        this.alertasSubject.next(JSON.parse(message.body));
      });
    };

    this.stompClient.onWebSocketClose = () => {
      console.log('Conexión cerrada. Intentando reconectar...');
      this.connected = false;
      setTimeout(() => this.conectar(), 5000);
    };

    this.stompClient.activate();
  }

  public obtenerPosiciones(): Observable<any> {
    return this.posicionesSubject.asObservable();
  }

  public obtenerEstados(): Observable<any> {
    return this.estadosSubject.asObservable();
  }

  public obtenerAlertas(): Observable<any> {
    return this.alertasSubject.asObservable();
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

  public enviarEstado(estado: any): void {
    if (this.connected) {
      this.stompClient.publish({ destination: '/app/estado', body: JSON.stringify(estado) });
    } else {
      console.error('No hay conexión activa con el servidor STOMP.');
    }
  }

  public enviarAlerta(alerta: any): void {
    if (this.connected) {
      this.stompClient.publish({ destination: '/app/alerta', body: JSON.stringify(alerta) });
    } else {
      console.error('No hay conexión activa con el servidor STOMP.');
    }
  }
  */
  
}
