import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxCalculationService, TaxRequest, TaxResult } from '../../tax-calculation';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent {
  year: number = 2023;
  direction: 'forward' | 'backward' = 'forward';

  amount: number | null = null;
  result: TaxResult | null = null;

  constructor(private taxService: TaxCalculationService) {}

  onCalculate(): void {
    if (this.amount === null || this.amount <= 0) {
      this.result = null;
      return;
    }
    const request: TaxRequest = {
      year: Number(this.year),
      direction: this.direction,
      amount: this.amount,
    };
    this.result = this.taxService.calculate(request);
  }

  onClear(): void {
    this.amount = null;
    this.result = null;
    this.year = 2023;
    this.direction = 'forward';
  }
}
