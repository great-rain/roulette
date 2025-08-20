import { useSlot } from "../contexts/SlotContext";

function ResultScreen() {
  const { state, dispatch } = useSlot();

  const playAgain = () => {
    dispatch({ type: "SET_GAME_STATE", payload: "ready" });
    dispatch({ type: "SET_RESULT", payload: [] });
  };

  const editSlots = () => {
    dispatch({ type: "SET_GAME_STATE", payload: "slotItemCount" });
    dispatch({ type: "SET_RESULT", payload: [] });
  };

  const startNewGame = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <div className="container">
      <div className="result-screen">
        <div className="jackpot-display">
          <div className="jackpot-header">
            <div className="jackpot-lights">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="jackpot-light blinking"></div>
              ))}
            </div>
            <h2 className="jackpot-title">🎉 {state.gameTitle} 결과 🎉</h2>
          </div>

          <div className="winning-combination">
            {state.result.map((resultItem, index) => (
              <div key={index} className="winner-reel">
                <div className="winner-symbol">
                  <div className="winner-content">
                    {resultItem.image && (
                      <img
                        src={resultItem.image}
                        alt={resultItem.text || "Winner"}
                        className="winner-image"
                      />
                    )}
                    {resultItem.text && (
                      <span className="winner-text">{resultItem.text}</span>
                    )}
                  </div>
                </div>
                <div className="winner-label">슬롯 {index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="result-actions">
          <button className="action-button primary" onClick={playAgain}>
            다시 뽑기
          </button>
          <button className="action-button secondary" onClick={editSlots}>
            항목 수정
          </button>
          <button className="action-button tertiary" onClick={startNewGame}>
            새 게임 시작
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;
