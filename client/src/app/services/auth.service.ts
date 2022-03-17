import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  getAuth,


} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import {
  collectionData,
  collection,
  getDoc,
  doc,
} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user: any;
  constructor(
    public auth: Auth,
    public other:Auth,
    public http: HttpClient,
    public fs: Firestore
  ) {
    if (auth) {
      authState(this.auth).subscribe((temp: any) => {
        this.user = temp;
        this.createUser();
      });
    }
  }
  public async login() {
    return await signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  public async loginF() {
    return await signInWithPopup(this.auth, new FacebookAuthProvider());
  }
  public async logout() {
    return await signOut(this.auth);
  }
  public async createUser() {
    return await this.http
      .post(`${environment.nodejsConfig}createUser`, {
        Id: this.user.uid,
        Name: this.user.displayName,
      }, { responseType: 'text' })
      .subscribe(() => { });
  }

  public async getUserInfo(Id: any) {
     this.http.get(`${environment.nodejsConfig}getUserInfo/${Id}`).subscribe((value:any) => {
      return value.Name
    });
  }
}
