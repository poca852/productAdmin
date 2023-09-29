import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { User } from '../../models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  
  utilsSvc = inject(UtilsService);


  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  ngOnInit() {
  }

  async submit(){
    
    if(this.form.valid){

      const loading = await this.utilsSvc.loading()
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User)
        .then(resp => {
          console.log(resp)
          this.getUserInfo(resp.user.uid);
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

  async getUserInfo(uid: string){
    
    if(this.form.valid){

      const loading = await this.utilsSvc.loading()
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc.getDocument(path).then( (user: User) => {
      
      this.utilsSvc.saveInLocalStorage('user', user);
      this.utilsSvc.routerLink('/main/home');

      this.form.reset();

      this.utilsSvc.presentToast({
        message: `Te damos la bienvenida ${user.name}`,
        duration: 1500,
        color: 'primary',
        position: 'middle',
        icon: 'person-circle-outline'
      })


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
