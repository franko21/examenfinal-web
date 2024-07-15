import { Component } from '@angular/core';
import {
  ButtonDirective,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ProgressBarComponent,
  ProgressBarDirective,
  ProgressComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from "@coreui/angular";
import {IconDirective, IconSetService} from "@coreui/icons-angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {NgxPaginationModule} from "ngx-pagination";
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PersonaService} from "../../service/persona.service";
import {RolService} from "../../service/rol.service";
import {Rol} from "../../model/rol.model";
import {Persona} from "../../model/persona.model";
import Swal from "sweetalert2";
import * as icons from '@coreui/icons';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    ButtonDirective,
    FormControlDirective,
    IconDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NgForOf,
    NgIf,
    NgxPaginationModule,
    ReactiveFormsModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent, ProgressBarDirective, ProgressComponent, ProgressBarComponent, ButtonDirective, FormsModule
  ],
  providers:[PersonaService,RolService,DatePipe],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {
  idPer:number;
  registerForm: FormGroup;
  registerFormIn: FormGroup;
  roles:Rol[]=[];
  personas:Persona[]=[];
  selectedPersona: any;
  p: number = 1;
  existsP:boolean=false;
  filaEditada: number | null = null;
  mostrarFormularioIngreso = false;
  mostrarFormularioEditar = false;
  position = 'top-end';
  visible = false;
  percentage = 0;
  searchText: string = '';

  position2 = 'top-end';
  visible2 = false;
  percentage2 = 0;

  filteredPersonas() {
    if (!this.searchText) {
      return this.personas;
    }

    return this.personas.filter(persona => {
      return (
        persona.cedula.toLowerCase().includes(this.searchText.toLowerCase()) ||
        persona.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        persona.apellido.toLowerCase().includes(this.searchText.toLowerCase()) ||
        persona.rol.rol.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  toggleToast() {
    this.visible = !this.visible;
  }

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }
  toggleToast2() {
    this.visible2 = !this.visible2;
  }

  onVisibleChange2($event: boolean) {
    this.visible2 = $event;
    this.percentage2 = !this.visible2 ? 0 : this.percentage2;
  }

  onTimerChange2($event: number) {
    this.percentage2 = $event * 25;
  }
  constructor(private datePipe:DatePipe, private rolService:RolService, private personaService:PersonaService,private fb:FormBuilder,private iconSet: IconSetService) {
    this.registerFormIn = this.fb.group({
      cedula: ['',[Validators.required, Validators.pattern('^[0-9]*$')]],
      nombre: ['',Validators.required],
      apellido: ['',Validators.required],
      rol: ['',Validators.required]
    });
    this.registerForm = this.fb.group({
      cedula: ['',Validators.required],
      nombre: ['',Validators.required],
      apellido: ['',Validators.required],
      rol: ['',Validators.required]
    });
    // @ts-ignore
    this.iconSet.icons = icons;
  }
  ngOnInit():void {
    // this.rolService.getRoles().subscribe(
    //   rol=>{
    //     this.roles=rol;
    //   }
    // )
    this.rolService.getRoles().pipe(
      map(roles => roles.filter(rol => rol.rol !== 'administrador'))
    ).subscribe(
      rolesFiltrados => {
        console.log('Roles después de filtrar:', rolesFiltrados);
        this.roles = rolesFiltrados;
      },
      error => {
        console.error('Error al cargar los roles', error);
      }
    );
    // this.personaService.getPersonas().subscribe(
    //   persona=>{
    //     this.personas=persona;
    //   }
    // )
    this.personaService.getPersonas().pipe(
      map((personas: any[]) => personas.filter(persona => persona.rol!==null&&persona.rol?.rol!=='administrador'))
    ).subscribe(
      personasFiltradas => {
        this.personas = personasFiltradas;
        console.log('Personas después de filtrar:', this.personas);
      },
      error => {
        console.error('Error al cargar las personas', error);
      }
    );

  }

  ingresarPersona(){
    this.mostrarFormularioIngreso = !this.mostrarFormularioIngreso;
  }
  edit(index: number) {
    this.selectedPersona = this.personas[index];
    this.mostrarFormularioEditar = true;
    this.filaEditada = index;
    const personaSeleccionada = this.personas[index]; // Suponiendo que prestamos es el array de datos
    this.registerForm.patchValue({
      cedula: personaSeleccionada.cedula,
      nombre: personaSeleccionada.nombre,
      apellido: personaSeleccionada.apellido,
      rol: personaSeleccionada.rol.id_rol,
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

  onSubmit(){
    if(this.registerForm.valid) {
    const formValues=this.registerForm.value;
    let persona:Persona=new Persona();
    const fecha=new Date();
    let roll:Rol=new Rol();

    persona.rol=roll;
    persona.cedula=formValues.cedula;
    persona.nombre=formValues.nombre;
    persona.apellido=formValues.apellido;
    persona.rol.id_rol=formValues.rol;
    persona.fecha_registro=fecha;

    this.personaService.editPersona(this.selectedPersona.id_persona,persona).subscribe({
      next:(userData)=>{
        console.log('Datos de presona recibidos:', userData);
        this.personaService.getPersonas().pipe(
          map((personas: any[]) => personas.filter(persona => persona.rol!==null&&persona.rol?.rol!=='administrador'))
        ).subscribe(
          personasFiltradas => {
            this.personas = personasFiltradas;
            console.log('Personas después de filtrar:', this.personas);
          },
          error => {
            console.error('Error al cargar las personas', error);
          }
        );
        // Swal.fire({
        //   icon: 'success',
        //   title: '¡Edicion de persona exitosa!',
        //   text: 'EXITO',
        //   confirmButtonColor: '#3085d6',
        //   confirmButtonText: 'OK'
        // })
        this.toggleToast();
        this.registerForm.reset();
      },
      error:(errorData)=>{
        console.error('Error al editar persona:', errorData);
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Error al editar persona',
        //   text: 'Error al ingresar los datos.',
        //   confirmButtonColor: '#3085d6',
        //   confirmButtonText: 'OK'
        // });
        this.toggleToast2();
      },
      complete:()=>{
        console.info("Edicion completa");
        this.filaEditada = null;
        this.mostrarFormularioEditar=false;
      }
    })
    }else{
      this.markFormGroupTouched(this.registerForm);
    }
  }
  onSubmit2(){
    if(this.registerFormIn.valid) {
      const fecha = new Date();
      const formValues = this.registerFormIn.value;
      let persona: Persona = new Persona();
      let roll: Rol = new Rol();
      persona.rol = roll;

      persona.cedula = formValues.cedula;
      persona.nombre = formValues.nombre;
      persona.apellido = formValues.apellido;
      persona.rol.id_rol = formValues.rol;
      persona.fecha_registro = fecha;
      this.personaService.crearPersona(persona, formValues.rol).subscribe({
        next: (userData) => {
          console.log('Datos de persona recibidos:', userData);
          this.personaService.obteenerPersonaXCedula(formValues.cedula).subscribe(
            (id: number) => {
              this.idPer = id;
              this.existsP = true;

              console.log('ID de la persona:', this.idPer);
            },
            (error) => {
              console.error('Error al obtener persona por cédula:', error);
            }
          );

        },
        error: (errorData) => {
          console.error('Error al ingresar Persona:', errorData);
          // // Muestra una notificación de error con SweetAlert2
          if (this.existsP) {
            // Swal.fire({
            //   icon: 'error',
            //   title: 'Error al ingresar Persona',
            //   text: 'Cedula ya ingresada.',
            //   confirmButtonColor: '#3085d6',
            //   confirmButtonText: 'OK'
            // });
            this.toggleToast2();
          } else {
            // Swal.fire({
            //   icon: 'error',
            //   title: 'Error al ingresar Persona',
            //   text: 'Error al ingresar los datos.',
            //   confirmButtonColor: '#3085d6',
            //   confirmButtonText: 'OK'
            // });
            this.toggleToast2();
          }

        },
        complete: () => {
          console.info("Creación de persona completa");
          // Realiza acciones adicionales después de crear la persona, si es necesario
          // this.registerForm.reset();
          this.existsP = false;
          this.ingresarPersona();
          this.personaService.getPersonas().pipe(
            map((personas: any[]) => personas.filter(persona => persona.rol!==null&&persona.rol?.rol!=='administrador'))
          ).subscribe(
            personasFiltradas => {
              this.personas = personasFiltradas;
              console.log('Personas después de filtrar:', this.personas);
            },
            error => {
              console.error('Error al cargar las personas', error);
            }
          );
          // Swal.fire({
          //   icon: 'success',
          //   title: '¡Creacion de Persona exitosa!',
          //   text: 'Success',
          //   confirmButtonColor: '#3085d6',
          //   confirmButtonText: 'OK'
          // })
          this.toggleToast();
          this.registerFormIn.reset();
        }
      });
    }else{
      this.markFormGroupTouched(this.registerFormIn);
    }
  }

  cancelarEdicion() {
    this.filaEditada = null;
    this.mostrarFormularioEditar=false;
  }

  eliminarPersona(id: any): void {
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
        this.personaService.deletePersona(id).subscribe(
          () => {
            this.personaService.getPersonas().pipe(
              map((personas: any[]) => personas.filter(persona => persona.rol!==null&&persona.rol?.rol!=='administrador'))
            ).subscribe(
              personasFiltradas => {
                this.personas = personasFiltradas;
                console.log('Personas después de filtrar:', this.personas);
              },
              error => {
                console.error('Error al cargar las personas', error);
              }
            );
            swalWithBootstrapButtons.fire({
              title: 'BORRADO!',
              text: 'La Persona ah sido borrada.',
              icon: 'success'
            });
          },
          error => {
            console.error('Error al eliminar la persona', error);
            swalWithBootstrapButtons.fire({
              title: 'Error',
              text: 'Ah habido un error al eliminar la persona.',
              icon: 'error'
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: 'Cancelado',
          text: 'Has cancelado el borrado de la persona :)',
          icon: 'error'
        });
      }
    });
  }
  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
