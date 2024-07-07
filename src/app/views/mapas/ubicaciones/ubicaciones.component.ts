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
import Swal from 'sweetalert2';
import { PuntoService } from 'src/app/service/Punto.service';
import { DipositivoService } from 'src/app/service/dispositivo.service';

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

editPolygon() {
throw new Error('Method not implemented.');
}


  marcadores: google.maps.Marker[] = []; 
  listadoPuntos: any[] = [];
  private dispositivosSuscripcion:Subscription;
  dispositivos: Dispositivo [] = [];
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  center: google.maps.LatLngLiteral = { lat: -2.879767894744873, lng: -78.97490692138672 };
  zoom = 13;
  clickPosition
   = { x: 0, y: 0 };
  showOptions = false;
  id_zona:number;
  private posicionSubscription: Subscription;
  posiciones: Posicion[] = [];
  zonasSeguras: Zona_segura[] = [];
  private zonasSegurasSubscription: Subscription;
  private puntos: any[]=[];
  private arrayPoligonos:google.maps.Polygon[]=[];
  mostrar_dispositivos: boolean = false;

  constructor(
    private webSocketPosicion: WebSocketDispositivos,
    private Dispositivoservice: DipositivoService,
    private zone: NgZone,
    private http: HttpClient,
    private zonasSegurasService: Zona_seguraService,
    private posicionesService:PosicionService,
    private puntoService: PuntoService,
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
    this.showOptions = true;

    
    // Convertir el ID de string a number
    const selectedZonaSeguraId = parseInt(selectedZonaSeguraIdStr, 10);
    this.id_zona = selectedZonaSeguraId;
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
    const mapContainer = this.map.googleMap;
    this.posicionesService.listar().subscribe(
      (posiciones: Posicion[]) => {
        this.posiciones = posiciones;
        console.log('Posiciones:', this.posiciones);
        // Agregar marcadores de posiciones
        this.posiciones.forEach((pos, index) => {
          const punto = {
            lat: pos.latitud,
            lng: pos.longitud
          };  
          const marcador = new google.maps.Marker({
            position: punto,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              strokeColor: '#f00',
              strokeWeight: 5,
              fillColor: '#000A02',
              fillOpacity: 1,
            },
            map:mapContainer,
          });
          this.marcadores.push(marcador);
        });
      },
      error => {
        console.error('Error al listar posiciones:', error);
      }
    );
  }

  deletePolygon() {
    var zona_eliminar:Zona_segura;
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: '¿Realmente deseas eliminar esta zona segura?',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      var validar_dispositivos:Boolean = false;
      var listadispositivos:Dispositivo[] = [];
      if (result.isConfirmed) {
        // Aquí llamas a la función para eliminar la zona segura
        this.zonasSegurasService.buscar(this.id_zona).subscribe(
          (zona: Zona_segura) =>{
            this.Dispositivoservice.buscarporzonasegura(this.id_zona).subscribe(
              (dispositivos: Dispositivo[]) => {
                listadispositivos = dispositivos;
                console.log('Dispositivos:', listadispositivos);
              },
              error => {
                console.error('Error al listar dispositivos:', error);
              }
            );
            console.log('DISPOSITIVOS', listadispositivos.length);
            if(zona.puntos && zona.puntos.length > 0){
              if(listadispositivos.length === 0){
                zona.puntos.forEach((punto, index) => {
                  if(punto.id_punto){
                    console.log('Punto a eliminar:', punto);
                    this.puntoService.eliminar(punto.id_punto).subscribe(
                      () => {
                        console.log('Punto eliminado:', punto);
                      },
                      error => {
                        console.error('Error al eliminar el punto:', error);
                      }
                    );
                  }  
                });
                this.zonasSegurasService.eliminar(this.id_zona).subscribe(
                  () => {
                    Swal.fire('Zona segura eliminada', '', 'success');
                  },
                );
              }else{
                console.log('No se puede eliminar la zona segura: ', zona.dispositivos?.length);
                Swal.fire('No se puede eliminar la zona segura', 'La zona segura tiene dispositivos asociados', 'error');
              }
            }  
          }
        );
      } 
      this.arrayPoligonos.forEach(overlay => {
        if (overlay instanceof google.maps.Polygon) {
            overlay.setMap(null); // Elimina el polígono del mapa
        }
    });
    });
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


