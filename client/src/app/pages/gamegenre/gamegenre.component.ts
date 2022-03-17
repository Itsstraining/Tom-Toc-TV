import { Component, Input, OnInit, Type } from '@angular/core';
import { TypeService } from 'src/app/services/type.service';
import { Firestore,collection,collectionData, setDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-gamegenre',
  templateUrl: './gamegenre.component.html',
  styleUrls: ['./gamegenre.component.scss']
})
export class GamegenreComponent implements OnInit {

  constructor(public print: TypeService, private firestore : Firestore) {
  }

  ngOnInit(): void {
  } 
}
