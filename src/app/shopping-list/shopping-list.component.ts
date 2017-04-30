import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  ingredientsChangedSubscription: Subscription;


  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.ingredientsChangedSubscription = this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
          console.log(`updated list of ingredient ${JSON.stringify(ingredients)}`);
        }
      );
  }
  ngOnDestroy() {
    this.ingredientsChangedSubscription.unsubscribe();
  }

  onEditItem(i: number) {
      this.slService.setSelectedIngredient(i);
  }

}
