import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [],
  templateUrl: './question.component.html'
})
export class QuestionComponent {
  @Input() questionNumber = 1;
  @Input() totalQuestionCount = 1;
  
  @Input() questionText = '';
  @Input() answers: string[] = [];
  @Input() selectedAnswerIndex = -1;
  
  @Input() isPreviousQuestionAvailable = false;
  @Input() isLastQuestion = true;
  @Input() isNextButtonDisabled = true;
  
  @Output() _answerSelected = new EventEmitter<number>();
  @Output() _previousQuestionClicked = new EventEmitter<void>();
  @Output() _nextQuestionClicked = new EventEmitter<void>();
  @Output() _finishQuizClicked = new EventEmitter<void>();
  @Output() _cancelQuizClicked = new EventEmitter<void>();
  
  answerSelected(index: number) {
    this._answerSelected.emit(index);
  }
  
  previousQuestionClicked() {
    this._previousQuestionClicked.emit();
  }
  
  nextQuestionClicked() {
    this._nextQuestionClicked.emit();
  }
  
  finishQuizClicked() {
    this._finishQuizClicked.emit();
  }
  
  cancelQuizClicked() {
    this._cancelQuizClicked.emit();
  }
}
