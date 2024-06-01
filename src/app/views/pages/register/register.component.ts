import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  
import {PersonaService} from '../../../service/persona.service';
import{Persona} from '../../../model/persona';
import { RegisterRequest } from '../login/RegisterRequest';
import Swal from "sweetalert2";
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective,ReactiveFormsModule,HttpClientModule],
    providers: [PersonaService,LoginService] 
})
export class RegisterComponent {
  idPer:number;
  registerForm: FormGroup;
  constructor(private fb:FormBuilder,private personaService:PersonaService,private loginService:LoginService,private router:Router) {
    this.registerForm = this.fb.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
   }

   onSubmit() {
    // if (this.registerForm.valid) {
      const formValues = this.registerForm.value;
      const newPersona:Persona = new Persona(
        formValues.cedula,
        formValues.nombre,
        formValues.apellido
      );
      this.personaService.crearPersona(newPersona, 1).subscribe({
        next: (userData) => {
            console.log('Datos de persona recibidos:', userData);
            this.personaService.obteenerPersonaXCedula(formValues.cedula).subscribe(
                (id: number) => {
                    this.idPer = id;
    
                    // Se debe construir el objeto FormGroup correctamente
                    const newRegisterRequest: RegisterRequest = {
                        email: formValues.email,
                        password: formValues.password,
                        persona: id,
                        role: 'ADMIN' // Se asume que 'role' debe ser especificado aquí
                    };
    
                    this.loginService.register(newRegisterRequest).subscribe({
                        next: (userData) => {
                            console.log('Datos de usuario recibidos:', userData);
                            // Muestra una notificación de éxito con SweetAlert2
                            Swal.fire({
                                icon: 'success',
                                title: '¡Creacion de Usuario exitosa!',
                                text: 'Bienvenido',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'OK'
                            }).then((result)=>{
                              if(result.isConfirmed){
                                  this.router.navigate(['/login']);
                              }
                          }
          
                          );
                        },
                        error: (errorData) => {
                            console.error('Error al crear usuario:', errorData);
                            // Muestra una notificación de error con SweetAlert2
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al crear usuario',
                                text: 'Error al ingresar los datos.',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'OK'
                            });
                        },
                        complete: () => {
                            console.info("Inicio de sesión completo");
                            // Realiza acciones adicionales después del inicio de sesión, si es necesario
                            this.registerForm.reset();
                        }
                    });
    
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
            Swal.fire({
                icon: 'error',
                title: 'Error al ingresar Usuario',
                text: 'Error al ingresar los datos.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        },
        complete: () => {
            console.info("Creación de persona completa");
            // Realiza acciones adicionales después de crear la persona, si es necesario
            // this.registerForm.reset();
        }
    });
      console.log(newPersona);
      // Aquí puedes proceder con el envío de los datos, por ejemplo a través de un servicio
    }
  //}
  onCancel(){
    this.router.navigate(['/login']);
  }

}
