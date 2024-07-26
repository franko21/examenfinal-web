import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from "@angular/common";
import { Usuario } from "../../model/usuario.model";
import { UsuarioService } from "../../service/usuario.service";
import {
  ButtonDirective,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from "@coreui/angular";

import { IconDirective, IconSetService } from "@coreui/icons-angular";
import { environment } from 'src/enviroments/environment';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    ButtonDirective,
    FormControlDirective,
    IconDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent
  ],
  providers: [UsuarioService],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  //configuracion de toaster:
  visible = false;
  toastType: 'success' | 'error' = 'success'; // Puede ser 'success' o 'error'
  tituloMensaje = 'Titulo del Mensaje';
  descripcionMensaje = 'Descripción del Mensaje';
  position = 'top-right';
  percentage = 0;

  // Método para mostrar el toast con un tipo específico
  showToast(type: 'success' | 'error', titulo: string, descripcion: string) {
    this.toastType = type;
    this.tituloMensaje = titulo;
    this.descripcionMensaje = descripcion;
    this.visible = true;
    setTimeout(() => this.visible = false, 2000); // Ocultar el toast después de 3 segundos
  }
  /////

  isEditingProfile: boolean = false;
  titulo = 'Perfil de usuario';
  formUser: FormGroup;
  usuario: Usuario;
  newPassword: string;
  selectedImage: File | null = null;
  previewImageUrl: string | ArrayBuffer | null | undefined = undefined;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const username = sessionStorage.getItem('usuario');
    if (username) {
      this.usuarioService.getUsuarioByUsername(username).subscribe(
        (usuario) => {
          this.usuario = usuario;
          this.initializeForm();
        },
        (errorData) => {
          console.error('Error al obtener usuario:', errorData);
        }
      );
    }
  }

  private initializeForm() {
    this.previewImageUrl = this.getImagenURL(this.usuario.persona.imagen);
    console.log("url:");
    console.log(this.previewImageUrl);
    // Verifica que los datos existan antes de usarlos
    this.formUser = this.fb.group({
      newCedula: [this.usuario?.persona?.cedula || '', Validators.required],
      newNombre: [this.usuario?.persona?.nombre || '', Validators.required],
      newApellido: [this.usuario?.persona?.apellido || '', Validators.required],
      newUsername: [this.usuario?.username || '', Validators.required],
      newPassword: [''],
      actualPassword: ['', Validators.required]
    });
  }

  toggleEditProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
    this.titulo = this.isEditingProfile ? 'Editar perfil de usuario' : 'Perfil de usuario';
  }

  saveChanges(): void {
    if (this.formUser.valid) {
      const formValues = this.formUser.value;
  
      // Crear el objeto Usuario con los valores del formulario
      const usuario: Usuario = {
        ...this.usuario, // Mantener los valores actuales del usuario
        username: formValues.newUsername,
        password: formValues.newPassword || this.usuario.password, // Usa la contraseña actual si no se proporciona una nueva
        persona: {
          ...this.usuario.persona,
          cedula: formValues.newCedula,
          nombre: formValues.newNombre,
          apellido: formValues.newApellido
        }
      };
  
      this.usuarioService.updateUsuario(usuario, this.selectedImage).subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          sessionStorage.setItem('usuario', usuario.username);
          this.toggleEditProfile();
          this.showToast('success', 'Actualización exitosa', 'El usuario fue actualizado con éxito');
        },
        error: (errorData) => {
          this.showToast('error', 'Error al actualizar', 'Hubo un error al actualizar el usuario');
        }
      });
    } else {
      this.markFormGroupTouched(this.formUser);
    }
  }
  
  
  
  

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];

      // Mostrar vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewImageUrl = e.target?.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  getImagenURL(id: any): string | null {
    if (!id) {
      return null; // Retorna null si el id es inválido o no está presente
    }
    return `${environment.urlHost}api/uploads/${id}`;
  }
}