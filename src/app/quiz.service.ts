import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Quiz, QuizCollection, QuizInfo, ApiResult, LoadingInfo } from './types';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  QUIZ_COUNT = 10;
  REQUEST_URL = 'https://opentdb.com/api.php?amount=10';

  quizzesLoaded = false;
  quizzes: QuizCollection = {};

  constructor(private http: HttpClient) { }
  
  loadQuizzes() {
    return new Promise<void>((resolve, reject) => {
      let loadingInfo: LoadingInfo = {
        responsesLeft: this.QUIZ_COUNT
      };
      
      for (let i = 1; i <= this.QUIZ_COUNT; ++i) {
        setTimeout(() => this.loadQuiz(i, loadingInfo, resolve, reject), (i - 1) * 6000);
      }
    });
  }
  
  loadQuiz(quizId: number, loadingInfo: LoadingInfo, resolve: Function, reject: Function) {
    this.http
      .get<ApiResult>(this.REQUEST_URL, { headers: { Accept: 'application/json' } })
      .subscribe(
        (result: ApiResult) => this.handleLoadingQuizResult(result, quizId, loadingInfo, resolve),
        (error: any) => reject(new Error())
      );
  }
  
  handleLoadingQuizResult(result: ApiResult, quizId: number, loadingInfo: LoadingInfo, resolve: Function) {
    const questions = result.results.map((question) => {
      const randomizedAnswers = this.randomizeArray(
        question.incorrect_answers
          .map(item => [item, false])
          .concat([[question.correct_answer, true]])
      )
      
      const answers = randomizedAnswers.map(([answer, isCorrect]: [any, any]) => answer);
      const correctAnswerIndex = randomizedAnswers.findIndex(([answer, isCorrect]: [any, any]) => isCorrect);
    
      return {
        text: question.question,
        answers: answers,
        correctAnswerIndex: correctAnswerIndex
      }
    });
    
    this.quizzes[quizId] = {
      title: 'Quiz',
      questions: questions
    }
    
    loadingInfo.responsesLeft--;
    if (loadingInfo.responsesLeft == 0) {
      resolve();
    }
  }
  
  async fetchQuizzes(): Promise<QuizInfo[]> {
    try {
      if (!this.quizzesLoaded) {
        await this.loadQuizzes();
      }

      const quizEntries: [string, Quiz][] = Object.entries(this.quizzes);
      quizEntries.sort(
        (a: [string, Quiz], b: [string, Quiz]) =>
          Number(a[0]) - Number(b[0])
      );
      
      return quizEntries.map(
        ([quizId, quiz]: [string, Quiz]) => ({
          id: Number(quizId),
          title: quiz.title,
          numQuestions: quiz.questions.length
        })
      );
    } catch (error: any) {
      return [];
    }
  }
  
  getQuiz(id: number) {
    return (id in this.quizzes) ? this.quizzes[id] : null;
  }
  
  randomizeArray(arr: Array<any>): Array<any> {
    const arrWithRandomNumbers = arr.map(item => [item, Math.random()]);
    arrWithRandomNumbers.sort((a, b) => a[1] - b[1]);
    
    return arrWithRandomNumbers.map(item => item[0]);
  }
}
