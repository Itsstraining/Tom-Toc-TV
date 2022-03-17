import { environment } from './../../../environments/environment';
import { ActivatedRoute, Router,NavigationStart } from '@angular/router';
import { Stream } from './../../models/stream.model';
import { StreamService } from 'src/app/services/stream.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import HLS from 'hls.js';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
export let browserRefresh = false;
@Component({
  selector: 'app-tranglivestream',
  templateUrl: './tranglivestream.component.html',
  styleUrls: ['./tranglivestream.component.scss'],

})
export class TranglivestreamComponent implements OnInit, OnDestroy {
  public streamId: any;
  public chatForm!: FormGroup;
  public subscription: Subscription;
  constructor(
    public stream: StreamService,
    public AcRoute: ActivatedRoute,
    public fb: FormBuilder,
    public auth: AuthService,
    public router:Router,
  ) {
    this.chatForm = this.fb.group({
      "mess": new FormControl('', [Validators.required]),
    });
    this.AcRoute.paramMap.subscribe((params) => {
      this.streamId = params.get('id');
      this.stream.getStream(this.streamId);
    });
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
  });

  }

  ngOnInit(): void {

    this.getStreamInfo();
    setTimeout(() => {
      this.stream.addViewer();
    }, 4000)



  }
  ngOnDestroy(): void {
    this.stream.removeViewer();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
  async getStreamInfo() {
    var video = <HTMLVideoElement>document.getElementById('video');
    setTimeout(() => {
      var hls = new HLS();
      hls.loadSource(this.stream.streamLink);
      hls.attachMedia(video);
    }, 3000);
  }
  async endStream(){

    await this.stream.endStream(this.stream.streamInfo.idDoc);
  }

  async addChatMessage() {
    if (this.chatForm.valid) {
      await this.stream.addChat(this.stream.streamInfo.idDoc, this.auth.user.displayName, this.chatForm.controls['mess'].value);
      this.chatForm.controls['mess'].reset()

    }
  }
  async EnterChatMessage() {
    if (this.chatForm.valid) {
      await this.stream.addChat(this.stream.streamInfo.idDoc, this.auth.user.displayName, this.chatForm.controls['mess'].value);
      this.chatForm.controls['mess'].reset()
    }
  }

}
