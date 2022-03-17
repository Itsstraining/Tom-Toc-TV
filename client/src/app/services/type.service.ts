import { Injectable } from '@angular/core';
import { Firestore,collection,collectionData,query,where,addDoc,updateDoc,doc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  public List1:Array<any> = [];

  constructor(public firestore : Firestore) {

    let collec = collection(firestore,'Categories');
    let temp=query(collec,where('categoryName','==',"Game"));
    collectionData(temp,{idField:'idDoc'}).subscribe(async(data)=>{
        this.List1=await data;
        console.log(this.List1[0].categoryList[0])
    })
    
  }
  // updateDoc(){
  //   updateDoc(doc(this.firestore,'Categories','2PBDxS9SNetS4oU8befz'),{categoryList:[{Name:'Liên minh',PictureURL:"hehe"}]});
  // }
}
