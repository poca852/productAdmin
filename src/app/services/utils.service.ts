import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);
  router = inject(Router);

  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }

  async takePicture(promptLabelHeader: string){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto'
    });
  
    return image;
  };


  // loading
  loading() {
    return this.loadingCtrl.create({spinner: 'crescent'})
  }

  // toas
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // enrutar a cualquier pagina disponible
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // guarda un elemento en localStorage
  saveInLocalStorage(key: string, value: any) {

    return localStorage.setItem(key, JSON.stringify(value));
  }

  // optiene un elemento desde el localstorage
  getFromLocalStorage(key: string) {

    return JSON.parse(localStorage.getItem(key));
    
  }

  // modal
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
  
    await modal.present();

    const {data } = await modal.onWillDismiss();

    if(data) return data;
  
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

}
