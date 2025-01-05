import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot,} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isSignedIn()) {
      return true;
    } else {
      // Redirect to the Sign-In page if not authenticated
      this.router.navigate(['/sign-in']).then(r => {
        console.log('Redirected to Sign-In page');
      });
      return false;
    }
  }
}
