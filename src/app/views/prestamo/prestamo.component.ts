import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component,NgModule,OnInit } from '@angular/core';
import{Prestamo} from '../../model/prestamo';
import{PrestamoService} from '../../service/prestamo.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonaService } from 'src/app/service/persona.service';
import { DipositivoService } from 'src/app/service/dispositivo.service';
import { Persona } from 'src/app/model/persona';
import { Zona_seguraService } from 'src/app/service/zona_segura.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Zona_segura } from 'src/app/model/Zona_segura';
import { Dipositivo } from 'src/app/model/dispositivo.model';
import { Usuario } from 'src/app/model/usuario';
import { environment } from 'src/enviroments/environment';
import { NgxPaginationModule } from 'ngx-pagination';




@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [NgFor,HttpClientModule,NgIf,ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective,ReactiveFormsModule,HttpClientModule,NgxPaginationModule],
  providers:[PrestamoService,PersonaService,Zona_seguraService,DipositivoService,UsuarioService,DatePipe],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {
  selectedPrestamo: any;
  mostrarFormularioIngreso = false;
  prestamos:Prestamo[]=[];
  personas:Persona[]=[];
  zonaS:Zona_segura[]=[];
  dispositivos:Dipositivo[]=[];
  prestamoSeleccionado: any = {};
  filaEditada: number | null = null;
  registerForm: FormGroup;
  registerFormIn: FormGroup;
  usuario:Usuario;
  idusu:number;
  p: number = 1; // Página actual para la paginación
  constructor(private datePipe:DatePipe,private usuarioService:UsuarioService, private dispoService:DipositivoService, private personaService:PersonaService,private prestamoService: PrestamoService,private router:Router,private fb:FormBuilder,private zonasService:Zona_seguraService){
    this.registerForm = this.fb.group({
      beneficiario: [''],
      dispositivo: [''],
      zona_segura: [''],
      fecha: [''],
      motivo: [''],
      finalizado: [''],
      estado_devolucion:[''],
      // Otros campos del formulario
    });
    this.registerFormIn = this.fb.group({
      beneficiario: [''],
      dispositivo: [''],
      zona_segura: [''],
      fecha: [''],
      motivo: [''],
    });
  }

  ngOnInit():void {
    this.usuarioService.getUsuarioByUsername(environment.username).subscribe(
      usu=>{
        this.idusu=usu.id_usuario;
      }
    )
    this.prestamoService.getPrestamos().subscribe(
      prestamo => {
        this.prestamos = prestamo;
      }
    );
    this.personaService.getPersonas().subscribe(
      persona=>{
        this.personas=persona;
      }
    )
    this.zonasService.listar().subscribe(
      zona=>{
        this.zonaS=zona;
      }
    )
    this.dispoService.listar().subscribe(
      dipo=>{
        this.dispositivos=dipo;
      }
    )
  }
  ingresarPrestamo(){
    this.mostrarFormularioIngreso = !this.mostrarFormularioIngreso;
    console.log(this.dispositivos);

  }
  edit(index: number) {
    this.selectedPrestamo = this.prestamos[index];
    console.log(this.selectedPrestamo.fecha_finalizacion);
    console.log(this.formatDate(this.selectedPrestamo.fecha_finalizacion));
    this.filaEditada = index;
    const prestamoSeleccionado = this.prestamos[index]; // Suponiendo que prestamos es el array de datos
    this.registerForm.patchValue({
      beneficiario: prestamoSeleccionado.persona.id_persona,
      dispositivo: prestamoSeleccionado.dispositivo.id_dispositivo,
      zona_segura:prestamoSeleccionado.zona_segura.id_zona_segura,
      estado_devolucion:prestamoSeleccionado.estado_devolucion,
      fecha: this.formatDate(this.selectedPrestamo.fecha_finalizacion),
      motivo: prestamoSeleccionado.motivo_prestamo,
      finalizado: prestamoSeleccionado.finalizado,
      // Ajusta el resto de los campos según sea necesario
    });
  }
  formatTime(time:any) {
    var hours = Math.floor(time);
    var minutes = Math.round((time - hours) * 60);
    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);
  }
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
  onSubmit2(){
    console.log(this.idusu);
    const fecha=new Date();
    const formValues=this.registerFormIn.value;
    let prestamo:Prestamo=new Prestamo();
    let dispositivoo:Dipositivo=new Dipositivo();
    prestamo.dispositivo=dispositivoo;
    let personaa:Persona=new Persona();
    prestamo.persona=personaa;
    let zona_seguraa:Zona_segura=new Zona_segura();
    prestamo.zona_segura=zona_seguraa;
    let usuarioo:Usuario=new Usuario();
    // prestamo.usuario=usuarioo;

    prestamo.dispositivo.id_dispositivo=formValues.dispositivo;
    prestamo.persona.id_persona=formValues.beneficiario;
    prestamo.zona_segura.id_zona_segura=formValues.zona_segura;
    prestamo.fecha_finalizacion=formValues.fecha;
    prestamo.motivo_prestamo=formValues.motivo;
    // prestamo.usuario.id_usuario=this.idusu;
    prestamo.fecha_prestamo=fecha;
    prestamo.hora_prestamo=this.convertirHoraADouble(fecha);
    this.prestamoService.crearPrestamo(prestamo).subscribe({
      next:(userData)=>{
        console.log('Datos de prestamo recibidos:', userData);
        this.prestamoService.getPrestamos().subscribe(
          prestamo => {
            this.prestamos = prestamo;
          }
        );
        Swal.fire({
          icon: 'success',
          title: '¡Creacion de prestamo exitosa!',
          text: 'EXITO',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
      })
      },
      error:(errorData)=>{
        console.error('Error al crear prestamo:', errorData);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear prestamo',
          text: 'Error al ingresar los datos.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
      });
      },
      complete:()=>{
        console.info("Creacion completa");
      }
    })
  }
  convertirHoraADouble(fecha: Date): number {
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
    return horas + (minutos / 60) + (segundos / 3600);
  }
  onSubmit(){
    console.log(this.idusu);
    const fecha=new Date();
    const formValues=this.registerForm.value;
    let prestamo:Prestamo=new Prestamo();
    let dispositivoo:Dipositivo=new Dipositivo();
    prestamo.dispositivo=dispositivoo;
    let personaa:Persona=new Persona();
    prestamo.persona=personaa;
    let zona_seguraa:Zona_segura=new Zona_segura();
    prestamo.zona_segura=zona_seguraa;
    let usuarioo:Usuario=new Usuario();
    // prestamo.usuario=usuarioo;

    prestamo.dispositivo.id_dispositivo=formValues.dispositivo;
    prestamo.persona.id_persona=formValues.beneficiario;
    prestamo.zona_segura.id_zona_segura=formValues.zona_segura;
    prestamo.fecha_finalizacion=formValues.fecha;
    prestamo.motivo_prestamo=formValues.motivo;
    prestamo.estado_devolucion=formValues.estado_devolucion;
    prestamo.finalizado=formValues.finalizado;
    // prestamo.usuario.id_usuario=this.idusu;
    this.prestamoService.editPrestamo(this.selectedPrestamo.id_prestamo,prestamo).subscribe({
      next:(userData)=>{
        console.log('Datos de prestamo recibidos:', userData);
        this.prestamoService.getPrestamos().subscribe(
          prestamo => {
            this.prestamos = prestamo;
          }
        );
        Swal.fire({
          icon: 'success',
          title: '¡Edicion de prestamo exitosa!',
          text: 'EXITO',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
      })
      },
      error:(errorData)=>{
        console.error('Error al editar prestamo:', errorData);
        Swal.fire({
          icon: 'error',
          title: 'Error al edita prestamo',
          text: 'Error al ingresar los datos.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
      });
      },
      complete:()=>{
        console.info("Edicion completa");
      }
    })
  }
  cancelarEdicion() {
    this.filaEditada = null;
  }
  eliminarPrestamo(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
  
    swalWithBootstrapButtons.fire({
      title: 'Estas Seguro?',
      text: 'No se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.prestamoService.deletePrestamo(id).subscribe(
          () => {
            this.prestamoService.getPrestamos().subscribe(
              prestamo => {
                this.prestamos = prestamo;
              }
            );
            swalWithBootstrapButtons.fire({
              title: 'BORRADO!',
              text: 'El prestamo ah sido borrado.',
              icon: 'success'
            });
          },
          error => {
            console.error('Error al eliminar el prestamo', error);
            swalWithBootstrapButtons.fire({
              title: 'Error',
              text: 'Ah habido un error al eliminar el prestamo.',
              icon: 'error'
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: 'Cancelado',
          text: 'Has cancelado el borrado del prestamo :)',
          icon: 'error'
        });
      }
    });
  }
}

