import { useState, useEffect } from "react";
import { useSlot } from "../contexts/SlotContext";

export default function SlotGame() {
  const { state, dispatch } = useSlot();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningSlots, setSpinningSlots] = useState([]);
  const [finalResults, setFinalResults] = useState([]);

  const startSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setFinalResults([]);
    dispatch({ type: "SET_RESULT", payload: [] });
    dispatch({ type: "SET_GAME_STATE", payload: "playing" });

    // 각 슬롯을 스피닝 상태로 설정
    const spinning = state.slots.map(() => true);
    setSpinningSlots(spinning);

    // 각 슬롯에서 랜덤하게 하나씩 선택
    const results = state.slots.map((slot) => {
      const randomIndex = Math.floor(Math.random() * slot.items.length);
      return { item: slot.items[randomIndex], index: randomIndex };
    });

    // 슬롯을 하나씩 순차적으로 멈춤
    results.forEach((result, slotIndex) => {
      const stopDelay = 1500 + slotIndex * 800 + Math.random() * 500;

      setTimeout(() => {
        setSpinningSlots((prev) => {
          const newSpinning = [...prev];
          newSpinning[slotIndex] = false;
          return newSpinning;
        });

        setFinalResults((prev) => {
          const newResults = [...prev];
          newResults[slotIndex] = result;
          return newResults;
        });

        // 마지막 슬롯이 멈추면 결과 저장 및 결과 화면으로 이동
        if (slotIndex === results.length - 1) {
          setTimeout(() => {
            dispatch({
              type: "SET_RESULT",
              payload: results.map((r) => r.item),
            });
            setIsSpinning(false);
            // 3초 후 결과 화면으로 이동
            setTimeout(() => {
              dispatch({ type: "SET_GAME_STATE", payload: "result" });
            }, 3000);
          }, 500);
        }
      }, stopDelay);
    });
  };

  const resetGame = () => {
    dispatch({ type: "RESET" });
  };

  const editSlots = () => {
    dispatch({ type: "SET_GAME_STATE", payload: "slotItemCount" });
    dispatch({ type: "SET_RESULT", payload: [] });
  };

  return (
    <div className="slot-game">
      <div className="container">
        <div className="slot-machine">
          <div className="machine-body">
            <h2 className="title">{state.gameTitle || "슬롯 머신"}</h2>
            <div className="machine-top">
              <div className="machine-lights">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`light ${isSpinning ? "blinking" : ""}`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="reels-container">
              {state.slots.map((slot, slotIndex) => (
                <div key={slot.id} className="reel">
                  <div className="reel-window">
                    <div
                      className={`reel-strip ${
                        spinningSlots[slotIndex] ? "spinning" : ""
                      }`}
                      style={{
                        "--slot-count": slot.items.length,
                        "--final-position": finalResults[slotIndex]
                          ? finalResults[slotIndex].index
                          : 0,
                      }}
                    >
                      {/* 스피닝할 때 보여줄 모든 아이템들 (3번 반복) */}
                      {[...Array(3)].flatMap(() =>
                        slot.items.map((item, itemIndex) => (
                          <div
                            key={`${slotIndex}-${itemIndex}-repeat`}
                            className="reel-symbol"
                          >
                            <div className="symbol-content">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.text || `Item ${itemIndex + 1}`}
                                  className="symbol-image"
                                />
                              )}
                              {item.text && (
                                <span className="symbol-text">{item.text}</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* 결과가 정해졌을 때 표시할 최종 심볼 */}
                    {finalResults[slotIndex] && !spinningSlots[slotIndex] && (
                      <div className="final-symbol">
                        <div className="symbol-content winning">
                          {finalResults[slotIndex].item.image && (
                            <img
                              src={finalResults[slotIndex].item.image}
                              alt={
                                finalResults[slotIndex].item.text || "Winner"
                              }
                              className="symbol-image"
                            />
                          )}
                          {finalResults[slotIndex].item.text && (
                            <span className="symbol-text">
                              {finalResults[slotIndex].item.text}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="reel-label">slot {slotIndex + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="game-controls">
          <button
            className="spin-button"
            onClick={startSpin}
            disabled={isSpinning}
          >
            {isSpinning ? "돌리는 중..." : "슬롯 돌리기"}
          </button>
        </div>

        <div className="secondary-controls">
          <button className="control-button" onClick={editSlots}>
            슬롯 수정
          </button>
          <button className="control-button secondary" onClick={resetGame}>
            새 게임
          </button>
        </div>
      </div>
    </div>
  );
}
