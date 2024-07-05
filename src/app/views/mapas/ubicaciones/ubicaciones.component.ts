import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {GoogleMap, MapHeatmapLayer, MapMarker} from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import{WebSocketDispositivos} from 'src/app/service/WebSocketDispositivos.service';
import { Subscription } from 'rxjs';
import { Zona_seguraService } from 'src/app/service/Zona_segura.service';
import { Posicion } from 'src/app/model/posicion.model';
import { HttpClient } from '@angular/common/http';
import { Dispositivo } from 'src/app/model/dispositivo.model';
import { Zona_segura } from 'src/app/model/zona_segura';
import { PosicionService } from 'src/app/service/posicion.service';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [
    GoogleMap, MapHeatmapLayer, CommonModule, MapMarker,HttpClientModule,
  ],
  templateUrl: './ubicaciones.component.html',
  styleUrl: './ubicaciones.component.scss'
})


export class UbicacionesComponent implements OnInit, OnDestroy{


  marcadores: google.maps.Marker[] = []; 
  listadoPuntos: any[] = [];
  private dispositivosSuscripcion:Subscription;
  dispositivos: Dispositivo [] = [];
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  center: google.maps.LatLngLiteral = { lat: -2.879767894744873, lng: -78.97490692138672 };
  zoom = 13;
  private posicionSubscription: Subscription;
  posiciones: Posicion[] = [];
  zonasSeguras: Zona_segura[] = [];
  private zonasSegurasSubscription: Subscription;
  private puntos: any[]=[];
  private arrayPoligonos:google.maps.Polygon[]=[];
  mostrar_dispositivos: boolean = false;

  constructor(
    private webSocketPosicion: WebSocketDispositivos,
    private zone: NgZone,
    private http: HttpClient,
    private zonasSegurasService: Zona_seguraService,
    private posicionesService:PosicionService
  ) {}

  ngOnInit(): void {
    this.listarZonasSeguras();
  }

  ngOnDestroy(): void {
    if (this.zonasSegurasSubscription) {
      this.zonasSegurasSubscription.unsubscribe();
    }
  }

  loadOtherPositionsMarkers() {
    // Obtener posiciones de otros dispositivos y agregar marcadores en el mapa
    this.listarposiciones();
    console.log(this.posiciones.length);
    const ruta = 'https://th.bing.com/th/id/R.e6d5549d7d43ef8e34af49fed37e1196?rik=nb2KWBpNv895Bw&pid=ImgRaw&r=0';
    //suscribirse al WebSocket para recibir actualización posiciones en tiempo real:
    this.posicionSubscription = this.webSocketPosicion.obtenerDispositivos().subscribe(
      (posiciones: any[]) => {
        this.posiciones = posiciones;
        // Agregar marcadores de posiciones
        this.posiciones.forEach((pos, index) => {
          const marker = new google.maps.Marker({
            position: { lat: pos.latitud, lng: pos.longitud },
            icon: {
              url: ruta,
                scaledSize: new google.maps.Size(30, 30),  // Escala del ícono
              },
            map: this.map.googleMap
          });
        });
      },
      error => {
        console.error('Error al suscribirse a las posiciones:', error);
      }
    );
  }

  listarposiciones() {
    this.dispositivosSuscripcion = this.webSocketPosicion.obtenerDispositivos().subscribe(
      (dispositivos: any[]) => {
        if (dispositivos) {
          this.dispositivos = dispositivos;
          
        }
      },
      error => {
        console.error('Error al suscribirse a los dispositivos:', error);
      }
    );
  }

  onZonaSeguraChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedZonaSeguraIdStr = selectElement.value;
    console.log('Zona segura seleccionada:', selectedZonaSeguraIdStr);
    
    // Convertir el ID de string a number
    const selectedZonaSeguraId = parseInt(selectedZonaSeguraIdStr, 10);
    console.log(selectedZonaSeguraIdStr);
    this.mostrar_dispositivos = true;
    this.crearPoligono(selectedZonaSeguraId);
    // Aquí puedes agregar lógica adicional para manejar el cambio de zona segura,
    // como actualizar la vista del mapa con nuevas posiciones u otros datos.
  }


  listarZonasSeguras() {
    this.zonasSegurasSubscription = this.zonasSegurasService.listar().subscribe(
      (zonas: Zona_segura[]) => {
        this.zonasSeguras = zonas;
      },
      error => {
        console.error('Error al listar zonas seguras:', error);
      }
    );
  }
