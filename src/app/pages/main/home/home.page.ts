import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from '../../../shared/components/add-update-product/add-update-product.component';
import { User } from '@angular/fire/auth';
import { orderBy } from '@angular/fire/firestore';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  products: Product[] = [];

  loading: boolean = true;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {    
    setTimeout(() => {
      this.getProducts()
      event.target.complete();
    }, 1000);
  }

  // obtener ganacia
  getProfits() {
    return this.products.reduce((index, product) => index + product.price + product.soldUnits, 0);
  }

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  // obtener productos
  getProducts() {
    let path = `users/${this.user().uid}/products`;

    let query = (
      orderBy('soldUnits', 'asc')
    )

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (resp: any) => {
        this.products = resp;
        this.loading = false;
        sub.unsubscribe();
      }
    })
  }


  // agregar o actualizar producto
  async addUpdateProduct(product?: Product) {
    let success = await this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    })

    if (success) {
      this.getProducts();
    }
  }

  async confirmDeleteProduct(product: Product) {
    this.utilSvc.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, 
        {
          text: 'Si, Eliminar',
          handler: () => {
            this.deleteProduct(product)
          }
        }
      ]
    });
  }

  async deleteProduct(product: Product) {

    let path = `users/${this.user().uid}/products/${product.id}`;

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    const loading = await this.utilSvc.loading()
    await loading.present();


    this.firebaseSvc.deleteDocument(path).then(async resp => {

      this.products = this.products.filter(p => p.id !== product.id)

      this.utilSvc.presentToast({
        message: 'Producto Eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    })
      .catch(err => {
        this.utilSvc.presentToast({
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
