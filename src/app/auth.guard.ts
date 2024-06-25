import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'src/enviroments/environment';

  export const authGuard: CanActivateFn = (route, state) => {
    // Aquí puedes agregar la lógica para determinar si el usuario puede acceder a la ruta
    // Por ejemplo, puedes verificar si el usuario está autenticado
    // const isAuthenticated =environment.islogged;
    const isAuthenticated = sessionStorage.getItem('token');
    if (isAuthenticated) {
      return true; // Permitir el acceso a la ruta
    } else {
      // Redirigir al usuario a la página de inicio de sesión u otra página
      // En este caso, estamos redirigiendo al usuario a la página de inicio
      // También puedes redirigir a la página de inicio de sesión utilizando la navegación del router
      window.location.href = '/login'; // Redirigir al usuario a la página de inicio de sesión
      return false; // Bloquear el acceso a la ruta
    }
  };
