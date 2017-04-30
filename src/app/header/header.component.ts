import { Component, OnInit, OnDestroy} from '@angular/core';
import {RecipeService} from '../recipes/recipe.service';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

import {AppComponent} from '../app.component';

import {AuthService} from '../auth/auth-service';

import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  private authSubscription: Subscription;

  constructor(private recipeService: RecipeService, private shoppingListService: ShoppingListService,
  private authService: AuthService) {}

  ngOnInit() {

    //load the data when the user is authenticated
       this.authSubscription = AppComponent.authSubject.subscribe((user: any) => {
         if(null != user) {
           this.onFetch();
         }
       })
  }

  onSave() {
    this.shoppingListService.storeModel();
    this.recipeService.storeModel();
  }

  onFetch() {
    this.shoppingListService.getModel();
    this.recipeService.getModel();
  }
  logout() {
    this.authService.logout();
  }

}
