import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {

  @Input() data: any;
  @Input() text: any;


  sharelist = [{ 'medium': 'Whatsapp', 'name': 'Whatsapp', 'icon': '/assets/images/whatsapp.svg' }];

  constructor(private socialSharing: SocialSharing, private _modalController: ModalController) { }

  ngOnInit() { }

  async share(item) {

    if (item === 'whatsapp') {
      // Text + Image or URL works
      this.socialSharing.shareViaWhatsApp(this.text.sharetext, null, this.data.shareurl).then(() => {
        // Success
      }).catch((e) => {
        // Error!
      });
    }


  }


  closeModal() {
    this._modalController.dismiss();
  }

  onClick(item) {
    this._modalController.dismiss({item});
  }


}
