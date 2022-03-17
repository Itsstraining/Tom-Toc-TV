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
  public streamList!: Array<Stream>;
  public streamLink: any;
  constructor(
    public router: Router,
    public fs: Firestore,
    public AcRoute: ActivatedRoute,
    public http: HttpClient,
    public auth: AuthService
  ) {}

  async createStream(Name: any, Description: any, StreamKey: any, UserId: any) {
    if (this.auth.user.uid == null) {
      alert('Vui lòng đăng nhập');
    } else {
      await this.http
        .post(`${environment.nodejsConfig}createStream`, {
          data: {
            CategoryId: '2',
            Description: Description,
            DisLikes: [],
            Likes: [],
            Messages: [{}],
            Name: Name,
            StreamKey: StreamKey,
            HostId: UserId,
          },
        },{responseType:'text'})
        .subscribe((data) => {
          this.router.navigate([`stream/${data}`])
        });
    }
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
  async addChat(Id: any,UserName:any, Mess: any) {
    try {
      return await this.http
        .post(`${environment.nodejsConfig}addChat`, {
          data: {
            streamId: Id,
            UserId: this.auth.user.uid,
            UserName:UserName,
            message: Mess,
          },
        },{responseType:'text'})
        .subscribe(() => {});
    } catch (err) {
      console.log(err);
      return
    }
  }
}