// import { NgFor, NgIf } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { Prestamo } from '../../model/prestamo';
// import { PrestamoService } from '../../service/prestamo.service';
// import Swal from 'sweetalert2';
// import { Router } from '@angular/router';
// import { IconDirective } from '@coreui/icons-angular';
// import {
//   ContainerComponent,
//   RowComponent,
//   ColComponent,
//   TextColorDirective,
//   CardComponent,
//   CardBodyComponent,
//   FormDirective,
//   InputGroupComponent,
//   InputGroupTextDirective,
//   FormControlDirective,
//   ButtonDirective
// } from '@coreui/angular';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { PersonaService } from 'src/app/service/persona.service';
// import { Persona } from 'src/app/model/persona';
// import { Zona_seguraService } from 'src/app/service/zona_segura.service';
// import { Zona_segura } from 'src/app/model/Zona_segura';
// import { HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-prestamo',
//   standalone: true,
//   imports: [
//     NgFor,
//     NgIf,
//     HttpClientModule,
//     ContainerComponent,
//     RowComponent,
//     ColComponent,
//     TextColorDirective,
//     CardComponent,
//     CardBodyComponent,
//     FormDirective,
//     InputGroupComponent,
//     InputGroupTextDirective,
//     IconDirective,
//     FormControlDirective,
//     ButtonDirective,
//     ReactiveFormsModule
//   ],
//   providers: [PrestamoService, Router, PersonaService, Zona_seguraService],
//   templateUrl: './prestamo.component.html',
//   styleUrls: ['./prestamo.component.scss']
// })
// export class PrestamoComponent implements OnInit {
//   mostrarFormularioIngreso = false;
//   prestamos: Prestamo[] = [];
//   personas: Persona[] = [];
//   zonaS: Zona_segura[] = [];
//   prestamoSeleccionado: any = {};
//   filaEditada: number | null = null;
//   registerForm: FormGroup;
//   registerFormIn: FormGroup;

