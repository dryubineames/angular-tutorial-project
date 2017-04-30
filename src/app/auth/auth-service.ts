/**
 * Created by markeames on 29/4/17.
 */
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import * as firebase from 'firebase';

@Injectable()
export class AuthService {

  private token: any;

  constructor(private router: Router) {
    this.token = null;
  }

  /**
   * Method to register a new user via email and password
   */
  registerUser(email: string, pwd: string) {
    console.log(`AuthService registerUser ${email}, : ${pwd}`);
    firebase.auth().createUserWithEmailAndPassword(email, pwd)
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.name;
        const errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      }).then((response) => {
      //this.router.navigate(['/']);
      firebase.auth().currentUser.getToken()
        .then(
          (token: string) => this.token = token
        );
    });
  }

  authenticateUser(email, pwd) {
    firebase.auth().signInWithEmailAndPassword(email, pwd).then(
      response => {
        //this.router.navigate(['/']);
        firebase.auth().currentUser.getToken()
          .then(
            (token: string) => { this.token = token; console.log(firebase.auth().currentUser + ' token: ' + this.token); }
          );
      }
    )
      .catch(
        error => console.log(error)
      );
    console.log(`Authenticate user ${this.token}`);
  }

  logout() {
    firebase.auth().signOut();
    this.token = null;
  }

  getToken() {
    if (!firebase.auth().currentUser) {
      this.token = null;
    } else {
      firebase.auth().currentUser.getToken()
        .then(
          (token: string) => this.token = token
        );
    }
    return this.token;
  }

  isAuthenticated() {
    return this.token != null;
  }

}
