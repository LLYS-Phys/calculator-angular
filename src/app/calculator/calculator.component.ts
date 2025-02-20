import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BUTTONS } from './buttons'

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  buttons = BUTTONS
}
