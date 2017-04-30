import {
  Component,
  OnInit, OnDestroy, ViewChild
  //ElementRef,
  //ViewChild
} from '@angular/core';

import {Subscription} from 'rxjs/subscription';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  //@ViewChild('nameInput') nameInputRef: ElementRef;
  //@ViewChild('amountInput') amountInputRef: ElementRef;

  ingredientSelected: Subscription;

  selectedIndex: number;

  @ViewChild('ingredientForm') form: NgForm;


  constructor(private slService: ShoppingListService) { this.selectedIndex = -1; }

  ngOnInit() {
    this.ingredientSelected =  this.slService.ingredientSelected.subscribe(
      (index: number) => {
        this.selectedIndex = index;
        // get the ingredient and display it in the form
        const selectedIngredient = this.slService.getIngredients()[index];
        this.form.setValue({
          'name': selectedIngredient.name,
          'amount': selectedIngredient.amount
        });
        //this.form.getControl()

      }
    );
  }

  onAddItem(form: NgForm) {
    //const ingName = this.nameInputRef.nativeElement.value;
    //const ingAmount = this.amountInputRef.nativeElement.value;
    const ingName = form.value.name;
    const ingAmount = form.value.amount;
    if (this.selectedIndex < 0) { // we are adding a new ingredient
      const newIngredient = new Ingredient(ingName, ingAmount);
      this.slService.addIngredient(newIngredient);
    } else { // we are updating an existing ingredient
       this.slService.updateIngredientAt(this.selectedIndex, form.value.name, form.value.amount);
       this.selectedIndex = -1;
    }
    this.reinit();
  }

  onRemoveItem() {
    if (this.selectedIndex < 0) return;
    this.slService.removeIngredientAt(this.selectedIndex);
    this.reinit();
  }

  onClear() {
    this.reinit();
  }

  reinit() {
    this.form.reset();
    this.selectedIndex = -1;
  }


  ngOnDestroy() {
    this.ingredientSelected.unsubscribe();
  }

}
