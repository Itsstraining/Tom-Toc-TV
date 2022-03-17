import { environment } from './../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Stream } from './../../models/stream.model';
import { StreamService } from 'src/app/services/stream.service';
import { Component, OnInit } from '@angular/core';
import HLS from 'hls.js';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-tranglivestream',
  templateUrl: './tranglivestream.component.html',
  styleUrls: ['./tranglivestream.component.scss'],
})
export class TranglivestreamComponent implements OnInit {
  public streamId: any;
  public chatForm!: FormGroup;
  constructor(
    public stream: StreamService,
    public AcRoute: ActivatedRoute,
    public fb: FormBuilder,
    public auth:AuthService
  ) {
    this.chatForm = this.fb.group({
      "mess":new FormControl('',[Validators.required]),
    });
    this.AcRoute.paramMap.subscribe((params) => {
      this.streamId = params.get('id');
      this.stream.getStream(this.streamId);
    });
  }

  ngOnInit(): void {
    this.getStreamInfo();
  }
  async getStreamInfo() {
    var video = <HTMLVideoElement>document.getElementById('video');
    setTimeout(() => {
      var hls = new HLS();
      hls.loadSource(this.stream.streamLink);
      hls.attachMedia(video);
    }, 3000);
  }

  async addChatMessage(){
    if(this.chatForm.valid){
      await  this.stream.addChat(this.stream.streamInfo.idDoc,this.auth.user.displayName,this.chatForm.controls['mess'].value);
      this.chatForm.controls['mess'].reset()

    }
  }
  async EnterChatMessage(){
    if(this.chatForm.valid){
      await  this.stream.addChat(this.stream.streamInfo.idDoc,this.auth.user.displayName,this.chatForm.controls['mess'].value);
      this.chatForm.controls['mess'].reset()
    }
  }

}
