/**
 * Created by markeames on 29/4/17.
 */
import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth-service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate (snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authService.isAuthenticated();
  }
}

