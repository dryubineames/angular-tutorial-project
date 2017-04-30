import {Injectable} from '@angular/core';
import {Response} from '@angular/http';


import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {HTTPFirebase} from '../shared/http-firebase-service';

@Injectable()
export class RecipeService {

  private recipes: Array<Recipe>;


    /**
    Recipe[] = [
    new Recipe(0,
      'Tasty Schnitzel',
      'A super-tasty Schnitzel - just awesome!',
      'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ]),
    new Recipe(1, 'Big Fat Burger',
      'What else you need to say?',
      'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1)
      ])
  ];
*/
  recipeListChanged = new Subject<Recipe[]>();

  constructor(private slService: ShoppingListService, private httpService: HTTPFirebase) {
    this.getModel();
  }

  getModel() {
      this.httpService.fetchRecipes().
      catch((error: any) => Observable.throw(error.json().error || 'Server error')).
        map((response: Response) => {
        this.recipes = response.json() as Recipe[];
        console.log(`in getModel() recipes list is ${JSON.stringify(this.recipes)}`);
        for (const recipe of this.recipes) {
          if (!recipe['ingredients']) {
            recipe['ingredients'] = [];
          }
        }
      }).
      subscribe(() => {
        console.log(`Recipe service getModel(), subscribe, ${JSON.stringify(this.recipes)}`);
      this.recipeListChanged.next(this.recipes.slice());
    }
    );
  }

  storeModel() {
    this.httpService.storeRecipes(this.recipes).
    catch((error: any) => Observable.throw(error.json.error ||
      'Error stroing shopping list')).
    subscribe((response: Response) => {
      console.log(`storing recipe list ${response}`);
    });
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipeById(id: number) {
    let i = 0;
    while (i < this.recipes.length) {
      if (this.recipes[i].id === id) {
        return this.recipes[i];
      }
      i++;
    }
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeListChanged.next(this.getRecipes());
  }

  updateRecipe(recipe: Recipe) {
    this.recipes[recipe.id] = recipe;
    this.recipeListChanged.next(this.getRecipes());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  removeRecipe(recipe: Recipe) {
    this.recipes.splice(recipe.id, 1);
    this.recipeListChanged.next(this.getRecipes());
  }
}
