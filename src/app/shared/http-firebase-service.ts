/**
 * Created by markeames on 28/4/17.
 */
import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import {RecipeService} from '../recipes/recipe.service';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

import {Ingredient} from './ingredient.model';
import {Recipe} from '../recipes/recipe.model';
import {AuthService} from '../auth/auth-service';


@Injectable()
export class HTTPFirebase {

  private recipeEndpoint = 'https://ng-recipe-book-1c82b.firebaseio.com/recipe.json?auth=';
  private shoppingListEndpoint = 'https://ng-recipe-book-1c82b.firebaseio.com/shoppinglist.json?auth=';

  constructor(private httpComms: Http, private authService: AuthService) {
  }

  fetchRecipes(): Observable<Response> {
    return this.httpComms.get(this.recipeEndpoint + this.authService.getToken());
  }

  fetchShoppingList(): Observable<Response> {

    return this.httpComms.get(this.shoppingListEndpoint + this.authService.getToken());

  }
  /**
   * getHeroes(): Promise<Hero[]> {
    return this.http.get(this.heroesUrl)
               .toPromise()
               .then(response => response.json().data as Hero[])
               .catch(this.handleError);
  }
   private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
   */

  storeRecipes(recipes: Recipe[]): Observable<Response> {
    return this.httpComms.put(this.recipeEndpoint + this.authService.getToken(), recipes);
  }

  storeShoppingList(shoppingList: Ingredient[]): Observable<Response> {
    return this.httpComms.put(this.shoppingListEndpoint + this.authService.getToken(), shoppingList);
  }
}
