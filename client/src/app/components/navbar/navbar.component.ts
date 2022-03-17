import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';
import { Auth, authState, signInAnonymously, signOut, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public dialog : MatDialog,public auth:AuthService){
    }

  ngOnInit(): void {
  }
 public openDialog(){
    this.dialog.open(SigninComponent, { panelClass: 'custom-dialog-container' })
  }
 public open(){
    this.dialog.open(SignupComponent, { panelClass: 'custom-dialog-container' })
  }

}
