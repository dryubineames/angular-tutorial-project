import { Ingredient } from '../shared/ingredient.model';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {HTTPFirebase} from '../shared/http-firebase-service';

@Injectable()
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  ingredientSelected = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  constructor(private httpService: HTTPFirebase) {}

  getIngredients() {
     return this.ingredients.slice();
  }

  getModel() {
      return this.httpService.fetchShoppingList().
      catch((error: any) => Observable.throw(error.json().error || 'Server error')).
      map((response: Response) => {
        this.ingredients = response.json() as Ingredient[];
        }).
        subscribe(() => {
          this.ingredientsChanged.next(this.ingredients.slice());
        }
        );
  }

  storeModel() {
    this.httpService.storeShoppingList(this.ingredients).
    catch((error: any) => Observable.throw(error.json.error || 'Error stroing shopping list')).
    subscribe((response: Response) => {
      console.log(`storing shoppping list ${response}`);
    });
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    // for (let ingredient of ingredients) {
    //   this.addIngredient(ingredient);
    // }
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  removeIngredientAt(index: number) {
     console.log(`Removing ingredient at ${index}`);
     this.ingredients.splice(index, 1);
     this.ingredientsChanged.next(this.ingredients.slice());
  }
  updateIngredientAt(index: number, name: string, amount: number) {
    this.ingredients[index].name = name;
    this.ingredients[index].amount = amount;
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  setSelectedIngredient(index: number) {
    this.ingredientSelected.next(index);
  }

}
