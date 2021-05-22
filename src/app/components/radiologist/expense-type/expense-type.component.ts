import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { RadiologistService } from '../radiologist.service';
import { ExpenseType } from '../shared/models/expense-type.model';

@Component({
  selector: 'app-expense-type',
  templateUrl: './expense-type.component.html',
  styleUrls: ['./expense-type.component.css'],
})
export class ExpenseTypeComponent implements OnInit {
  sub: Subscription;

  expenseTypes: ExpenseType[];
  expenseType: ExpenseType;

  expenseTypeDialog: boolean;
  submitted: boolean;

  isEditMode: boolean = false;
  selectedExpenseType: ExpenseType[];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private radiologistService: RadiologistService
  ) {}

  ngOnInit(): void {
    this.radiologistService.getExpenseType().then((data) => {
      this.expenseTypes = data;
    });

    this.sub = this.radiologistService.expenseTypeChanged.subscribe(
      (response) => {
        const arr = this.expenseTypes.filter(
          (p) => p.expenseTypeId == response.expenseTypeId
        );

        if (arr.length > 0) {
          var indexOfModefied = this.expenseTypes.findIndex(
            (p) => p.expenseTypeId == response.expenseTypeId
          );

          this.expenseTypes[indexOfModefied] = response;
        } else {
          this.expenseTypes = [response, ...this.expenseTypes];
        }
      }
    );
  }
  openNew() {
    this.expenseType = {
      userId: null,
      expenseTypeName: '',
    };
    this.submitted = false;
    this.expenseTypeDialog = true;
    this.isEditMode = false;
  }

  editExpenseType(expenseType: ExpenseType) {
    this.expenseType = { ...expenseType };
    this.expenseTypeDialog = true;
    this.isEditMode = true;
  }

  deleteExpenseType(expenseType: ExpenseType) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + expenseType.expenseTypeName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.expenseTypes = this.expenseTypes.filter(
          (val) => val.expenseTypeId !== expenseType.expenseTypeId
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Patient Deleted',
          life: 1500,
        });
        console.log('this is from delete : ', expenseType);
        this.radiologistService.deleteExpenseType(expenseType.expenseTypeId);
      },
    });
  }

  saveExpenseType() {
    this.submitted = true;
    // if (this.treatmentType. && this.patient.firstName.trim()) {
    // if edit
    if (this.isEditMode) {
      console.log('Hiii from edit!!');
      console.log(this.expenseType);
      this.radiologistService.editExpenseType(
        this.expenseType.expenseTypeId,
        this.expenseType
      );
      this.expenseTypeDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Patient Updated',
        life: 1500,
      });
    }
    // if add
    else {
      this.isEditMode = false;

      let newExpenseType: ExpenseType = {
        userId: '',
        expenseTypeName: this.expenseType.expenseTypeName,
      };
      this.radiologistService.craeteExpenseType(newExpenseType);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Patient Created',
        life: 1500,
      });
      this.expenseTypeDialog = false;
    }
    // }
  }

  hideDialog() {
    this.expenseTypeDialog = false;
    this.submitted = false;
    // this.isEditMode = false;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
