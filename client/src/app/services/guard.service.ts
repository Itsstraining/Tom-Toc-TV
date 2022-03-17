import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot,CanActivate,Router, RouterStateSnapshot,UrlTree,} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(public router: Router, public auth: AuthService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.auth.checkAuth() ? true : this.router.parseUrl('');
  }
}
