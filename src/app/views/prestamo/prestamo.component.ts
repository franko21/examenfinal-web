import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component,NgModule,OnInit } from '@angular/core';
import{Prestamo} from '../../model/prestamo.model';
import{PrestamoService} from '../../service/prestamo.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  GutterDirective, FormFeedbackComponent
} from '@coreui/angular';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { PersonaService } from 'src/app/service/persona.service';
import { DipositivoService } from 'src/app/service/dispositivo.service';
import { Persona } from 'src/app/model/persona.model';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Zona_segura } from 'src/app/model/zona_segura';
import { Dispositivo } from 'src/app/model/dispositivo.model';
import { Usuario } from 'src/app/model/usuario.model';
import { environment } from 'src/enviroments/environment';
import { NgxPaginationModule } from 'ngx-pagination';




@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [NgFor, HttpClientModule, NgIf, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, ReactiveFormsModule, HttpClientModule, NgxPaginationModule, GutterDirective, FormFeedbackComponent, DatePipe],
  providers:[PrestamoService,PersonaService,DipositivoService,UsuarioService,DatePipe],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {
  selectedPrestamo: any;
  mostrarFormularioIngreso = false;
  mostrarFormularioEditar = false;
  prestamos:Prestamo[]=[];
  personas:Persona[]=[];
  zonaS:Zona_segura[]=[];
  dispositivos:Dispositivo[]=[];
  prestamoSeleccionado: any = {};
  filaEditada: number | null = null;
  registerForm: FormGroup;
  registerFormIn: FormGroup;
  usuario:Usuario;
  showTooltip: boolean = false;
  showTooltip2: boolean = false;
  showTooltip3: boolean = false;
  showTooltip4: boolean = false;
  showTooltip5: boolean = false;
  showTooltip6: boolean = false;
  showTooltip7: boolean = false;
  showTooltip8: boolean = false;
  showTooltip9: boolean = false;
  showTooltip10: boolean = false;
  today: string;
  hoy: Date = new Date();
  idusu:number;
  p: number = 1; // Página actual para la paginación
  constructor(private datePipe:DatePipe,private usuarioService:UsuarioService, private dispoService:DipositivoService, private personaService:PersonaService,private prestamoService: PrestamoService,private router:Router,private fb:FormBuilder){
    this.registerForm = this.fb.group({
      beneficiario: ['', Validators.required],
      dispositivo: ['', Validators.required],
      fecha: ['', Validators.required],
      motivo: ['', Validators.required],
      finalizado: ['', Validators.required],
      estado_devolucion:['', Validators.required],
      // Otros campos del formulario
    });
    this.registerFormIn = this.fb.group({
      beneficiario: ['', Validators.required],
      dispositivo: ['', Validators.required],
      fecha: ['', Validators.required],
      motivo: ['',Validators.required],
    });
  }
  fechaValida(control: AbstractControl): { [key: string]: boolean } | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate >= currentDate ? null : { fechaInvalida: true };
  }

  ngOnInit():void {
    this.usuarioService.getUsuarioByUsername(environment.username).subscribe(
      usu=>{
        this.idusu=usu.id_usuario;
      }
    )
    this.prestamoService.getPrestamos().subscribe(
      prestamo => {
        this.prestamos = prestamo; // @ts-ignore
        console.log(this.prestamos?.at(0).persona);
      }
    );
    this.personaService.getPersonas().subscribe(
      persona=>{
        this.personas=persona;
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
    this.mostrarFormularioEditar = true;
    this.selectedPrestamo = this.prestamos[index];
    console.log(this.selectedPrestamo.fecha_finalizacion);
    console.log(index);

    console.log(this.formatDate(this.selectedPrestamo.fecha_finalizacion));
    this.filaEditada = index;
    const prestamoSeleccionado = this.prestamos[index]; // Suponiendo que prestamos es el array de datos
    console.log(prestamoSeleccionado);
    this.registerForm.patchValue({
      beneficiario: prestamoSeleccionado.persona.id_persona,
      dispositivo: prestamoSeleccionado.dispositivo.idDispositivo,
      // zona_segura:prestamoSeleccionado.zona_segura.id_zona_segura,
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
  showBeneficiarioTooltip() {
    if (this.registerFormIn.get('beneficiario')?.invalid) {
      this.showTooltip = true;
    }
  }
  showFechaTooltip() {
    this.showTooltip4 = true;
  }

  hideFechaTooltip() {
    this.showTooltip4 = false;
  }
  hideBeneficiarioTooltip() {
    this.showTooltip = false;
  }
  showDisTooltip() {
    if (this.registerFormIn.get('dispositivo')?.invalid) {
      this.showTooltip2 = true;
    }
  }

  hideDisTooltip() {
    this.showTooltip2 = false;
  }


  showMotivoTooltip() {
    if (this.registerFormIn.get('motivo')?.invalid) {
      this.showTooltip5 = true;
    }
  }
  hideMotivoTooltip() {
    this.showTooltip5 = false;
  }
  showBenTooltip() {
    if (this.registerForm.get('beneficiario')?.invalid) {
      this.showTooltip6 = true;
    }
  }
  hideBenTooltip() {
    this.showTooltip6 = false;
  }

  showDis2Tooltip() {
    if (this.registerForm.get('dispositivo')?.invalid) {
      this.showTooltip7 = true;
    }
  }
  hideDis2Tooltip() {
    this.showTooltip7 = false;
  }
  showFecha2Tooltip() {
    if (this.registerForm.get('fecha')?.invalid) {
      this.showTooltip8 = true;
    }
  }
  hideFecha2Tooltip() {
    this.showTooltip8 = false;
  }
  showMotivo2Tooltip() {
    if (this.registerForm.get('motivo')?.invalid) {
      this.showTooltip9 = true;
    }
  }
  hideMotivo2Tooltip() {
    this.showTooltip9 = false;
  }
  showEstTooltip() {
    if (this.registerForm.get('estado_devolucion')?.invalid) {
      this.showTooltip10 = true;
    }
  }
  hideEstTooltip() {
    this.showTooltip10 = false;
  }


  onSubmit2(){
    console.log(this.registerFormIn.valid)
    if(this.registerFormIn.valid){
      console.log(this.idusu);
      const fecha=new Date();
      const formValues=this.registerFormIn.value;
      let prestamo:Prestamo=new Prestamo();
      let dispositivoo:Dispositivo=new Dispositivo();
      prestamo.dispositivo=dispositivoo;
      let personaa:Persona=new Persona();
      prestamo.persona=personaa;
      let usuarioo:Usuario=new Usuario();
      // prestamo.usuario=usuarioo;

      prestamo.dispositivo.idDispositivo=formValues.dispositivo;
      prestamo.persona.id_persona=formValues.beneficiario;
      prestamo.fecha_finalizacion=formValues.fecha;
      prestamo.motivo_prestamo=formValues.motivo;
      // prestamo.usuario.id_usuario=this.idusu;
      prestamo.fecha_prestamo=fecha;
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
    }else{
      this.markFormGroupTouched(this.registerFormIn);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
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
    if(this.registerForm.valid){
    let prestamo:Prestamo=new Prestamo();
    let dispositivoo:Dispositivo=new Dispositivo();
    prestamo.dispositivo=dispositivoo;
    let personaa:Persona=new Persona();
    prestamo.persona=personaa;
    let usuarioo:Usuario=new Usuario();
    // prestamo.usuario=usuarioo;

    prestamo.dispositivo.idDispositivo=formValues.dispositivo;
    prestamo.persona.id_persona=formValues.beneficiario;
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
    })}else{
      this.markFormGroupTouched(this.registerForm);
    }
  }
  cancelarEdicion() {
    this.filaEditada = null;
    this.mostrarFormularioEditar=false;
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
