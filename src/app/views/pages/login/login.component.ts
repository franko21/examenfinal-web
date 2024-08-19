import { Component } from '@angular/core';
import {NgIf, NgStyle} from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  ToasterService,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent,
  ToastBodyComponent,
  ProgressBarDirective,
  ProgressComponent,
  ProgressBarComponent
} from '@coreui/angular';
import {  Router } from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoginRequest } from './LoginRequest';
import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from "sweetalert2";
import { authGuard } from 'src/app/auth.guard';
import {ToastSampleIconComponent} from "../../notifications/toasters/toast-simple/toast-sample-icon.component";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, ReactiveFormsModule, HttpClientModule, NgIf,ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent, ProgressBarDirective, ProgressComponent, ProgressBarComponent, ButtonDirective],
    providers: [LoginService,Router]
})
export class LoginComponent {
  position = 'middle-center';
  visible = false;
  percentage = 0;

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

  loginForm: FormGroup;
  constructor(private router:Router,private fb:FormBuilder,private loginService:LoginService, private toasterService: ToasterService) {
    this.createForm();
   }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    });
  }
  login() {
    // Si la autenticación es exitosa, redirige al monitoreo.
    const formValues = this.loginForm.value;
    const loginRequest = formValues as LoginRequest;
    if(this.loginForm.valid) {
      this.router.navigate(['/marca']);

      sessionStorage.setItem("token", "aasa");
      //   this.loginService.getLogin(formValues.username,formValues.password).subscribe({
      //     next: (userData) => {
      //
      //       if (userData==null){
      //         this.toggleToast();
      //
      //       }
      //     },
      //     error: (errorData) => {
      //       console.error('Error al iniciar sesión:', errorData);
      //       this.toggleToast();
      //     },
      //     complete: () => {
      //       this.loginForm.reset();
      //     }
      //   });}else{
      //   this.markFormGroupTouched(this.loginForm);
      //
      // }
      //     this.loginService.login(loginRequest).subscribe({
      //     next: (userData) => {
      //         if (userData==null){
      //           this.toggleToast();
      //
      //         }
      //     },
      //     error: (errorData) => {
      //         console.error('Error al iniciar sesión:', errorData);
      //         this.toggleToast();
      //     },
      //     complete: () => {
      //         this.loginForm.reset();
      //     }
      // });}else{
      //     this.markFormGroupTouched(this.loginForm);
      //
      //   }
    //}
      }
  }
  register(){
    this.router.navigate(['/register']);

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
