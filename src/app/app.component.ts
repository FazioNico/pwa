import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PwaDemo';

  constructor(
    private _toast: ToastController,
    private _sw: SwUpdate
  ) {
    this.checkDevice();
    this._sw.available.subscribe((res) =>{
      console.log('--->', res);
      if (res) {
        this.displayPopUpUpdate();
      }
    });
  }

  checkDevice() {
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test( userAgent );
    };
    // Detect if app is install
    const isInStandaloneMode = () => ('standalone' in (window as any).navigator) && ((window as any).navigator.standalone);
    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
      this.displayPopUpInstall();
    }
  }

  async displayPopUpInstall() {
    const toast = await this._toast.create({
      message: `Pour installer l'application...`,
      position: 'bottom',
      keyboardClose: true,
      color: 'dark',
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    await toast.present();
  }

  async displayPopUpUpdate() {
    const toast = await this._toast.create({
      message: `Update available`,
      position: 'bottom',
      keyboardClose: true,
      color: 'dark',
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
          handler: async () => {
            await this._sw.activateUpdate();
            window.location.reload();
          }
        }
      ]
    });
    await toast.present();
  }
}
