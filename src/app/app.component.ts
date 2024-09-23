import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

import { QuizzesPageComponent } from './quizzes-page/quizzes-page.component';
import { QuestionComponent } from './question/question.component';
import { ResultsComponent } from './results/results.component';
import { QuizService } from './quiz.service';

import { State, Quiz, QuizInfo } from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuizzesPageComponent, QuestionComponent, ResultsComponent, MatToolbarModule, MatCardModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  quizzesLoaded = false;
  quizzesLoadingFailed = false;
  quizzes: QuizInfo[] = [];
  currentQuiz: Quiz | null = null;
  state: any = {
    page: 'quizList'
  };
  
  constructor(private quizService: QuizService) {}
  
  async ngOnInit() {
    this.loadQuizzes();
  }

  randomQuiz() {
    if (this.state.page == 'quizList') {
      const randomQuizId = this.quizzes[this.getRandomInteger(this.quizzes.length)].id;
      this.startQuiz(randomQuizId);
    }
  }
  
  startQuiz(quizId: number) {
    if (this.state.page == 'quizList') {
      const quiz = this.quizService.getQuiz(quizId);
      
      if (quiz != null) {
        this.currentQuiz = quiz;
        
        this.state = {
          page: 'question',
          quizId: quizId,
          questionNumber: 0,
          answers: [],
          startTime: Date.now()
        }
      }
    }
  }
  
  switchToHomePage() {
    this.state = {
      page: 'quizList'
    };
  }
  
  answerSelected(index: number) {
    if (this.state.page == 'question') {
      if (this.isQuestionAnswered()) {
        this.state.answers[this.state.questionNumber] = index;
      } else {
        this.state.answers.push(index);
      }
    }
  }
  
  previousQuestionClicked() {
    if (this.state.page == 'question' && !this.isFirstQuestion()) {
      this.state.questionNumber--;
    }
  }
  
  nextQuestionClicked() {
    if (this.state.page == 'question' && !this.isLastQuestion() && this.isQuestionAnswered()) {
      this.state.questionNumber++;
    }
  }
  
  finishQuizClicked() {
    if (this.state.page == 'question' && this.isLastQuestion() && this.isQuestionAnswered()) {
      const currentTime = Date.now();
      const timeSpent = Math.floor((currentTime - this.state.startTime) / 1000);
      
      const correctCount = this.state.answers.reduce(
        (count: number, answerIndex: number, questionNumber: number) => {
          const isAnswerCorrect = (answerIndex == this.currentQuiz!.questions[questionNumber].correctAnswerIndex);
          return isAnswerCorrect ? (count + 1) : count;
        }
      );
      
      const totalCount = this.currentQuiz!.questions.length;
      
      this.currentQuiz = null;
      this.state = {
        page: 'results',
        correctCount: correctCount,
        totalCount: totalCount,
        timeSpent: timeSpent,
        points: correctCount
      }
    }
  }
  
  cancelQuizClicked() {
    this.currentQuiz = null;
    this.switchToHomePage();
  }
  
  async loadQuizzes() {
    const quizzes = await this.quizService.fetchQuizzes();
    
    if (quizzes.length > 0) {
      this.quizzes = quizzes;
      this.quizzesLoaded = true;
    } else {
      this.quizzesLoadingFailed = true;
    }
  }
  
  // Get a random integer from 0 to max, not including max
  getRandomInteger(max: number): number {
    return Math.floor(Math.random() * this.quizzes.length);
  }
  
  isFirstQuestion(): boolean {
    return this.state.questionNumber <= 0;
  }
  
  isLastQuestion(): boolean {
    return this.state.questionNumber >= this.currentQuiz!.questions.length - 1;
  }
  
  isQuestionAnswered(): boolean {
    return this.state.questionNumber < this.state.answers.length;
  }
  
  getSelectedAnswerIndex(): number {
    return this.isQuestionAnswered() ? this.state.answers[this.state.questionNumber] : -1;
  }
  
  getCurrentQuestionText(): string {
    return this.currentQuiz!.questions[this.state.questionNumber].text;
  }
  
  getCurrentQuestionAnswers(): string[] {
    return this.currentQuiz!.questions[this.state.questionNumber].answers;
  }
}
