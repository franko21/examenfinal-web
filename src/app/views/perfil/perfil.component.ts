import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Usuario} from "../../model/usuario.model";
import {UsuarioService} from "../../service/usuario.service";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  providers:[UsuarioService],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  usuario: string;
  cedula: string;
  nombre: string;
  apellido: string;

  isEditingProfile: boolean = false;
  newUsername: string = '';
  newPassword: string = '';
  formUser: FormGroup;

  constructor(private fb:FormBuilder, private usuarioService:UsuarioService) {
    this.formUser = this.fb.group({
      cedula: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    // @ts-ignore
    this.usuario = sessionStorage.getItem('usuario');
    // @ts-ignore
    this.cedula = sessionStorage.getItem('cedula');
    // @ts-ignore
    this.nombre = sessionStorage.getItem('nombre');
    // @ts-ignore
    this.apellido = sessionStorage.getItem('apellido');
  }

  toggleEditProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
    this.formUser.reset();
  }

  saveChanges(): void {
    if(this.formUser.valid){
      const formValues=this.formUser.value;
      let usuario:Usuario=new Usuario();
      usuario.username=formValues.username;
      usuario.password=formValues.password;
      this.usuarioService.editUsuario(sessionStorage.getItem('usuario'),formValues.cedula,usuario).subscribe({
        next:(userData)=>{
          console.log('Datos de usuario recibidos:', userData);
          sessionStorage.setItem('usuario', formValues.username);
          // @ts-ignore
          this.usuario=sessionStorage.getItem('usuario');
          // @ts-ignore
          this.cedula=sessionStorage.getItem('cedula');
          sessionStorage.setItem('cedula', formValues.cedula);
          console.log('Contraseña cambiada a:', this.newPassword);
          this.toggleEditProfile();
          // this.toggleToast();
        },
        error:(errorData)=>{
          console.error('Error al editar prestamo:', errorData);
          // this.toggleToast2();
        },
        complete:()=>{
          console.info("Edicion completa");
        }
      })

    }else{
      this.markFormGroupTouched(this.formUser);
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



    protected readonly sessionStorage = sessionStorage;
}
