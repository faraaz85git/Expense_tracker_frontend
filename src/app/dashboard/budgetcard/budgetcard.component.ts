import { NgFor } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-budgetcard',
  standalone: true,
  templateUrl: './budgetcard.component.html',
  styleUrl: './budgetcard.component.css',
})
export class BudgetCardComponent implements OnInit {
  @Input() budget!: {
    name: string;
    total: number;
    spent: number;
    remaining: number;
    items: number;
    start_date:string;
    end_date:string;
  };

  @Input() imagesSrc!: string;
  
  ngOnInit(): void {
      console.log(this.budget,this.imagesSrc);
  }
}
