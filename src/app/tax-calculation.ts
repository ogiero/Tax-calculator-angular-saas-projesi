import { Injectable } from '@angular/core';

export interface TaxRequest {
  year: number;
  direction: 'forward' | 'backward';
  amount: number;
}

export interface TaxResult {
  baseAmount: number;
  tlLevy: number;
  getFundLevy: number;
  covidLevy: number;
  nhil: number;
  combinedTax: number;
  amountBeforeVat: number;
  vat: number;
  totalAmount: number;
}
@Injectable({
  providedIn: 'root'
})
export class TaxCalculationService{
  constructor() {}

  public calculate(request:TaxRequest):TaxResult{
    if (request.direction ==='forward'){
      return request.year===2023
      ?this.CalculateForward2023(request.amount)
      :this.CalculateForward2022(request.amount);

    }
    else {
      return request.year===2023
      ?this.CalculateBackward2023(request.amount)
      :this.CalculateBackward2022(request.amount);
    }
  }
  private CalculateForward2023(baseAmount: number): TaxResult {
    const tlLevy = baseAmount * 0.01;
    const getFundLevy = baseAmount * 0.025;
    const covidLevy = baseAmount * 0.01;
    const nhil = baseAmount * 0.025;
    const combinedTax = 0;
    const amountBeforeVat = baseAmount + tlLevy + getFundLevy + covidLevy + nhil;
    const vat = amountBeforeVat * 0.15;
    const totalAmount = amountBeforeVat + vat;
  
    return { baseAmount, tlLevy, getFundLevy, covidLevy, nhil, combinedTax, amountBeforeVat, vat, totalAmount };
  }
    private CalculateBackward2023(totalAmount: number): TaxResult {
      const rate = (1 + 0.01 + 0.025 + 0.01 + 0.025) * (1 + 0.15);
      const baseAmount = totalAmount / rate;   
      const result = this.CalculateForward2023(baseAmount);
      result.totalAmount = totalAmount;
      return result;
    }
  
    private CalculateForward2022(baseAmount: number): TaxResult {
      const tlLevy = baseAmount * 0.01;
      const combinedTax = baseAmount * 0.06;
      const amountBeforeVat = baseAmount + tlLevy + combinedTax;
      const vat = amountBeforeVat * 0.125;
      const totalAmount = amountBeforeVat + vat;
  
      return { baseAmount, tlLevy, getFundLevy: 0, covidLevy: 0, nhil: 0, combinedTax, amountBeforeVat, vat, totalAmount };
    }
  
    private CalculateBackward2022(totalAmount: number): TaxResult {
      const rate = (1 + 0.01 + 0.06) * (1 + 0.125);
      const baseAmount = totalAmount / rate;
      const result = this.CalculateForward2022(baseAmount);
      result.totalAmount = totalAmount;
      return result;
    }
}

