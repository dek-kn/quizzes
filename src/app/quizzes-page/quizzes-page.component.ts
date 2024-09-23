import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { QuizInfo } from '../types';

@Component({
  selector: 'app-quizzes-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './quizzes-page.component.html'
})
export class QuizzesPageComponent {
  @Input() quizzesLoaded = false;
  @Input() quizzes: QuizInfo[] = [];
  @Input() showRandomQuizButton = false;
  
  @Output() startQuizPressed = new EventEmitter<number>();
  @Output() startRandomQuizPressed = new EventEmitter<void>();
  
  startQuiz(id: number) {
    this.startQuizPressed.emit(id);
  }
  
  randomQuiz() {
    this.startRandomQuizPressed.emit();
  }
}
