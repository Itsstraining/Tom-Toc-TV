import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FontEditProfileComponent } from 'src/app/components/font-edit-profile/font-edit-profile.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-infor-profile',
  templateUrl: './infor-profile.component.html',
  styleUrls: ['./infor-profile.component.scss']
})
export class InforProfileComponent implements OnInit {

  constructor(public dialog:MatDialog,public auth:AuthService) { 
    console.log(this.auth.user);
  }

  ngOnInit(): void {
  }
  openDialog(){
    this.dialog.open(FontEditProfileComponent,{  width: '30%',});
  }
}
