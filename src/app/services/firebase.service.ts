import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, getAuth } from '@angular/fire/auth';
import { Firestore, getDoc, setDoc, getFirestore, doc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Storage, getStorage, ref, getDownloadURL, uploadString, deleteObject } from '@angular/fire/storage';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private storage = inject(Storage);
  private auth = inject(Auth);
  private fireStore = inject(Firestore);
  utilSvc = inject(UtilsService)

  getAuth(){
    return getAuth();
  }

  getStorage() {
    return getStorage();
  }

  // authentication
  signIn(user: User) {
    return signInWithEmailAndPassword(this.auth, user.email, user.password);
  }

  // registro
  signUp(user: User) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password);
  }

  // update
  updateUser(displayName: string) { 
    return updateProfile(this.auth.currentUser, {displayName})
  }

  // recuperacion de cuenta
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  // cerrar secion
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilSvc.routerLink('/auth')
  }

  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);

    return collectionData(query(ref, collectionQuery), {idField: 'id'})
  }

  // base de datos
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // actualizar un documento
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // eliminar docuemtno
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // agregar un documento
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  // almenamiento

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  // obtener ruta de la imagen con su url
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath
  }

  // eliminar archivos del storage
  async deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }

}
