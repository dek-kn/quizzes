export type State = QuizListState | QuestionState | ResultsState;

export type QuizListState = {
  page: string
}

export type QuestionState = {
  page: string,
  quizId: number,
  questionNumber: number,
  answers: number[],
  startTime: number
}

export type ResultsState = {
  page: string,
  correctCount: number,
  totalCount: number,
  timeSpent: number,
  points: number
}

export type QuizInfo = {
  id: number,
  title: string,
  numQuestions: number
}

export type Quiz = {
  title: string,
  questions: {
    text: string,
    answers: string[],
    correctAnswerIndex: number
  }[]
}

export type QuizCollection = {
  [key: number]: Quiz
}

export type ApiResult = {
  response_code: number,
  results: {
    type: string,
    difficulty: string,
    category: string,
    question: string,
    correct_answer: string,
    incorrect_answers: Array<string>
  }[]
}

export type LoadingInfo = {
  responsesLeft: number
}
