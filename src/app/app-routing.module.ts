import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';

import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import {RecipeListComponent} from './recipes/recipe-list/recipe-list.component';
import {RecipeDetailComponent} from './recipes/recipe-detail/recipe-detail.component';



const routes: Routes = [
  {path: 'recipes', component: RecipesComponent, children: [
    {path: '', component: RecipeListComponent},
    {path: '' , component: RecipeDetailComponent, outlet: 'recipe-detail'}
  ]},
  {path: 'shopping-list', component: ShoppingListComponent},
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  {path: '**', redirectTo: '/recipes'}
];

@NgModule( {
  imports:      [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRouterModule { }
