import {Injectable} from '@angular/core'
@Injectable({
  providedIn: 'root',
})
export class Calculating {
  calculateResultWithOneValue(value: number, operator: string) {
    let result = 0
    switch (operator) {
      case "+-":
        result = -value
        break
      case '%':
        result = value/100
        break
      case 'sqrt':
        result = value < 0 ? NaN : Math.sqrt(value)
        break
    }
    return result
  }

  calculateResultWithTwoValues(firstValue: number, secondValue: number, operator: string) {
    let result = 0
    switch (operator) {
      case "+": 
        result = firstValue + secondValue
        break
      case "-":
        result = firstValue - secondValue
        break
      case "*":
        result = firstValue * secondValue
        break
      case "/":
        result = firstValue / secondValue
        break
    }
    return result
  }

  formatNumberToMaxLength(number: number) {
    if (Math.abs(number) >= 1e8 || Math.abs(number) < 1e-7 && number !== 0) return number.toExponential(3)
  
    const isNegative = number < 0
    const maxDigits = 8 - (isNegative ? 1 : 0)
  
    if (number.toString().split('.')[0].length > maxDigits) return number.toExponential(3)
  
    return number.toString().slice(0, 8)
  }
}