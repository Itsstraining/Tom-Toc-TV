import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StreamService } from 'src/app/services/stream.service';
export interface Category{
  categoryId:number;
  name:string;
}
@Component({
  selector: 'app-create-stream',
  templateUrl: './create-stream.component.html',

  styleUrls: ['./create-stream.component.scss'],
})
export class CreateStreamComponent implements OnInit {
  animalControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  public createStreamForm: FormGroup;
  hide = true;
  constructor(public fb: FormBuilder, public stream: StreamService,public auth:AuthService) {
    this.createStreamForm = this.fb.group({
      Name: new FormControl('', [Validators.required]),
      Category: new FormControl('', [Validators.required]),
      Description: new FormControl(''),
      StreamKey: new FormControl('', [Validators.required]),
    });
    this.createStreamForm.controls['Streamkey'];
    this.stream.getCategory();
  }

  ngOnInit(): void {}
  genKey() {
    this.createStreamForm.controls['StreamKey'].patchValue(uuidv4());
  }
  submitCreateStream() {
    let form = this.createStreamForm;
    if (form.valid) {
      this.stream.createStream(form.controls['Name'].value,form.controls['Category'].value,form.controls['Description'].value,form.controls['StreamKey'].value,this.auth.user.uid);
    } else {
      alert(`Vui lòng nhập điền đủ thông tin`);
    }
  }
}
