import { Component, OnInit, NgZone } from '@angular/core';
//import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import { AmplifyService } from 'aws-amplify-angular';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(public amplifyService: AmplifyService, public router: Router, private ngZone:NgZone) {
    this.amplifyService = amplifyService;

    this.amplifyService.authStateChange$
      .subscribe(authState => {
        if (authState.state === 'signedIn') {
          this.ngZone.run(async () => {this.router.navigate(['/home'])}).then();
        }
      });

  }

  ngOnInit(): void {
  }

}
