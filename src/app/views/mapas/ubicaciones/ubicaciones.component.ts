import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapHeatmapLayer, MapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { WebSocketDispositivos } from 'src/app/service/WebSocketDispositivos.service';
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
import { Punto } from 'src/app/model/punto.model';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [
    GoogleMap, MapHeatmapLayer, CommonModule, MapMarker, HttpClientModule,
  ],
  templateUrl: './ubicaciones.component.html',
  styleUrl: './ubicaciones.component.scss'
})


export class UbicacionesComponent implements OnInit, OnDestroy {
  //VARIABLES
  punto_borrado:Punto = new Punto(); 
  nuevos_marcadores: google.maps.Marker[] = [];
  markador_actualizado: google.maps.Marker;
  textoBoton: string = '';
  clicks_posiciones:number = 0;
  posicionesSubscription: Subscription;
  marcadores: google.maps.Marker[] = [];
  private clickListener: google.maps.MapsEventListener | undefined;
  listadoPuntos: any[] = [];
  puntosEditar: Punto[] = [];
  dispositivos: Dispositivo[] = [];
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap | undefined;
  center: google.maps.LatLngLiteral = { lat: -2.879767894744873, lng: -78.97490692138672 };
  zoom = 13;
  clickPosition
    = { x: 0, y: 0 };
  showOptions = false;
  id_zona: number;
  private posicionSubscription: Subscription;
  posiciones: Posicion[] = [];
  zonasSeguras: Zona_segura[] = [];
  private puntos: any[] = [];
  private arrayPoligonos: google.maps.Polygon[] = [];
  mostrar_dispositivos: boolean = false;

  constructor(
    private webSocketService: WebSocketDispositivos,
    private Dispositivoservice: DipositivoService,
    private zone: NgZone,
    private http: HttpClient,
    private zonasSegurasService: Zona_seguraService,
    private posicionesService: PosicionService,
    private puntoService: PuntoService,
  ) { }

  ngOnInit(): void {
    this.posicionesSubscription = this.webSocketService.obtenerPosiciones()
      .subscribe((posiciones: any[]) => {
        this.posiciones = posiciones;
        this.listarPosiciones();
      });

    this.listarPosiciones();
    this.listarZonasSeguras();
  }

  ngOnDestroy(): void {
    if (this.posicionesSubscription) {
      this.posicionesSubscription.unsubscribe();
    }
  }

  onZonaSeguraChange(event: Event) {
    const boton = document.getElementById('boton_editar') as HTMLButtonElement;
      if (boton) {
        boton.textContent = "Editar";
        boton.innerText = "Editar";
        this.textoBoton = "Editar";
      }
      this.finalizarEdicion();
      this.nuevos_marcadores.forEach(marcador => marcador.setMap(null));
      this.nuevos_marcadores = [];
    const selectElement = event.target as HTMLSelectElement;
    const selectedZonaSeguraIdStr = selectElement.value;
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
    this.zonasSegurasService.listar().subscribe(
      (zonas: Zona_segura[]) => {
        this.zonasSeguras = zonas;
      },
      error => {
        console.error('Error al listar zonas seguras:', error);
      }
    );
  }
  // CÓDIGO PARA MOSTRAR LOS DISPOSITIVOS EN EL MAPA
  listarPosiciones() {
    this.posicionesService.listar().subscribe(
      (posiciones: Posicion[]) => {
        this.posiciones = posiciones;
        if (posiciones.length > 0) {
          posiciones.forEach((p: Posicion) => {
            this.pintarPosicion({ lat: p.latitud, lng: p.longitud }, p);
          });
        }
      },
      error => {
        console.error('Error al listar posiciones:', error);
      }
    );
  }

  private infowindows: Map<google.maps.Marker, google.maps.InfoWindow> = new Map();
  pintarPosicion(position: google.maps.LatLngLiteral, posicion: Posicion) {
    const marcador = new google.maps.Marker({
      position: position,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        strokeColor: '#f00',
        strokeWeight: 5,
        fillColor: '#000A02',
        fillOpacity: 1,
      },
      map: this.map?.googleMap || null,
    });