// CÓDIGO PARA MOSTRAR LOS DISPOSITIVOS EN EL MAPA
  mostrarDispositivos() {
    console.log('Se empezó a cargar los dispositivos');
    this.posicionesService.listar().subscribe(
      (posiciones: Posicion[]) => {
        this.posiciones = posiciones;
        console.log('Posiciones:', this.posiciones);
        // Agregar marcadores de posiciones
        this.posiciones.forEach((pos, index) => {
          const marker = new google.maps.Marker({
            position: { lat: pos.latitud, lng: pos.longitud },
            map: this.map.googleMap
          });
          this.marcadores.push(marker);
        });
      },
      error => {
        console.error('Error al listar posiciones:', error);
      }
    );
    }

  crearPoligono(id:number) {
    const mapContainer = this.map.googleMap;
    if (mapContainer) {
      this.zonasSegurasService.buscar(id).subscribe(
        (zona: Zona_segura) =>{
          this.puntos = zona.puntos ?? [];
          if(this.puntos?.length > 0){
            // Convertir los puntos de la zona segura a
            const vertices = this.puntos.map(punto => ({
              lat: punto.latitud,
              lng: punto.longitud
            }));
            // Ordenar los vértices del polígono
            const vertices_parseados: google.maps.LatLng[] = convertirALatLng(vertices);
            this.functionordenarVertices(vertices_parseados);
            // Crear el polígono
            if(this.arrayPoligonos.length > 0){
              this.arrayPoligonos.forEach(overlay => {
                if (overlay instanceof google.maps.Polygon) {
                    overlay.setMap(null); // Elimina el polígono del mapa
                }
            });
            this.arrayPoligonos = [];
            }
              const poligono = new google.maps.Polygon({
                paths: vertices_parseados,
                map: mapContainer,
                strokeColor: '#0F3B04',
                fillColor: '#4DE943',
                strokeWeight: 4,
              });
              this.arrayPoligonos.push(poligono);
          }
        },
        (error ) =>{
          console.error('Error al buscar la zona segura', error);
        }
      );
      // Crear los vértices del polígono a partir de los puntos
      // Borrar los marcadores del mapa
      this.marcadores.forEach(marcador => marcador.setMap(null));
      this.marcadores = []; // Vaciar el array de marcadores
    } else {
      console.log("NO SE PUDO INICIAR LA CREACIÓN DE");
    }
  }
  
  //MÑETODO PARA ORDENAR LOS VÉRTICES DEL POLÍGONO
  functionordenarVertices(vertices: google.maps.LatLng[]): google.maps.LatLng[] {
    const centro = calcularCentroide(vertices);
    this.CentrarMapa(centro.lat(), centro.lng());
    return vertices.sort((a, b) => {
      const anguloA = calcularAngulo(centro, a);
      const anguloB = calcularAngulo(centro, b);  
      return anguloA - anguloB;
    });
  }

  CentrarMapa(lati:number, longi:number){
    this.center = { lat: lati, lng: longi };
    this.zoom = 18;
  }
}
//OBTENER EL CENTRO DE LA ZONA SEGURA
function calcularCentroide(vertices: google.maps.LatLng[]): google.maps.LatLng {
  let centroLat = 0, centroLng = 0;
  vertices.forEach(vertex => {
    centroLat += vertex.lat();
    centroLng += vertex.lng();
  });
  centroLat /= vertices.length;
  centroLng /= vertices.length;
  return new google.maps.LatLng(centroLat, centroLng);
}

// Calcula el ángulo polar de un punto con respecto al centroide
function calcularAngulo(center: google.maps.LatLng, point: google.maps.LatLng): number {
  return Math.atan2(point.lat() - center.lat(), point.lng() - center.lng());
}

function convertirALatLng(vertices: google.maps.LatLngLiteral[]): google.maps.LatLng[] {
  return vertices.map(punto => new google.maps.LatLng(punto.lat, punto.lng));
}

function boostrapApplication(App: any, arg1: { providers: any[]; }) {
  throw new Error('Function not implemented.');
}


