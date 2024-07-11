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
  opcionSeleccionada: string = ''; 
  // VARIABLES DE ARRAYLIST PARA EDITAR LA ZONA SEGURA
  arraEditarPuntos: Punto[] = [];
  arrayNuevosPuntos:Punto[] = [];  
  EliminarPuntos: Punto[] = [];
  //VARIABLES DE ARRAYLIST PARA EDITAR LA ZONA SEGURA
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
        console.log("ESTA ENTRANDO EN EL SOCKET DE POSICIONES");
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
      this.EliminarPuntos = [];
      this.clicks_posiciones = 0;
      this.punto_borrado = {};
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
        console.log("SI TIENES POSICIONES EN LA BASE: S"+this.posiciones.length);
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
    console.log("CARGA LA POSICIÓN , PERO NO CARGA EL ÍCONO BINE LPTM");
    const marcador = new google.maps.Marker({
      position: position,
      icon: {
        url: 'assets/images/Tableta-correcto.png',
        scaledSize: new google.maps.Size(50, 50), // Ajusta el tamaño según sea necesario
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
    if(this.opcionSeleccionada === 'ELIMINAR PUNTOS' || this.opcionSeleccionada === 'AÑADIR PUNTOS' || this.opcionSeleccionada === 'EDITAR PUNTOS'){
      Swal.fire('Error', 'NO PUEDE ELIMINAR LA ZONA MIENTRAS LA EDITA', 'error');
      return;
    }else{
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
                  console.log('Cantidad de puntos:', zona.puntos?.length)
                  this.puntoService.BuscarPorZonaSegura(this.id_zona).subscribe({
                    next: (puntos: Punto[]) => {
                      zona.puntos = puntos;
                      console.log('Puntos:', puntos);
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
                              this.zonasSeguras.splice(this.zonasSeguras.findIndex(zona => zona.idZonaSegura === this.id_zona), 1);
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
                    error: (error) => {
                      console.error('Error al buscar los puntos:', error);
                    }
                  });
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
  }

  crearPoligono(id: number) {
    // Asegurarse de que this.map y this.map.googleMap estén definidos
    if (this.map && this.map.googleMap) {
      const mapContainer = this.map.googleMap;
      this.zonasSegurasService.buscar(id).subscribe(
        (zona: Zona_segura) => {
          this.puntoService.BuscarPorZonaSegura(id).subscribe({
            next: (puntos: Punto[]) => {
              this.puntos = puntos;
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
                  strokeColor: '#FF0B0B',
                  fillColor: '#16A6FF',
                  strokeWeight: 4,
                  
                });
                this.arrayPoligonos.push(poligono);
              }
            },
            error: (error) => {
              console.error('Error al buscar los puntos:', error);
            }
          });
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
    const boton = document.getElementById('boton_editar') as HTMLButtonElement;
    const textoBoton = boton.textContent || boton.innerText;
    if(!this.id_zona){
      Swal.fire('Error', 'Seleccione una zona segura para editar', 'error');
      return;
    }else{
      const boton = document.getElementById('boton_editar') as HTMLButtonElement;
      this.clicks_posiciones++;
      if(this.clicks_posiciones % 2 === 0){
      if (boton) {
        switch (textoBoton) {
          case 'Editar':
            boton.textContent = "Guardar";
            boton.innerText = "Guardar";
            this.textoBoton = "Guardar";
            // Lógica para editar el polígono
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
                  }

                }
            });      
            break;
          case 'Guardar':
            console.log(this.opcionSeleccionada);
            this.finalizarEdicion();
            boton.textContent = "Editar";
            boton.innerText = "Editar";
            this.textoBoton = "Editar";
            //this.actualizarPunto();
            // Lógica para guardar el polígono
            switch (this.opcionSeleccionada) {
              case 'EDITAR 1 PUNTO':
                Swal.fire('ESTA SEGURO DE EDITAR ESTE PUNTO', '', 'success');
                break;
                case 'ELIMINAR PUNTOS':
                  Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¿Deseas realizar los cambios?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, haz los cambios',
                    cancelButtonText: 'No, cancelar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // Código para realizar los cambios
                      this.EliminarPuntos.forEach((punto, index) => {
                        try {
                          if (punto.id_punto) {
                            this.puntoService.eliminar(punto.id_punto).subscribe(
                              () => {
                                Swal.fire('Puntos eliminados correctamente', '', 'success');
                                this.puntosEditar.forEach((puntoEditar, indexEditar) => {
                                  if (puntoEditar.id_punto === this.punto_borrado.id_punto) {
                                    this.puntosEditar.splice(indexEditar, 1);
                                  }
                                });
                                this.puntosEditar = [];
                                this.marcadores.forEach(marcador => marcador.setMap(null));
                                this.marcadores = [];
                                this.punto_borrado = {};
                                this.EliminarPuntos = [];
                                this.nuevos_marcadores = [];
                                this.crearPoligono(this.id_zona);
                                this.opcionSeleccionada = "";
                              },
                              error => {
                                Swal.fire('Error al eliminar el punto', error.message, 'error');
                              }
                            );
                          }
                        } catch (error) {
                          Swal.fire('Error en el proceso de eliminación');
                        }
                      });
                    }else if(result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop || result.dismiss === Swal.DismissReason.esc) {
                      // Código para cuando el usuario cancela
                      this.marcadores.forEach(marcador => marcador.setMap(null));
                      this.marcadores = [];
                      this.nuevos_marcadores = [];
                      this.EliminarPuntos = [];
                      this.puntosEditar = [];
                      this.crearPoligono(this.id_zona);
                    }
                  });
                
                break;
                case 'AÑADIR PUNTOS':
                  Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¿Deseas realizar los cambios?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, haz los cambios',
                    cancelButtonText: 'No, cancelar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // Código para realizar los cambios
                        if(this.arrayNuevosPuntos.length===0){
                          Swal.fire('VACÍO', 'NO HA AÑADIDO NINGÚN PUNTO A LA ZONA', 'error');
                          this.finalizarEdicion();
                          this.crearPoligono(this.id_zona);
                          this.eliminarTodosLosPuntos();
                          this.puntosEditar = [];
                          this.marcadores = [];
                          this.arrayNuevosPuntos = [];
                          this.nuevos_marcadores = [];
                          this.opcionSeleccionada = "";
                        }else{
                          this.arrayNuevosPuntos.forEach((punto, index) => {
                            this.zonasSegurasService.buscar(this.id_zona).subscribe({
                              next: (datazona) => {
                                punto.zonaSegura = datazona;
                                this.puntoService.crear(punto).subscribe(
                                  (puntoCreado: Punto) => {
                                    Swal.fire('HA AÑADIDO ',+this.arrayNuevosPuntos.length +' PUNTOS NUEVOSs', 'success');
                                    this.finalizarEdicion();
                                    this.crearPoligono(this.id_zona);
                                    this.eliminarTodosLosPuntos();
                                    this.puntosEditar = [];
                                    this.marcadores = [];
                                    this.arrayNuevosPuntos = [];
                                    this.nuevos_marcadores = [];
                                    this.opcionSeleccionada = "";
                                  },
                                  error => {
                                    Swal.fire('Error al añadir el punto', error.message, 'error');
                                  }
                                );
                              }
                            });
                            }
                          );
                        }
                      //REINICIAR LAS VARIABLES QUE USO PARA AÑADIR PUNTOS                   
                    } else if(result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop || result.dismiss === Swal.DismissReason.esc) {
                      // Código para cuando el usuario cancela
                      //REINICIAR LAS VARIABLES QUE USO PARA AÑADIR PUNTOS                      
                      this.finalizarEdicion();
                      this.crearPoligono(this.id_zona);
                      this.eliminarTodosLosPuntos();
                      this.puntosEditar = [];
                      this.marcadores = [];
                      this.arrayNuevosPuntos = [];
                      this.nuevos_marcadores = [];
                    }
                  });
                break;
            }
            break;
          default:
            console.log('Opción no reconocida');
            break;
        }
      } else {
        console.error('El botón editarZona no está disponible');
      }  
      }else{
        Swal.fire({
          title: 'Selecciona una opción',
          text: '¿Qué deseas hacer?',
          icon: 'question',
          showCancelButton: true,
          showDenyButton: true,
          showConfirmButton: false,
          //showConfirmButton: true, // Comentado para eliminar la opción de "EDITAR PUNTOS"
          //confirmButtonText: 'EDITAR PUNTOS', // Comentado para eliminar la opción de "EDITAR PUNTOS"
          denyButtonText: 'ELIMINAR PUNTOS',
          cancelButtonText: 'AÑADIR PUNTOS',
          //confirmButtonColor: '#3085d6', // Comentado ya que no se utiliza el botón de confirmación
          denyButtonColor: '#d33',
          cancelButtonColor: '#aaa'
        }).then((result) => {
          if (result.isConfirmed) {
            this.opcionSeleccionada = 'EDITAR PUNTOS';
          } else if (result.isDenied) {
            this.opcionSeleccionada = 'ELIMINAR PUNTOS';
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.opcionSeleccionada = 'AÑADIR PUNTOS';
          } else if (result.dismiss === Swal.DismissReason.backdrop || result.dismiss === Swal.DismissReason.close || result.dismiss === Swal.DismissReason.esc) {
            // El usuario cerró el modal
            console.log('El usuario cerró el modal');
            this.clicks_posiciones = 0;
            this.puntosEditar = [];
            this.marcadores = [];

          }
          // Aquí puedes programar las acciones según la opción seleccionada
          switch (this.opcionSeleccionada) {
            case 'EDITAR PUNTOS':
              // Código para editar un punto
              console.log('Editar un punto seleccionado');
              boton.textContent = "Guardar";
              boton.innerText = "Guardar";
              this.textoBoton = "Guardar";
              break;
            case 'ELIMINAR PUNTOS':
              // Código para eliminar un punto
              console.log('Eliminar un punto seleccionado');
              boton.textContent = "Guardar";
              boton.innerText = "Guardar";
              this.textoBoton = "Guardar";
              this.EliminarPuntos = [];
              this.puntosEditar = [];
              this.mostrarPuntos_Eliminar(this.id_zona);
              break;
            case 'AÑADIR PUNTOS':
              // Código para añadir un punto
              boton.textContent = "Guardar";
              boton.innerText = "Guardar";
              this.textoBoton = "Guardar";
              this.limpiar_poligonos();
              this.mostrarPuntos_Añadir(this.id_zona);
              // Lógica para editar el polígono
              this.clickListener = this.map?.googleMap?.addListener('click', (event: google.maps.MapMouseEvent) => {
                if (event.latLng) {
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
                         var puntonuevo: Punto = new Punto();
                         puntonuevo.latitud = position.lat;
                         puntonuevo.longitud = position.lng;    
                         this.arrayNuevosPuntos.push(puntonuevo);  
                         this.nuevos_marcadores.push(nuevoMarcador);
                         // Agregar el evento click al marcador
                        nuevoMarcador.addListener('click', () => {
                          this.eliminarMarcador(nuevoMarcador, puntonuevo);
                        });
                }
            }); 
              break;
            default:
              // Manejo de otras opciones si es necesario
              break;
          }
        });
      }
      // FIN DE LA VENTANA EMERGENTE
    }
  }

  //MÉTODO PARA RELACIONAR LOS PUNTOS CON LA ZONA SEGURA
  
  //Método para agregar un punto a la zona segura
  mostrarPuntos_Eliminar(id_zona:number){
    console.log("ESTAMOS ENTRANDO EN LA CARGA PARA ELIMNIAR");
    this.zonasSegurasService.buscar(id_zona).subscribe(
      (zona: Zona_segura) => {
        this.puntoService.BuscarPorZonaSegura(id_zona).subscribe({
          next: (puntos: Punto[]) => {
            this.puntosEditar = puntos;
            if (this.puntosEditar.length > 0) {
              this.puntosEditar.forEach((puntosEditar, index) => {
                this.actualizarMarcadorEnMapa_Eliminar(puntosEditar);
              });
            }
          },
          error: (error) => {
            console.error('Error al buscar los puntos:', error);
          }
        });        
      },
      error => {
        console.error('Error al buscar la zona segura', error);
      }
    );
  }

  //MOSTRAR LOS PUNTOS PARA AÑADIR MÁS PUNTOS
  mostrarPuntos_Añadir(id_zona:number){
    this.zonasSegurasService.buscar(id_zona).subscribe(
      (zona: Zona_segura) => {
        this.puntoService.BuscarPorZonaSegura(id_zona).subscribe({
          next: (puntos: Punto[]) => {
            this.puntosEditar = puntos;
            if (this.puntosEditar.length > 0) {
              this.puntosEditar.forEach((puntosEditar, index) => {
                this.actualizarMarcadorEnMapa_AñadirPunto(puntosEditar);
              });
            }
          },
          error: (error) => {
            console.error('Error al buscar los puntos:', error);
          }
        });
      },
      error => {
        console.error('Error al buscar la zona segura', error);
      }
    );
  }

  //MOSTRAR PUNTOS PARA ELIMINAR VARIOS PUNTO EXTRA
  actualizarMarcadorEnMapa_Eliminar(position: Punto) {
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
      this.eliminarMarcador_paraeliminar(marcador,position);
    });
    this.marcadores.push(marcador); // Agregar el marcador al array
    }
  }

  //MÉTODO PARA AÑADIR UN PUNTO A LA ZONA SEGURA
  actualizarMarcadorEnMapa_Añadir(position: Punto) {
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
    this.marcadores.push(marcador); // Agregar el marcador al array
    }
  }
  //ACTUALIZAR PUNTOS SIN AÑADIR UN LINSTENER
  actualizarMarcadorEnMapa_AñadirPunto(position: Punto) {
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
    this.marcadores.push(marcador); // Agregar el marcador al array
    }
  }

  eliminarMarcador_paraeliminar(marcador: google.maps.Marker,position: Punto) {
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
        console.log('Punto a eliminar:', position);
        this.EliminarPuntos.push(position);
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

  limpiar_poligonos(){
    // Eliminar polígonos existentes del mapa
    this.arrayPoligonos.forEach(overlay => {
      if (overlay instanceof google.maps.Polygon) {
        overlay.setMap(null);
      }
    });
    this.arrayPoligonos = [];
  }

  eliminarMarcador(marcador: google.maps.Marker,puntonuevo: Punto) {
    // Remover el marcador del mapa
    marcador.setMap(null);
    // Remover el marcador del array
    const index = this.marcadores.indexOf(marcador);
    if (index > -1) {
      this.marcadores.splice(index, 1);
    }
    //REMOVER EL PUNTO DE MI ARRAY DE PUNTOS
    const index_punto = this.arrayNuevosPuntos.indexOf(puntonuevo);
    if (index_punto > -1) {
      this.arrayNuevosPuntos.splice(index_punto, 1);
    }
  }

  //MÉTODO PARA ELIMINAR LOS MARKADORES QUE HA INGRESADO EL USUARIO
  eliminarTodosLosPuntos(): void {
    this.nuevos_marcadores.forEach((marker) => {
        marker.setMap(null);
    });
    this.arrayNuevosPuntos = [];
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

