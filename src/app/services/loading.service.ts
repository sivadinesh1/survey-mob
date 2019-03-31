import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController, public toastController: ToastController) { }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create().then((a) => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    },

    );
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentToastWithOptions(msg, pos, isclose, btncaption) {
    const toast = await this.toastController.create({
      message: msg,
      showCloseButton: isclose,
      position: pos,
      duration: 2000,
      color: 'primary',
      closeButtonText: btncaption
    });
    toast.present();
  }

}
