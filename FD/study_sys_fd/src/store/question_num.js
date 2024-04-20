import { defineStore } from 'pinia';

// 题组数
export const useQuestionStore = defineStore('question', {
  state: () => ({
    questionNum: 0
  }),
  actions: {
    setQuestionNum(num) {
      this.questionNum = num;
    }
  }
});
