import { RadiologistService } from './../radiologist.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExpenseType } from '../shared/models/expense-type.model';
import { Expense } from '../shared/models/expense.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {
  expenseDialog: boolean;

  sub: Subscription;

  expenses: Expense[];

  expense: Expense;

  expenseTypes: ExpenseType[];

  selectedExpenses: Expense[];

  // selectedExpenseType: ExpenseType;

  selectedExpenseTypeNumber: number;

  submitted: boolean;

  isEditMode = false;

  constructor(
    private radiologistService: RadiologistService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.radiologistService.getExpenseType().then((response) => {
      this.expenseTypes = response;

      this.selectedExpenseTypeNumber = this.expenseTypes[0].expenseTypeId;
      // console.log(this.selectedExpenseTypeNumber);
    });

    this.radiologistService.getExpenses().then((response) => {
      this.expenses = response;
      console.log(this.expenses);
    });

    this.sub = this.radiologistService.expenseChanged.subscribe((response) => {
      const arr = this.expenses.filter(
        (p) => p.expenseId == response.expenseId
      );
      if (arr.length > 0) {
        console.log('we came in ' + JSON.stringify(response));
        var indexOfModefied = this.expenses.findIndex(
          (p) => p.expenseId == response.expenseId
        );
        this.expenses[indexOfModefied] = response;
      } else {
        // response.totalTreatmentCost = this.selectedTreatmentType.defaultCost;

        // this.selectedExpenseTypeNumber = this.expenseTypes[0].expenseTypeId;

        // response.expenseType = { ...this.selectedExpenseType };

        // console.log(response);
        this.expenses = [response, ...this.expenses];
        // this.newPatientId = response.patientId;

        // let t: Treatment = {
        //   patientId: this.newPatientId,
        //   userId: 'maen',
        //   treatmentCost: this.selectedTreatmentType.defaultCost,
        //   treatmentTypeId: this.selectedTreatmentType.treatmentTypeId,
        // };

        // this.patientService.craeteTreatment(t);
      }
    });
  }

  openNew() {
    this.expense = {
      userId: '',
      expenseDescription: '',
      expenseValue: 0,
    };
    this.submitted = false;
    this.expenseDialog = true;
    this.isEditMode = false;

    this.selectedExpenseTypeNumber = this.expenseTypes[0].expenseTypeId;
  }

  deleteSelectedExpenses() {
    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to delete the selected Patients?',
    //   header: 'Confirm',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.patients = this.patients.filter(
    //       (val) => !this.selectedPatients.includes(val)
    //     );
    //     this.selectedPatients = null;
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Patients Deleted',
    //       life: 1500,
    //     });
    //   },
    // });
    // Delete From API
  }
  editExpense(expense: Expense) {
    this.expense = { ...expense };
    this.expenseDialog = true;
    this.isEditMode = true;
    // this.selectedExpenseType = { ...this.expense.expenseType };

    this.selectedExpenseTypeNumber = this.expense.expenseType.expenseTypeId;
  }

  deleteExpense(expense: Expense) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + expense.expenseType + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.expenses = this.expenses.filter(
          (val) => val.expenseId !== expense.expenseId
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Patient Deleted',
          life: 1500,
        });
        this.radiologistService.deleteExpense(expense.expenseId);
      },
    });
  }

  hideDialog() {
    this.expenseDialog = false;
    this.submitted = false;
    this.isEditMode = false;
  }

  saveExpense() {
    this.submitted = true;

    // if edit
    if (this.isEditMode) {
      console.log('Hiii from edit!!');
      // console.log(this.selectedExpenseType.expenseTypeId);
      // this.expense.expenseTypeId = this.selectedExpenseTypeNumber;

      // let newEditedExpense: Expense = {
      //   expenseId: this.expense.expenseId,
      //   userId: 'maen',
      //   expenseDescription: this.expense.expenseDescription,
      //   expenseValue: this.expense.expenseValue,
      //   expenseTypeId: this.selectedExpenseTypeNumber,
      // };

      this.expense.expenseTypeId = this.selectedExpenseTypeNumber;
      this.expense.expenseType = this.expenseTypes.find(
        (x) => x.expenseTypeId == this.selectedExpenseTypeNumber
      );
      console.log(this.expense);
      this.radiologistService.editExpense(this.expense.expenseId, this.expense);
      this.expenseDialog = false;
      this.isEditMode = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'expense Updated',
        life: 1500,
      });
    }
    // if add
    else {
      console.log('Hiii from add!!');
      // console.log(this.selectedExpenseType.expenseTypeId);
      let newExpense: Expense = {
        userId: '',
        expenseDescription: this.expense.expenseDescription,
        expenseValue: this.expense.expenseValue,
        expenseTypeId: this.selectedExpenseTypeNumber,
      };
      this.radiologistService.craeteExpense(newExpense);
      this.expenseDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Patient Created',
        life: 1500,
      });
    }
  }

  seeChange(event) {
    console.log(event);
    // this.selectedExpenseTypeNumber = event.value;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
