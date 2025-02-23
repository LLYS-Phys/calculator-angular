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

  getCalculatorDisplay() {
    if (Number.isNaN(this.firstValue())) return "Error"

    let displayValue
    if (this.operator()) {
      if (this.secondValue() || this.hiddenDecimal) {
        !this.secondValue()
          ? displayValue = "0"
          : displayValue = this.calculating.formatNumberToMaxLength(this.secondValue()!)
      } 
      else {
        displayValue = this.calculating.formatNumberToMaxLength(this.firstValue()) + this.operator()!.text
      }
    } 
    else {
      displayValue = this.calculating.formatNumberToMaxLength(this.firstValue())
    }

    if (this.hiddenDecimal) {
      const tempDisplay = displayValue + '.' + this.numberAfterDecimal()
      if (tempDisplay.length <= 8) displayValue = tempDisplay
    }

    return displayValue
  }
  
  updateDisplay(event: string | number, text: string) {
    if (event == 'C') {
      this.firstValue.set(0)
      this.secondValue.set(null)
      this.operator.set(null)
      this.hiddenDecimal = false
      this.numberAfterDecimal.set('')
      this.lengthError = false
      return
    }

    if (Number.isInteger(event) || event == '.') {
      const currentValue = this.operator() 
        ? this.secondValue() ? this.secondValue() : 0
        : this.firstValue()
      
      const fullNumber = this.hiddenDecimal 
        ? currentValue!.toString() + '.' + this.numberAfterDecimal()
        : currentValue!.toString()
        
      if (fullNumber.length >= 8 && event != '.') {
        this.lengthError = true
        return
      }

      if (event == '.') {
        if (this.hiddenDecimal || currentValue!.toString().includes('.')) return
        this.hiddenDecimal = true
        if (this.operator() && !this.secondValue()) this.secondValue.set(0)
        return
      }

      if (!this.operator()) {
        if (!this.hiddenDecimal) {
          const newValue = currentValue == 0 ? Number(event) : Number(currentValue!.toString() + event)
          this.firstValue.set(Number(this.calculating.formatNumberToMaxLength(newValue)))
        } 
        else {
          if ((this.numberAfterDecimal().length + currentValue!.toString().length + 1) <= 8) this.numberAfterDecimal.update(oldValue => oldValue + event)
        }
      } 
      else {
        if (!this.hiddenDecimal) {
          const newValue = currentValue == 0 ? Number(event) : Number(currentValue!.toString() + event)
          this.secondValue.set(Number(this.calculating.formatNumberToMaxLength(newValue)))
        } 
        else {
          if ((this.numberAfterDecimal().length + currentValue!.toString().length + 1) <= 8) this.numberAfterDecimal.update(oldValue => oldValue + event)
        }
      }
      return
    }

    this.lengthError = false

    if (this.hiddenDecimal) {
      if (this.numberAfterDecimal()) {
        if (this.secondValue()) {
          const newValue = Number(this.secondValue()!.toString() + '.' + this.numberAfterDecimal())
          this.secondValue.set(Number(this.calculating.formatNumberToMaxLength(newValue)))
        } 
        else if (this.operator()) {
          const newValue = Number('0.' + this.numberAfterDecimal())
          this.secondValue.set(Number(this.calculating.formatNumberToMaxLength(newValue)))
        } 
        else {
          const newValue = Number(this.firstValue().toString() + '.' + this.numberAfterDecimal())
          this.firstValue.set(Number(this.calculating.formatNumberToMaxLength(newValue)))
        }
      }
      this.hiddenDecimal = false
      this.numberAfterDecimal.set('')
    }

    if (this.operatorsWithOneValue.includes(event.toString())) {
      const valueToOperate = this.secondValue() ? this.secondValue()! : this.firstValue()
      const result = this.calculating.calculateResultWithOneValue(valueToOperate, event.toString())
      
      this.secondValue()
        ? this.secondValue.set(Number(this.calculating.formatNumberToMaxLength(result)))
        : this.firstValue.set(Number(this.calculating.formatNumberToMaxLength(result)))
      return
    }

    if (event == '=') {
      if (this.operator() && this.secondValue()) {
        const result = this.calculating.calculateResultWithTwoValues(this.firstValue(), this.secondValue()!, this.operator()!.event)
        this.firstValue.set(Number(this.calculating.formatNumberToMaxLength(result)))
        this.secondValue.set(null)
        this.operator.set(null)
      }
    } 
    else {
      if (this.operator() && this.secondValue()) {
        const result = this.calculating.calculateResultWithTwoValues(this.firstValue(), this.secondValue()!, this.operator()!.event)
        this.firstValue.set(Number(this.calculating.formatNumberToMaxLength(result)))
        this.secondValue.set(null)
      }
      this.operator.set({ event: event.toString(), text: text })
    }
  }
} 