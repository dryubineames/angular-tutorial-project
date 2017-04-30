import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {RecipeService} from '../recipe.service';
import {Recipe} from '../recipe.model';
import {Ingredient} from '../../shared/ingredient.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number = -1;
  editting = false;

  recipeForm: FormGroup;


  constructor(private activatedRoute: ActivatedRoute, private recipeService: RecipeService, private router: Router) {
  }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const idstr = params.get('id');
      if (idstr && +idstr !== Number.NaN) {
        this.id = +idstr;
        this.editting = true;
      } else {
        this.editting = false;
      }

      this.initializeForm();

      console.log(`RecipeEditComponent:ngOnInit ${this.id}, ${this.editting}, ${JSON.stringify(params)}`);
    });
  }

  getSelectedRecipe(): Recipe {
    if (this.editting && this.id > -1)
      return this.recipeService.getRecipeById(this.id);

    return null;
  }

  initializeForm() {
    let recipeName = '';
    let recipeDescription = '';
    let imagePath = null;
    const ingredients = new FormArray([]);
    let recipe = null;
    if (recipe = this.getSelectedRecipe()) {
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      imagePath = recipe.imagePath;
      if (recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          ingredients.push(new FormGroup(
            {
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(
                ingredient.amount,
                [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            }
          ));

        }
        // ^[1-9]+[0-9]*$
      }
    }
    this.recipeForm = new FormGroup(
      {
        'name': new FormControl(recipeName, Validators.required),
        'description': new FormControl(recipeDescription, Validators.required),
        'imgPath': new FormControl(imagePath, Validators.required),
        'ingredients': ingredients
      }
    );
  }

  onAddIngredient() {
    const formArray = (<FormArray>this.recipeForm.get('ingredients'));
    formArray.push(new FormGroup(
      {
        'name': new FormControl('', Validators.required),
        'amount': new FormControl(
          '1',
          [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onIngredientDelete(index: number) {
    // remove the ingredient

    const recipe = this.getSelectedRecipe();
    console.log(`removing ingredient at ${index}, ${JSON.stringify(recipe)}`);
    if (recipe) {
      if (recipe.ingredients && index < recipe.ingredients.length) { // we are deleting a real ingredient
        recipe.ingredients.splice(index);
      } else {
        (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
      }
    } else { // it is a new recipe and the user wants to remove an ingredient
      (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    }
  }

  submitRecipe() {

    console.log('#########################################################');

    console.log(this.recipeForm);

    const recipe = this.getSelectedRecipe();
    if (recipe) { // this is an update
      this.updateRecipe(recipe);
    } else {
      this.newRecipe();
    }
    this.defaultRoute();
  }

  updateRecipe(recipe) {
    const fields = this.getFormValues();
    recipe.name = fields['name'];
    recipe.description = fields['description'];
    recipe.imgPath = fields['imgPath'];
    recipe.ingredients = fields['ingredients'];

    this.recipeService.updateRecipe(recipe);

  }

  newRecipe() {
    const fields = this.getFormValues();

    const recipeName = fields['name'];
    const recipeDescription = fields['description'];
    const imgPath = fields['imgPath'];
    const ingredients = fields['ingredients'];


    const recipe = new Recipe(this.recipeService.getRecipes().length, recipeName, recipeDescription, imgPath, ingredients);
    console.log(`newRecipe name is ${JSON.stringify(recipe)}`);

    this.recipeService.addRecipe(recipe);

  }
  getFormValues(): any {
    const recipeName = this.recipeForm.value['name'];
    const recipeDescription = this.recipeForm.value['description'];
    const imgPath = this.recipeForm.value['imgPath'];
    // const ingredients = this.recipeForm.value['ingredidents'];
    const ingredients = [];

    // console.log(`getFormValue: ${JSON.stringify(this.recipeForm.get('ingredients'))}`); caused error

    // get the controls inside of the form array which are in turn <FormGroup> objects

    const ingredientControls = (<FormArray>this.recipeForm.get('ingredients')).controls;
    let ingredientName = '';
    let ingredientAmount = 1;
    for ( const control of ingredientControls)  {
      ingredientName = (<FormGroup>control).value['name'];
      ingredientAmount = (<FormGroup>control).value['amount'];
      ingredients.push(new Ingredient(ingredientName, ingredientAmount));
   }
    return {
      name: recipeName,
      description: recipeDescription,
      imgPath: imgPath,
      ingredients: ingredients
    };
  }

  onCancel() {
    this.id = -1;
    this.editting = false;
    this.recipeForm.reset();
    this.defaultRoute();

  }
  defaultRoute() {
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

}