//   constructor(
//     private personaService: PersonaService,
//     private prestamoService: PrestamoService,
//     private router: Router,
//     private fb: FormBuilder,
//     private zonasService: Zona_seguraService
//   ) {
//     this.registerForm = this.fb.group({
//       beneficiario: [''],
//       dispositivo: [''],
//       fecha: [''],
//       motivo: [''],
//       finalizado: [''],
//       estado: ['']
//     });
//     this.registerFormIn = this.fb.group({
//       beneficiario: [''],
//       dispositivo: [''],
//       zona_segura: [''],
//       fecha: [''],
//       motivo: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.prestamoService.getPrestamos().subscribe(prestamo => {
//       this.prestamos = prestamo;
//     });
//     this.personaService.getPersonas().subscribe(persona => {
//       this.personas = persona;
//     });
//     this.zonasService.listar().subscribe(zona => {
//       this.zonaS = zona;
//     });
//   }

//   ingresarPrestamo() {
//     this.mostrarFormularioIngreso = !this.mostrarFormularioIngreso;
//   }

//   edit(index: number) {
//     this.filaEditada = index;
//     const prestamoSeleccionado = this.prestamos[index];
//     this.registerForm.patchValue({
//       beneficiario: prestamoSeleccionado.persona.nombre,
//       dispositivo: prestamoSeleccionado.dispositivo.nombre,
//       fecha: prestamoSeleccionado.fecha_prestamo,
//       motivo: prestamoSeleccionado.motivo_prestamo,
//       finalizado: prestamoSeleccionado.finalizado,
//       estado: prestamoSeleccionado.estado_devolucion
//     });
//   }

//   onSubmit2() {
//     // Implementar lógica de envío del formulario
//   }

//   onSubmit() {
//     // Implementar lógica de envío del formulario
//   }

//   cancelarEdicion() {
//     this.filaEditada = null;
//   }

