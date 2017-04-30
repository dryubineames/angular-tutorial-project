import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';

import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import {RecipeListComponent} from './recipes/recipe-list/recipe-list.component';
import {RecipeDetailComponent} from './recipes/recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';

import {SigninComponent} from './auth/signin/signin.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthGuardService} from './auth/auth-guard-service';



/**
const routes: Routes = [
  {path: 'recipes', component: RecipesComponent, children: [
    {path: '', component: RecipeListComponent, children: [
      {path: ':id', component: RecipeDetailComponent, outlet: 'recipe-detail'},
      {path: '', component: RecipeStartComponent, outlet: 'recipe-detail' }]
  }]},
  {path: 'shopping-list', component: ShoppingListComponent},
  {path: '', redirectTo: '/recipes', pathMatch: 'full'}
];
 */
const routes: Routes = [
  {path: 'register', component: SignupComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'recipes', component: RecipesComponent, children: [
    // {path: '', component: RecipeListComponent} -- removed can only have one router outlet for the same path
    {path: 'new', component: RecipeEditComponent, canActivate: [AuthGuardService]},
    {path: ':id', component: RecipeDetailComponent},
    {path: ':id/edit', component: RecipeEditComponent, canActivate: [AuthGuardService]},
    {path: '', component: RecipeStartComponent, pathMatch: 'full'}]},
  {path: 'shopping-list', component: ShoppingListComponent},
  {path: '', redirectTo: 'signin', pathMatch: 'full'}

];

@NgModule( {
  imports:      [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRouterModule { }
