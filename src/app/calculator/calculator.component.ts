import { Component, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { BUTTONS } from './buttons'
import { CommonModule } from '@angular/common'
import { Calculating } from './calculator.service'

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  constructor(private calculating: Calculating) {}

  buttons = BUTTONS
  firstValue = signal(0)
  secondValue = signal<null | number>(null)
  operator = signal<null | {event: string, text: string}>(null)
  operatorsWithOneValue: string[] = ['%', 'sqrt', '+-']
  hiddenDecimal = false
  numberAfterDecimal = signal('')
  lengthError = false

  formatNumberToMaxLength(number: number) {
    if (Math.abs(number) >= 1e8 || Math.abs(number) < 1e-7 && number !== 0) return number.toExponential(3)
  
    const isNegative = number < 0
    const maxDigits = 8 - (isNegative ? 1 : 0)
  
    if (number.toString().split('.')[0].length > maxDigits) return number.toExponential(3)
  
    return number.toString().slice(0, 8)
  }
  

  getCalculatorDisplay() {
    if (Number.isNaN(this.firstValue())) return "Error"

    let displayValue
    if (this.operator()) {
      if (this.secondValue() != null || this.hiddenDecimal) {
        !this.secondValue()
          ? displayValue = "0"
          : displayValue = this.formatNumberToMaxLength(this.secondValue()!)
      } 
      else {
        displayValue = this.formatNumberToMaxLength(this.firstValue()) + this.operator()!.text
      }
    } 
    else {
      displayValue = this.formatNumberToMaxLength(this.firstValue())
    }

    if (this.hiddenDecimal) {
      const potentialDisplay = displayValue + '.' + this.numberAfterDecimal()
      if (potentialDisplay.length <= 8) displayValue = potentialDisplay
    }

    return displayValue
  }
  
  updateDisplay(event: string | number, text: string) {
    if (event === 'C') {
      this.firstValue.set(0)
      this.secondValue.set(null)
      this.operator.set(null)
      this.hiddenDecimal = false
      this.numberAfterDecimal.set('')
      this.lengthError = false
      return
    }

    if (Number.isInteger(event) || event === '.') {
      const isSecondValue = this.operator() !== null
      const currentValue = isSecondValue ? (this.secondValue() ?? 0) : this.firstValue()
      const currentValueStr = currentValue.toString()
      
      const fullNumber = this.hiddenDecimal 
        ? currentValueStr + '.' + this.numberAfterDecimal()
        : currentValueStr
        
      if (fullNumber.length >= 8 && event !== '.') {
        this.lengthError = true
        return
      }

      if (event === '.') {
        if (this.hiddenDecimal || currentValueStr.includes('.')) return
        this.hiddenDecimal = true
        if (isSecondValue && !this.secondValue()) this.secondValue.set(0)
        return
      }

      if (!isSecondValue) {
        if (!this.hiddenDecimal) {
          const newValue = currentValue === 0 ? Number(event) : Number(currentValueStr + event)
          this.firstValue.set(Number(this.formatNumberToMaxLength(newValue)))
        } 
        else {
          if ((this.numberAfterDecimal().length + currentValueStr.length + 1) <= 8) this.numberAfterDecimal.update(oldValue => oldValue + event)
        }
      } 
      else {
        if (!this.hiddenDecimal) {
          const newValue = currentValue === 0 ? Number(event) : Number(currentValueStr + event)
          this.secondValue.set(Number(this.formatNumberToMaxLength(newValue)))
        } 
        else {
          if ((this.numberAfterDecimal().length + currentValueStr.length + 1) <= 8) this.numberAfterDecimal.update(oldValue => oldValue + event)
        }
      }
      return
    }

    this.lengthError = false

    if (this.hiddenDecimal) {
      const decimal = this.numberAfterDecimal()
      if (decimal) {
        if (this.secondValue() !== null) {
          const newValue = Number(this.secondValue()!.toString() + '.' + decimal)
          this.secondValue.set(Number(this.formatNumberToMaxLength(newValue)))
        } 
        else if (this.operator()) {
          const newValue = Number('0.' + decimal)
          this.secondValue.set(Number(this.formatNumberToMaxLength(newValue)))
        } 
        else {
          const newValue = Number(this.firstValue().toString() + '.' + decimal)
          this.firstValue.set(Number(this.formatNumberToMaxLength(newValue)))
        }
      }
      this.hiddenDecimal = false
      this.numberAfterDecimal.set('')
    }

    if (this.operatorsWithOneValue.includes(event.toString())) {
      const valueToOperate = this.secondValue() !== null ? this.secondValue()! : this.firstValue()
      const result = this.calculating.calculateResultWithOneValue(valueToOperate, event.toString())
      
      this.secondValue()
        ? this.secondValue.set(Number(this.formatNumberToMaxLength(result)))
        : this.firstValue.set(Number(this.formatNumberToMaxLength(result)))
      return
    }

    if (event === '=') {
      if (this.operator() && this.secondValue() !== null) {
        const result = this.calculating.calculateResultWithTwoValues(this.firstValue(), this.secondValue()!, this.operator()!.event)
        this.firstValue.set(Number(this.formatNumberToMaxLength(result)))
        this.secondValue.set(null)
        this.operator.set(null)
      }
    } else {
      if (this.operator() && this.secondValue() !== null) {
        const result = this.calculating.calculateResultWithTwoValues(this.firstValue(), this.secondValue()!, this.operator()!.event)
        this.firstValue.set(Number(this.formatNumberToMaxLength(result)))
        this.secondValue.set(null)
      }
      this.operator.set({ event: event.toString(), text })
    }
  }
} 