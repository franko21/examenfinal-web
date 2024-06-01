import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core'; // Importa Injectable
import { LoginService } from './views/pages/login/login.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class authGuard {
  constructor(private loginService: LoginService, private router: Router,private httpCliente:HttpClient) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.loginService.currentUserLoginOn.value) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

