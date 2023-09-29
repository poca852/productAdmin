import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { User } from '../../../models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  
  utilsSvc = inject(UtilsService);


  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  })

  ngOnInit() {
  }

  async submit(){
    
    if(this.form.valid){

      const loading = await this.utilsSvc.loading()
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User)
        .then( async resp => {
          await this.firebaseSvc.updateUser(this.form.value.name)

          let uid = resp.user.uid;

          this.form.controls.uid.setValue(uid);

          this.setUserInfo(uid);
        })
        .catch(err => {
          this.utilsSvc.presentToast({
            message: err.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline'
          })
        })
        .finally(() => {
          loading.dismiss();
        })

    }

  }

  async setUserInfo(uid: string){
    
    if(this.form.valid){

      const loading = await this.utilsSvc.loading()
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;

      this.firebaseSvc.setDocument(path, this.form.value).then( async resp => {
      
      this.utilsSvc.saveInLocalStorage('user', this.form.value)
      this.utilsSvc.routerLink('/main/home');

      this.form.reset();


      }).catch(err => {
        this.utilsSvc.presentToast({
          message: err.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss();
      })

    }

  }

}
