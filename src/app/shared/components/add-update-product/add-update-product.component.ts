import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { User } from '../../../models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {

  firebaseSvc = inject(FirebaseService);

  utilsSvc = inject(UtilsService);

  @Input() product: Product;


  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)])
  })

  user = {} as User;

  ngOnInit() {

    this.user = this.utilsSvc.getFromLocalStorage('user');
    if(this.product) this.form.setValue(this.product)

  }

  async takeImage() {

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto')).dataUrl

    this.form.controls.image.setValue(dataUrl);

  }

  async submit() {


    if(this.form.valid) {

      if(this.product) this.updateProduct();
      else this.createProduct()

    }

  }

  // convierte valores de tipo string a numero
  setNumberInputs() {
    let {soldUnits, price} = this.form.controls;

    if(soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));

    if(price.value) price.setValue(parseFloat(price.value));
  }

  async createProduct() {


      let path = `users/${this.user.uid}/products`

      const loading = await this.utilsSvc.loading()
      await loading.present();

      // subir la iamgen y obtener la url 
      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id;

      this.firebaseSvc.addDocument(path, this.form.value).then(async resp => {

        this.utilsSvc.dismissModal({ success: true })

        this.utilsSvc.presentToast({
          message: 'Producto Creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })

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

  async updateProduct() {


      let path = `users/${this.user.uid}/products/${this.product.id}`

      const loading = await this.utilsSvc.loading()
      await loading.present();

      // subir la iamgen y obtener la url 
      if(this.form.value.image !== this.product.image){
        let dataUrl = this.form.value.image;
        let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        this.form.controls.image.setValue(imageUrl);
      }

      delete this.form.value.id;

      this.firebaseSvc.updateDocument(path, this.form.value).then(async resp => {

        this.utilsSvc.dismissModal({ success: true })

        this.utilsSvc.presentToast({
          message: 'Producto Actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })

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
