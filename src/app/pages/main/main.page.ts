import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' },
  ]

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);
  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {

      if(event?.url) this.currentPath = event.url;

    })
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  signOut() {
    this.firebaseSvc.signOut();
  }

}