//   eliminarPrestamo(id: any): void {
//     const swalWithBootstrapButtons = Swal.mixin({
//       customClass: {
//         confirmButton: 'btn btn-success',
//         cancelButton: 'btn btn-danger'
//       },
//       buttonsStyling: false
//     });

//     swalWithBootstrapButtons.fire({
//       title: '¿Estás seguro?',
//       text: 'No se puede revertir',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, borrar!',
//       cancelButtonText: 'No, cancelar!',
//       reverseButtons: true
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.prestamoService.deletePrestamo(id).subscribe(
//           () => {
//             this.prestamoService.getPrestamos().subscribe(prestamo => {
//               this.prestamos = prestamo;
//             });
//             swalWithBootstrapButtons.fire({
//               title: '¡Borrado!',
//               text: 'El préstamo ha sido borrado.',
//               icon: 'success'
//             });
//           },
//           error => {
//             console.error('Error al eliminar el préstamo', error);
//             swalWithBootstrapButtons.fire({
//               title: 'Error',
//               text: 'Ha habido un error al eliminar el préstamo.',
//               icon: 'error'
//             });
//           }
//         );
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         swalWithBootstrapButtons.fire({
//           title: 'Cancelado',
//           text: 'Has cancelado el borrado del préstamo :)',
//           icon: 'error'
//         });
//       }
//     });
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { NgFor, NgIf } from '@angular/common';
// import { PrestamoService } from '../../service/prestamo.service';
// import { PersonaService } from 'src/app/service/persona.service';
// import { Zona_seguraService } from 'src/app/service/zona_segura.service';
// import { Prestamo } from '../../model/prestamo';
// import { Persona } from 'src/app/model/persona';
// import { Zona_segura } from 'src/app/model/Zona_segura';
// import { HttpClientModule } from '@angular/common/http';
// import { IconDirective } from '@coreui/icons-angular';
// import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-prestamo',
//   standalone: true,
//   imports: [
//     NgFor, NgIf, HttpClientModule, ReactiveFormsModule,
//     ContainerComponent, RowComponent, ColComponent, TextColorDirective,
//     CardComponent, CardBodyComponent, FormDirective, InputGroupComponent,
//     InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective
//   ],
//   providers: [PrestamoService, PersonaService, Zona_seguraService],
//   templateUrl: './prestamo.component.html',
//   styleUrls: ['./prestamo.component.scss']
// })
// export class PrestamoComponent implements OnInit {
//   mostrarFormularioIngreso = false;
//   prestamos: Prestamo[] = [];
//   personas: Persona[] = [];
//   zonaS: Zona_segura[] = [];
//   filaEditada: number | null = null;
//   registerForm: FormGroup;
//   registerFormIn: FormGroup;

//   constructor(
//     private personaService: PersonaService,
//     private prestamoService: PrestamoService,
//     private router: Router,
//     private fb: FormBuilder,
//     private zonasService: Zona_seguraService
//   ) {
//     this.registerForm = this.fb.group({
//       beneficiario: [''],
//       dispositivo: [''],
//       fecha: [''],
//       motivo: [''],
//       finalizado: [''],
//       estado: ['']
//     });
//     this.registerFormIn = this.fb.group({
//       beneficiario: [''],
//       dispositivo: [''],
//       zona_segura: [''],
//       fecha: [''],
//       motivo: ['']
//     });
//   }

//   ngOnInit(): void {
//     // Inicializa las variables pero no realiza ninguna llamada al servicio
//     console.log("PrestamoComponent inicializado");
//   }

//   ingresarPrestamo() {
//     this.mostrarFormularioIngreso = !this.mostrarFormularioIngreso;
//   }

//   edit(index: number) {
//     this.filaEditada = index;
//     // Simula la edición de un prestamo
//     console.log("Editando prestamo en índice:", index);
//   }

//   onSubmit2() {
//     console.log("Formulario de ingreso enviado");
//   }

//   onSubmit() {
//     console.log("Formulario de edición enviado");
//   }

//   cancelarEdicion() {
//     this.filaEditada = null;
//     console.log("Edición cancelada");
//   }

//   eliminarPrestamo(id: any): void {
//     console.log("Eliminando prestamo con id:", id);
//   }
// }
