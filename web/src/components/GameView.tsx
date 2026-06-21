import { ChoiceStep } from './ChoiceStep';
import { CodeStep } from './CodeStep';
import { EndStep } from './EndStep';
import { FeedbackPanel } from './FeedbackPanel';
import { NarrativeStep } from './NarrativeStep';
import { useGameEngine, type FeedbackState, type GamePhase } from '../hooks/useGameEngine';
import type { StoryMeta } from '../types/story';
import type { GameHistoryEntry } from '../utils/gameHistory';

type Props = {
  story: StoryMeta;
  historyEntry: GameHistoryEntry;
  onHistoryPush: (
    nodeId: string,
    phase: GamePhase,
    totalPoints: number,
    feedback: FeedbackState | null,
  ) => void;
  onHistoryReplace: (
    nodeId: string,
    phase: GamePhase,
    totalPoints: number,
    feedback: FeedbackState | null,
  ) => void;
  onExit: () => void;
  onFeaturesChanged?: () => void;
};

export function GameView({
  story,
  historyEntry,
  onHistoryPush,
  onHistoryReplace,
  onExit,
  onFeaturesChanged,
}: Props) {
  const engine = useGameEngine(story, {
    historyEntry,
    onHistoryPush,
    onHistoryReplace,
    onFeaturesChanged,
  });
  const { currentNode, phase, feedback, totalPoints } = engine;

  if (phase === 'loading' || !currentNode) {
    return (
      <div className="game-loading">
        <p>Avataan tarinaa…</p>
      </div>
    );
  }

  return (
    <div className="game-view">
      <header className="game-header">
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          ← Takaisin
        </button>
        <h1>{story.title}</h1>
      </header>

      <main className="game-main">
        {currentNode.type === 'narrative' && phase === 'playing' && (
          <NarrativeStep node={currentNode} onContinue={engine.advanceNarrative} />
        )}
        {currentNode.type === 'choice' && phase === 'playing' && (
          <ChoiceStep
            node={currentNode}
            shuffleKey={engine.currentNodeId ?? story.startNode}
            onChoose={engine.submitChoice}
          />
        )}
        {currentNode.type === 'code' && phase === 'playing' && (
          <CodeStep node={currentNode} onSubmit={engine.submitCode} />
        )}
        {phase === 'feedback' && feedback && (
          <FeedbackPanel feedback={feedback} onContinue={engine.continueAfterFeedback} />
        )}
        {currentNode.type === 'end' && phase === 'ended' && (
          <EndStep
            node={currentNode}
            totalPoints={totalPoints}
            onRestart={engine.restart}
            onExit={onExit}
          />
        )}
      </main>
    </div>
  );
}
