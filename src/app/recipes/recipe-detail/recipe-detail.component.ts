import { Component, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import {ActivatedRoute, Params, Route, Router} from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  constructor(private recipeService: RecipeService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    /**
    this.recipeService.recipeSelected.subscribe((event) => {
      console.log(`RecipeDetailComponent got recipe event ${event.name}`);
      this.recipe = event;
    });
     */
    let id = -1;
    this.activatedRoute.params.subscribe((params: Params) => {

      const idstr = params['id'];
      console.log(`processing query params ${idstr}, ${Number.isInteger(+idstr)}`);
      if (idstr && Number.isInteger(+idstr)) {
        id = +idstr;
        this.recipe = this.recipeService.getRecipeById(id);
        console.log(`processing query parameter ${this.recipe.name}`);
      }
    });

  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onRecipeDelete() {
    // delete the recipe
    this.recipeService.removeRecipe(this.recipe);

    // navigate back to '/recipes
    this.router.navigate(['/recipes']);
  }

}
