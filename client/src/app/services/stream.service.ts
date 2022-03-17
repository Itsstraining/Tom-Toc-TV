import { Category } from './../models/category.model';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  getDoc,
  doc,
  query,
} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Stream } from '../models/stream.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  public streamInfo: any = new Stream();
  public streamList!: Array<any>;
  public categoryList: Array<any> = [];
  public streamLink: any;
  public streamerName!: Array<any>;

  constructor(
    public router: Router,
    public fs: Firestore,
    public AcRoute: ActivatedRoute,
    public http: HttpClient,
    public auth: AuthService
  ) {

  }


  async createStream(Name: any, Category: any, Description: any, StreamKey: any, UserId: any,) {
    if (this.auth.user.uid == null) {
      alert('Vui lòng đăng nhập');
    } else {
      await this.http
        .post(`${environment.nodejsConfig}createStream`, {
          data: {
            CategoryId: Category,
            Description: Description,
            DisLikes: [],
            Likes: [],
            Messages: [{}],
            Viewer: [],
            Name: Name,
            StreamKey: StreamKey,
            HostId: UserId,
          },
        }, { responseType: 'text' })
        .subscribe((data) => {
          this.router.navigate([`stream/${data}`])
        });
    }
  }
  async endStream(Id:any) {

    await this.http.delete(`${environment.nodejsConfig}endStream`, {
      body:{
        "bodydata":{
          "streamId":Id
        }
      }

    }).subscribe(()=>{

    });
    this.router.navigate([''])
  };
  getStreamsByCategory(Id: any) {
    let docRef = collection(this.fs, 'Streams');
    collectionData(docRef, { idField: 'idDoc' }).subscribe((data) => {
      if (Id == null) {
        this.streamList = data;
      } else {
        data.forEach((doc) => {
          this.streamList = [];
          if (doc['categoryId'] == Id) {

            this.streamList.push(doc);
          }
        })
      }

    });
  }
  async addViewer() {
    await this.http.post(`${environment.nodejsConfig}addViewer`, {
      IdStream: this.streamInfo.idDoc,
      UserId: this.auth.user.uid
    }, { responseType: 'text' }).subscribe(() => { })
  }
  async removeViewer() {
    await this.http.post(`${environment.nodejsConfig}removeViewer`, {
      IdStream: this.streamInfo.idDoc,
      UserId: this.auth.user.uid
    }, { responseType: 'text' }).subscribe(() => { })
  }
  getStreamsData() {
    let docRef = collection(this.fs, 'Streams');
    collectionData(docRef, { idField: 'idDoc' }).subscribe((data) => {
      this.streamList = data;
    });
  }
  getStream(Id: any) {
    let docRef = collection(this.fs, 'Streams');
    collectionData(docRef, { idField: 'idDoc' }).subscribe((data) => {
      data.forEach((doc) => {
        if (doc['idDoc'] == Id) {
          this.streamInfo = doc;

          this.streamLink = `${environment.rtmpConnectionString}:8000/live/${doc['StreamKey']}/index.m3u8`;
        }
      });
    });
  }
  getCategory() {
    let docRef = collection(this.fs, 'Categories');
    collectionData(docRef, { idField: 'idDoc' }).subscribe((data) => {
      this.categoryList = data;
    })
  }
  async disLike(IdStream: any, IdUser: any) {
    await this.http.put(`${environment.nodejsConfig}dislike`, {
      IdStream: IdStream,
      userIdDisLike: IdUser,
    }).subscribe(() => {

    })
  }
  async Like(IdStream: any, IdUser: any) {
    await this.http.put(`${environment.nodejsConfig}like`, {
      IdStream: IdStream,
      userIdDisLike: IdUser,
    }).subscribe(() => {

    })
  }
  async addChat(Id: any, UserName: any, Mess: any) {
    try {
      return await this.http
        .post(`${environment.nodejsConfig}addChat`, {
          data: {
            streamId: Id,
            UserId: this.auth.user.uid,
            UserName: UserName,
            message: Mess,
          },
        }, { responseType: 'text' })
        .subscribe(() => { });
    } catch (err) {
      console.log(err);
      return
    }
  }


}