    // Crear contenido HTML para el infowindow
    const contenidoInfowindow = `
    <div>
      <h3>${posicion.dispositivo?.nombre}</h3>
      <p>Latitud: ${posicion.latitud}</p>
      <p>Longitud: ${posicion.longitud}</p>
      <p>: ${posicion.dentro}</p>
    </div>
  `;

    // Crear el infowindow
    const infowindow = new google.maps.InfoWindow({
      content: contenidoInfowindow,
    });

    // Asociar el marcador con el infowindow en el Map
    this.infowindows.set(marcador, infowindow);

    // Agregar evento de clic al marcador para mostrar el infowindow
    marcador.addListener('click', () => {
      // Cerrar todos los infowindows abiertos
      this.infowindows.forEach(iw => iw.close());
      // Abrir el infowindow del marcador clicado
      infowindow.open(this.map?.googleMap, marcador);
    });
  }

  deletePolygon() {
    var zona_eliminar: Zona_segura;
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
      var validar_dispositivos: Boolean = false;
      var listadispositivos: Dispositivo[] = [];
      if (result.isConfirmed) {
        // Aquí llamas a la función para eliminar la zona segura
        this.zonasSegurasService.buscar(this.id_zona).subscribe(
          (zona: Zona_segura) => {
            this.Dispositivoservice.buscarporzonasegura(this.id_zona).subscribe(
              (dispositivos: Dispositivo[]) => {
                listadispositivos = dispositivos;
                console.log('Dispositivos:', listadispositivos);
                if (zona.puntos && zona.puntos.length > 0) {
                  if (listadispositivos.length === 0) {
                    zona.puntos.forEach((punto, index) => {
                      if (punto.id_punto) {
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
                        this.arrayPoligonos.forEach(overlay => {
                          if (overlay instanceof google.maps.Polygon) {
                            overlay.setMap(null); // Elimina el polígono del mapa
                          }
                        });
                      },
                    );
                  } else {
                    Swal.fire('No se puede eliminar la zona segura', 'La zona segura tiene dispositivos asociados', 'error');
                  }
                }
              },
              error => {
                console.error('Error al listar dispositivos:', error);
              }
            );
            
          }
        );
      }
    });
  }

  crearPoligono(id: number) {
    // Asegurarse de que this.map y this.map.googleMap estén definidos
    if (this.map && this.map.googleMap) {
      const mapContainer = this.map.googleMap;
      this.zonasSegurasService.buscar(id).subscribe(
        (zona: Zona_segura) => {
          this.puntos = zona.puntos ?? [];
          if (this.puntos.length > 0) {
            // Convertir los puntos de la zona segura a vértices del polígono
            const vertices = this.puntos.map(punto => ({
              lat: punto.latitud,
              lng: punto.longitud
            }));
            // Ordenar los vértices del polígono
            const vertices_parseados: google.maps.LatLng[] = convertirALatLng(vertices);
            this.functionordenarVertices(vertices_parseados);
            // Eliminar polígonos existentes del mapa
            this.arrayPoligonos.forEach(overlay => {
              if (overlay instanceof google.maps.Polygon) {
                overlay.setMap(null);
              }
            });
            this.arrayPoligonos = [];
            // Crear el nuevo polígono
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
        error => {
          console.error('Error al buscar la zona segura', error);
        }
      );
      // Limpiar marcadores del mapa
      this.marcadores.forEach(marcador => marcador.setMap(null));
      this.marcadores = [];
    } else {
      console.error('El mapa no está inicializado correctamente.');
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

  CentrarMapa(lati: number, longi: number) {
    this.center = { lat: lati, lng: longi };
    this.zoom = 18;
  }

  //método para editar las zonas seguras
  editPolygon() {
    if(!this.id_zona){
      Swal.fire('Error', 'Seleccione una zona segura para editar', 'error');
      return;
    }else{
      //
      const boton = document.getElementById('boton_editar') as HTMLButtonElement;
      if (boton) {
        this.clicks_posiciones++;
        console.log('Clicks:', this.clicks_posiciones);
        const textoBoton = boton.textContent || boton.innerText;
        switch (textoBoton) {
          case 'Editar':
            boton.textContent = "Guardar";
            boton.innerText = "Guardar";
            this.textoBoton = "Guardar";
            this.puntosEditar = [];
            this.mostrarPuntos(this.id_zona);
            // Lógica para editar el polígono
            if(esDivisiblePorDos(this.clicks_posiciones)){
              console.log('Se dio click un numero par');
            }else{
              this.clickListener = this.map?.googleMap?.addListener('click', (event: google.maps.MapMouseEvent) => {
                if (event.latLng) {
                  if(this.nuevos_marcadores.length > 0){
                    Swal.fire('Error', 'SOLO PUEDES EDITAR UN PUNTO A LA VEZ', 'error');
                  }else{
                    const position = event.latLng.toJSON();
                    // Aquí puedes crear un nuevo marcador en la posición clicada
                    const nuevoMarcador = new google.maps.Marker({
                        position: position,
                        map: this.map?.googleMap || null,
                        // Aquí puedes personalizar el icono u otras propiedades del marcador
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            strokeColor: '#f00',
                            strokeWeight: 5,
                            fillColor: '#000A02',
                            fillOpacity: 1,
                        }
                    });
                    this.markador_actualizado = nuevoMarcador;
                    
                    // Aquí podrías guardar este nuevo marcador en un array si necesitas rastrearlos
                    // this.marcadores.push(nuevoMarcador); 
                    this.nuevos_marcadores.push(nuevoMarcador);
                    nuevoMarcador.getPosition()?.lat();
                    nuevoMarcador.getPosition()?.lng();
                  }
                    
                }
            });
            }         
            break;
          case 'Guardar':
            console.log('Se seleccionó Guardar');
            this.finalizarEdicion();
            boton.textContent = "Editar";
            boton.innerText = "Editar";
            this.textoBoton = "Editar";
            this.puntosEditar = [];
            this.nuevos_marcadores.forEach(marcador => {  });
            this.nuevos_marcadores.forEach(marcador => marcador.setMap(null));
            this.nuevos_marcadores = [];
            this.actualizarPunto();
            // Lógica para guardar el polígono
            break;
          default:
            console.log('Opción no reconocida');
            break;
        }
      } else {
        console.error('El botón editarZona no está disponible');
      }  
    }
  }

  actualizarPunto() {
    if(this.markador_actualizado){
      this.punto_borrado.latitud = this.markador_actualizado.getPosition()?.lat();
      this.punto_borrado.longitud = this.markador_actualizado.getPosition()?.lng();
      console.log('Punto a guardar:', this.punto_borrado.zonaSegura?.idZonaSegura);
      this.puntoService.actualizar(this.punto_borrado).subscribe(
        (punto: Punto) => {
          console.log('Punto guardado:', punto);
          this.puntosEditar.push(punto);
          this.actualizarMarcadorEnMapa(punto);
          this.actualizarPoligono();
          this.crearPoligono(this.id_zona);
          Swal.fire('ZONA EDITADA CORRECTAMENTE', '', 'success');
        },
        error => {
          console.error('Error al guardar el punto:', error);
        }
      );
    }else{
        Swal.fire({
          icon: 'warning',
          title: '¿Estás seguro?',
          text: '¿Realmente deseas eliminar esta el punto de zona segura?',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          var validar_dispositivos: Boolean = false;
          var listadispositivos: Dispositivo[] = [];
          if (result.isConfirmed) {
            if(this.punto_borrado.id_punto){
              this.puntoService.eliminar(this.punto_borrado.id_punto).subscribe(
                () => {
                  Swal.fire('Punto eliminado', '', 'success');
                  this.puntosEditar.forEach((punto, index) => {
                    if (punto.id_punto === this.punto_borrado.id_punto) {
                      this.puntosEditar.splice(index, 1);
                    }
                  });
                  this.actualizarPoligono();
                  this.crearPoligono(this.id_zona);
                },
                error => {
                  console.error('Error al eliminar el punto:', error);
                }
              );
            }
            // Aquí llamas a la función para eliminar la zona segura
            
          }
        });
      }
  }

  //Método para agregar un punto a la zona segura
  mostrarPuntos(id_zona:number){
    this.zonasSegurasService.buscar(id_zona).subscribe(
      (zona: Zona_segura) => {
        this.puntosEditar = zona.puntos ?? [];
        console.log('Puntos:', this.puntos);
        if (this.puntosEditar.length > 0) {
          this.puntosEditar.forEach((puntosEditar, index) => {
            this.actualizarMarcadorEnMapa(puntosEditar);
          });
        }
      },
      error => {
        console.error('Error al buscar la zona segura', error);
      }
    );
  }

  actualizarMarcadorEnMapa(position: Punto) {
    // RUTA PARA COLOCAR UN MARKADOR PERSONALIZADO
    if(position.latitud && position.longitud){
      const latLng: google.maps.LatLngLiteral = {
        lat: position.latitud,
        lng: position.longitud,
      };
      const ruta = 'https://th.bing.com/th/id/R.e6d5549d7d43ef8e34af49fed37e1196?rik=nb2KWBpNv895Bw&pid=ImgRaw&r=0';
    const marcador = new google.maps.Marker({
      position: latLng,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        strokeColor: '#f00',
        strokeWeight: 5,
        fillColor: '#000A02',
        fillOpacity: 1,
      },
      map: this.map?.googleMap || null,
    });
    // Agregar el evento click al marcador
    marcador.addListener('click', () => {
      this.eliminarMarcador(marcador,position);
    });
    this.marcadores.push(marcador); // Agregar el marcador al array
    }
  }

  eliminarMarcador(marcador: google.maps.Marker,position: Punto) {
    if(this.marcadores.length <= 3){
      Swal.fire('Error', 'No se puede eliminar mas puntos de la zona segura', 'error');
      return;
    }else{
      // Remover el marcador del mapa
      marcador.setMap(null);
        const index = this.marcadores.indexOf(marcador);
        if (index > -1) {
        this.marcadores.splice(index, 1);
      }
      //REMOVER EL PUNTO DE MI ARRAY DE PUNTOS
      const index_punto = this.puntosEditar.indexOf(position);
      this.punto_borrado = position;
      console.log('Punto a eliminar:', this.punto_borrado);
      if (index_punto > -1) {
        this.puntosEditar.splice(index_punto, 1);
      }
    // Remover el marcador del mapa
    marcador.setMap(null);
    // ACTUALIZAR EL POLÍGONO
    this.actualizarPoligono();
    }
  }

  //ACTUALIZAR EL POLÍGONO PARA LA EDICIÓN
  actualizarPoligono() {
    if (this.puntosEditar.length > 0 && this.puntosEditar) {
      const vertices = this.puntosEditar.filter(punto => punto.latitud !== undefined && punto.longitud !== undefined).map(punto => ({
          lat: punto.latitud as number,
          lng: punto.longitud as number
        }));
      const vertices_parseados: google.maps.LatLng[] = convertirALatLng(vertices);
      this.functionordenarVertices(vertices_parseados);
      //Eliminar polígonos existentes del mapa
      this.arrayPoligonos.forEach(overlay => {
        if (overlay instanceof google.maps.Polygon) {
          overlay.setMap(null);
        }
      });
      this.arrayPoligonos = [];
      // Crear el nuevo polígono
      const poligono = new google.maps.Polygon({
        paths: vertices_parseados,
        map: this.map?.googleMap,
        strokeColor: '#0F3B04',
        fillColor: '#4DE943',
        strokeWeight: 4,
      });
      this.arrayPoligonos.push(poligono);
    }
  }

  finalizarEdicion() {
  
    // Verificar si hay un listener de clic para eliminar
    if (this.clickListener) {
      // Eliminar el listener de clic del mapa
      this.clickListener.remove();
      this.clickListener = undefined; // Limpiar la variable de referencia al listener
    }
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

function esDivisiblePorDos(numero: number): boolean {
  return numero % 2 === 0;
}

