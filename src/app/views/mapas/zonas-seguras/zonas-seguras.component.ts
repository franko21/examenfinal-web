import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Zona_segura } from "src/app/model/zona_segura";
import {GoogleMap, MapHeatmapLayer, MapMarker} from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { PuntoService } from 'src/app/service/Punto.service';
import Swal from 'sweetalert2';
import { Zona_seguraService } from 'src/app/service/Zona_segura.service';

@Component({
  selector: 'app-zonas-seguras',
  standalone: true,
  imports: [
    GoogleMap, MapHeatmapLayer, CommonModule, MapMarker,HttpClientModule,
  ],
  providers: [PuntoService,Zona_seguraService],
  templateUrl: './zonas-seguras.component.html',
  styleUrl: './zonas-seguras.component.scss'
})
export class ZonasSegurasComponent{
  //CONSTRUCTOR PARA LOS SERVICIOS
  constructor(
    private puntoService: PuntoService,
    private zonaService: Zona_seguraService,
    private zone: NgZone
  ) {}
  
  marcadores: google.maps.Marker[] = []; 
  selectedPolygon: google.maps.Polygon | null = null;
  private arrayPoligonos:google.maps.Polygon[]=[];
  //VARIABLES PARA LOS MÉTODOS DE GOOGLE MAPS
  center: google.maps.LatLngLiteral = { lat: -2.879767894744873, lng: -78.97490692138672 };
  zoom = 13;
  showOptions = false;
  clickPosition = { x: 0, y: 0 };
  marker: google.maps.Marker | null = null;
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  lastClickedPosition: google.maps.LatLngLiteral | null = null;
  listadoPuntos: any[] = [];
  //ELEMENTO PARA BUSCAR DIRECCIONES
  @ViewChild('autocomplete', { static: false }) input: ElementRef ;
  autocomplete: google.maps.places.Autocomplete | undefined;
  @ViewChild('map-container', { static: true }) mapElementRef!: ElementRef;
  //ELEMENTO PARA BUSCAR DIRECCIONES

