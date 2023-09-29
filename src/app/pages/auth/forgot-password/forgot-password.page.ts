import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { User } from '../../../models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  firebaseSvc = inject(FirebaseService);

  utilsSvc = inject(UtilsService);


  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  ngOnInit() {
  }

  async submit() {

    if (this.form.valid) {

      const loading = await this.utilsSvc.loading()
      await loading.present();

      this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(resp => {

        this.utilsSvc.presentToast({
          message: 'Correo enviado con exito',
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        })

        this.utilsSvc.routerLink('/auth')
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
