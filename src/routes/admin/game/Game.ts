import type { Question, Round } from './types';

interface RoundData {
	questions: Map<number, Question>;
}

interface GameData {
	rounds: Map<number, RoundData>;
}

export function initGame(game: GameData) {
	function addRound(round: RoundData): void {
		const roundNumber = game.rounds.size + 1;
		game.rounds.set(roundNumber, round);
	}

	function addQuestion(roundNumber: number, question: Question): { ok: boolean; error?: Error } {
		const round = game.rounds.get(roundNumber);
		if (!round) {
			return {
				ok: false,
				error: new Error(`Round ${roundNumber} does not exist`)
			};
		}
		const newQuestionNumber = round.questions.size + 1;
		round.questions.set(newQuestionNumber, question);
		return { ok: true };
	}

	function getRound(roundNumber: number): Round {
		const round = game.rounds.get(roundNumber);
		if (!round) {
			return {
				questions: []
			};
		}

		return {
			questions: Array.from(round.questions).map((r) => ({ questionNumber: r[0], question: r[1] }))
		};
	}
	return {
		addRound,
		addQuestion,
		getRound
	};
}
