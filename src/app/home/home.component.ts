import { Component, OnInit } from '@angular/core';
import { APIService } from '../API.service';
import { Auth } from 'aws-amplify'
import { User } from '../modules/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userId: string;
  userName: string;
  user = new User('', '', '', '');
  userCreated: boolean;

  constructor(private api: APIService, public router: Router) {}

  ngOnInit() {
    Auth.currentAuthenticatedUser({
        bypassCache: false
      }).then(async user => {
        this.userName = user.attributes.email;
        this.userId = user.attributes.sub;
        let result = await this.api.GetTodo(this.userId);
        if (!result) {
          this.userCreated = false;
          this.user = new User('', '', '', '');
        } else {
          this.userCreated = true;
          this.user = new User(
            this.userId,
            result.username,
            result.firstName,
            result.lastName
          )
        }
      })
      .catch(err => console.log(err));
  }

  getType(): string {
    return this.userCreated ? 'UpdateTodo' : 'CreateTodo';
  }
  
  async updateProfile() {
    const user = {
      id: this.userId,
      username: this.user.firstName + '_' + this.user.lastName,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
    }
    await this.api[this.getType()](user);
  }

  logOut() {
    Auth.signOut({ global: true })
    .then(data => {
      this.router.navigate(['/login']);
    })
    .catch(err => console.log(err));
  }

}
