import type { CurrentQuestion } from 'src/types';
import { writable } from 'svelte/store';
import { sponsorSlideQuestion } from './sponsorSlide';

const currentQuestion = writable<CurrentQuestion>(sponsorSlideQuestion);

export const currentQuestionSubscribe = currentQuestion.subscribe;
