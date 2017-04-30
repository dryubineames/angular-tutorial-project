import { Component, OnInit } from '@angular/core';

import {Subject} from 'rxjs/Subject';

import * as firebase from 'firebase';

import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  static authSubject = new Subject();


  constructor(private router: Router) {
    firebase.initializeApp(
      {apiKey: 'AIzaSyCH62h6QhRTwa0j2YfdXqt8EOrsHekVR00',
        authDomain: 'ng-recipe-book-1c82b.firebaseapp.com'
      });
  }

  ngOnInit() {
    console.log('******* App component - OnInit **************');



    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        AppComponent.authSubject.next(user);
      } else {
        // No user is signed in.
        AppComponent.authSubject.next(null);
        this.router.navigate(['/signin']);
      }
    });

  }
}
/**
 * databaseURL: 'https://ng-recipe-book-1c82b.firebaseio.com',
 projectId: 'ng-recipe-book-1c82b',
 storageBucket: 'ng-recipe-book-1c82b.appspot.com',
 messagingSenderId: '1051739447537'
 */
