import { Router, ActivatedRoute } from '@angular/router';
import { StreamService } from 'src/app/services/stream.service';
import { Component, Input, OnInit, Type } from '@angular/core';

import { Firestore, collection, collectionData, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-gamegenre',
  templateUrl: './gamegenre.component.html',
  styleUrls: ['./gamegenre.component.scss']
})
export class GamegenreComponent implements OnInit {
  public categoryId:any='';
  constructor(private firestore: Firestore, public stream: StreamService, public router: Router,public AcRoute:ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.AcRoute.paramMap.subscribe((params) => {
      this.categoryId = params.get('id');
    })
  }

  ngOnInit(): void {
    this.stream.getCategory();
    console.log(this.categoryId)
    this.stream.getStreamsByCategory(this.categoryId);

  }
  navigate(id: any) {

    this.router.navigate([`genre/${id}`]);
  }
  navigateToStream(id:any){
    this.router.navigate([`stream/${id}`]);
  }
}
