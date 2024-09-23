import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './results.component.html'
})
export class ResultsComponent {
  @Input() correctCount = 1;
  @Input() totalCount = 1;
  @Input() timeSpent = 60;
  @Input() points = 1;
  
  @Output() _backToHomePageClicked = new EventEmitter<void>();
  
  backToHomePageClicked() {
    this._backToHomePageClicked.emit();
  }
}
