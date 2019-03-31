import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-new-survey',
  templateUrl: './new-survey.page.html',
  styleUrls: ['./new-survey.page.scss'],
})
export class NewSurveyPage implements OnInit {

  constructor(private menu: MenuController, private _router: Router) { }

  ngOnInit() {
  }

  startSurvey() {
    this._router.navigateByUrl('start-survey');
  }

}
