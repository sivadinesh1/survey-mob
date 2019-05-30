import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-all-industries',
  templateUrl: './all-industries.component.html',
  styleUrls: ['./all-industries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllIndustriesComponent implements OnInit {


  @Input() data: any;
  clientsdata: any;
  origClientdata: any;

  constructor(private _cdr: ChangeDetectorRef, private _modalController: ModalController) { }

  ngOnInit() {
    this.clientsdata = this.data;
    this.origClientdata = this.data;
    console.log('object>>>>>> ' + JSON.stringify(this.data));
    console.log('object>>clientsdata>>>> ' + JSON.stringify(this.clientsdata));
    this._cdr.markForCheck();
  }



  closeModal() {
    this._modalController.dismiss();
  }

  onClick(item) {
    this._modalController.dismiss({item});
  }

}
