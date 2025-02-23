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
}