  //MÉTODO PARA INICIALIZAR EL BUSCADOR DEL MAPA
  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.InitCompletado();
      this.Cargar_Zonas();
    });
  }

  //MÉTODO PARA AGREGAR UN MARCADOR EN EL MAPA
  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const position = event.latLng.toJSON();
      this.lastClickedPosition = position;
      const punto = {
        latitud: this.lastClickedPosition.lat,
        longitud: this.lastClickedPosition.lng
      };  
      this.listadoPuntos.push(punto);
      this.actualizarMarcadorEnMapa(position);
      
    }
  }

  //MÉTODO PARA ACTUALIZAR EL MARCADOR EN EL MAPA
  actualizarMarcadorEnMapa(position: google.maps.LatLngLiteral) {
    // RUTA PARA COLOCAR UN MARKADOR PERSONALIZADO
    const ruta = 'https://th.bing.com/th/id/R.e6d5549d7d43ef8e34af49fed37e1196?rik=nb2KWBpNv895Bw&pid=ImgRaw&r=0';
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
    // Agregar el evento click al marcador
    marcador.addListener('click', () => {
      this.eliminarMarcador(marcador);
    });
    this.marcadores.push(marcador); // Agregar el marcador al array
  }

  Cargar_Zonas(){
    //INICIAR LA CARGA DE ZONAS SEGURAS
    const mapContainer = this.map.googleMap;
    if(!mapContainer){
      console.log("NO SE PUDO INICIAR LA CARGA DE ZONAS SEGURAS");
    }else{
      this.zonaService.listar().subscribe({
        next: (data) => {
          data.forEach((zona: Zona_segura) => {
            if (zona.puntos && zona.puntos.length > 0) {
              const vertices = zona.puntos
              .filter(punto => punto.latitud !== undefined && punto.longitud !== undefined)
              .map(punto => ({
              lat: punto.latitud!,
              lng: punto.longitud!
              }));  
          
              // Convierte los vértices a `google.maps.LatLng`
              const vertices_parseados: google.maps.LatLng[] = convertirALatLng(vertices);
              this.functionordenarVertices(vertices_parseados);
              // Crear el polígono
              const poligono = new google.maps.Polygon({
                paths: vertices_parseados,
                map: mapContainer,
                strokeColor: '#759192',
                fillColor: '#92afb0',
                strokeWeight: 4,
              });
              this.arrayPoligonos.push(poligono);
            } else {
              console.warn('Zona sin puntos o puntos no definidos:', zona);
            }
          });
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  ingresarZona() {
    // Validación para que una zona tenga mínimo 3 puntos
    if (this.listadoPuntos.length < 3) {
      Swal.fire({
        icon: 'error',
        title: 'Error al ingresar la zona segura',
        text: 'DEBES SELECCIONAR POR LO MENOS 3 PUNTOS EN EL MAPA.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    } else {
      // Pedir el nombre de la zona segura
      Swal.fire({
        title: 'Ingrese el nombre de la zona segura',
        input: 'text',
        inputPlaceholder: 'Nombre de la zona segura',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        showLoaderOnConfirm: true,
        preConfirm: (zoneName) => {
          if (!zoneName) {
            Swal.showValidationMessage('Debe ingresar un nombre para la zona segura');
          }
          return zoneName;
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          const zoneName = result.value;
          const zona = new Zona_segura();
          zona.descripcion = zoneName;
          this.zonaService.crear(zona).subscribe({
            next: (data) => {
              console.log(data.idZonaSegura);
              this.listadoPuntos.forEach(punto => {
                punto.zonaSegura = data;
                data.puntos?.push(punto);
              });
              if(data.idZonaSegura){
                this.IngresarPuntos(data.idZonaSegura);
              }
              Swal.fire({
                icon: 'success',
                title: 'Zona segura ingresada correctamente',
                text: `Nombre de la zona segura: ${zoneName}`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              });
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Error al ingresar la zona segura',
                text: err.message || 'Ocurrió un error desconocido.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
              });
            }
          });
        }
      });
    }
  }

  crearPoligono() {
    const mapContainer = this.map.googleMap;
    if (mapContainer) {
      console.log("SE INICIO LA CREACIÓN DE");
      // Crear los vértices del polígono a partir de los puntos
      const vertices = this.listadoPuntos.map(punto => ({
        lat: punto.latitud,
        lng: punto.longitud
      }));
      const vertices_parseados: google.maps.LatLng[] = convertirALatLng(vertices);
      this.functionordenarVertices(vertices_parseados);
      // Crear el polígono
      const poligono = new google.maps.Polygon({
        paths: vertices_parseados,
        map: mapContainer,
        strokeColor: '#759192',
        fillColor: '#92afb0',
        strokeWeight: 4,
      });
      // Borrar los marcadores del mapa
      this.marcadores.forEach(marcador => marcador.setMap(null));
      this.marcadores = []; // Vaciar el array de marcadores
  
    } else {
      console.log("NO SE PUDO INICIAR LA CREACIÓN DE");
    }
  }

  IngresarPuntos(id_zona:number) {
    let puntosIngresadosCorrectamente = true;
    let contadorPuntosIngresados = 0;
      this.listadoPuntos.forEach(punto => {
        this.puntoService.crear(punto).subscribe({
          next: (data) => {
            this.zonaService.buscar(id_zona).subscribe({
              next: (datazona) => {
                datazona.puntos?.push(data);
                this.zonaService.editar(datazona);
              }
            }
            );
            contadorPuntosIngresados++;
            if (contadorPuntosIngresados === this.listadoPuntos.length && puntosIngresadosCorrectamente) {
              console.log('Todos los puntos fueron ingresados correctamente en la base de datos');
              this.crearPoligono();
            }
          },
          error: (err) => {
            console.error(err);
            puntosIngresadosCorrectamente = false;
          }
        });
      });
      //VALIDAR SI TODOS LOS PUNTOS FUERON INGRESADOS CORRECTAMENTE
      
    }
    //MÉTODO PARA INICIALIZAR EL BUSCADOR DE DIRECCIONES
    private InitCompletado(): void {
      if (this.input) {
        console.log('CARGA DE DIRECCIONES INICIADA');
        this.autocomplete = new google.maps.places.Autocomplete(this.input.nativeElement, {
          types: ['address'],
          componentRestrictions: { country: 'EC' },
          fields: ['place_id', 'geometry', 'name']
        });
  
        this.autocomplete.addListener('place_changed', () => {
          this.CambiarLugar();
        });
      }

    }

    CambiarLugar(): void {
      if (this.autocomplete) {
        const place = this.autocomplete.getPlace();
        if (!place.geometry) {
          // Manejar lugar inválido
          this.input.nativeElement.placeholder = 'Ingrese una dirección válida';
        } else {
          const detailsElement = document.getElementById('details');
          if (detailsElement) {
            detailsElement.innerHTML = place.name || 'Dirección sin nombre';
          }
          if (place.geometry.location) {
            this.map.googleMap!.setCenter(place.geometry.location);
            this.map.googleMap!.setZoom(17);
            console.log(place.name);
            
            // Actualizar marcador en la nueva ubicación
            this.actualizarMarcadorEnMapa({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });
          }
        }
      }
    }
//FUNCION PARA ORDENAR LOS VERTICES DEL POLIGONO
functionordenarVertices(vertices: google.maps.LatLng[]): google.maps.LatLng[] {
  const centro = calcularCentroide(vertices);
  
  return vertices.sort((a, b) => {
    const anguloA = calcularAngulo(centro, a);
    const anguloB = calcularAngulo(centro, b);  
    return anguloA - anguloB;
  });


}

editPolygon() {
    if (this.selectedPolygon) {
      // Implementa la lógica para editar el polígono
    }
  }

  deletePolygon() {
    if (this.selectedPolygon) {
      this.selectedPolygon.setMap(null);
      this.arrayPoligonos = this.arrayPoligonos.filter(p => p !== this.selectedPolygon);
      this.selectedPolygon = null;
      this.showOptions = false;
    }
  }
  
  //MÉTODO PARA MANEJAR EL EVENTO DE CLIC EN UN POLÍGONO
  eliminarMarcador(marcador: google.maps.Marker) {
    // Remover el marcador del mapa
    marcador.setMap(null);
  
    // Remover el marcador del array
    const index = this.marcadores.indexOf(marcador);
    if (index > -1) {
      this.marcadores.splice(index, 1);
    }
  }

}
//FUNCION PARA CALCULAR EL CENTROIDE
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
//funcion para calcular el angulo
function calcularAngulo(center: google.maps.LatLng, point: google.maps.LatLng): number {
  return Math.atan2(point.lat() - center.lat(), point.lng() - center.lng());
}
//funcion para convertir a latitud y longitud
function convertirALatLng(vertices: google.maps.LatLngLiteral[]): google.maps.LatLng[] {
  return vertices.map(punto => new google.maps.LatLng(punto.lat, punto.lng));
}


