import { useState } from 'react'
import { useSlot } from '../contexts/SlotContext'

export default function SlotItemCountSetup() {
  const { state, dispatch } = useSlot()
  const [itemCounts, setItemCounts] = useState(
    state.slots.map(() => 3) // 기본값 3개
  )

  const updateItemCount = (slotIndex, count) => {
    const newCounts = [...itemCounts]
    newCounts[slotIndex] = count
    setItemCounts(newCounts)
    
    dispatch({
      type: 'SET_SLOT_ITEM_COUNT',
      payload: {
        slotId: slotIndex,
        itemCount: count
      }
    })
  }

  const startInputPhase = () => {
    // 모든 슬롯이 최소 1개 이상의 아이템을 가져야 함
    const allValid = itemCounts.every(count => count > 0)
    if (!allValid) {
      alert('모든 슬롯에 최소 1개 이상의 아이템을 설정해주세요.')
      return
    }
    
    dispatch({ type: 'START_INPUT_PHASE' })
  }

  return (
    <div className="slot-item-count-setup">
      <div className="container">
        <h2 className="title">{state.gameTitle || '슬롯 게임'} - 아이템 개수 설정</h2>
        <p className="subtitle">각 슬롯에 들어갈 아이템의 개수를 선택하세요</p>
        
        <div className="slot-configs">
          {state.slots.map((slot, index) => (
            <div key={slot.id} className="slot-config">
              <h3 className="slot-title">슬롯 #{index + 1}</h3>
              <div className="count-selector">
                <label className="count-label">아이템 개수:</label>
                <div className="count-buttons">
                  {[1, 2, 3, 4, 5, 6].map(count => (
                    <button
                      key={count}
                      className={`count-btn ${itemCounts[index] === count ? 'active' : ''}`}
                      onClick={() => updateItemCount(index, count)}
                    >
                      {count}개
                    </button>
                  ))}
                </div>
                <div className="custom-count">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={itemCounts[index]}
                    onChange={(e) => {
                      const count = Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                      updateItemCount(index, count)
                    }}
                    className="custom-input"
                  />
                  <span className="custom-label">개 (직접입력)</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="summary">
          <h4 className="summary-title">설정 요약</h4>
          <div className="summary-content">
            {state.slots.map((slot, index) => (
              <div key={slot.id} className="summary-item">
                <span>슬롯 #{index + 1}:</span>
                <span className="summary-count">{itemCounts[index]}개 아이템</span>
              </div>
            ))}
            <div className="total-items">
              <strong>총 입력할 아이템: {itemCounts.reduce((sum, count) => sum + count, 0)}개</strong>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="back-button"
            onClick={() => dispatch({ type: 'RESET' })}
          >
            처음부터 다시
          </button>
          <button 
            className="next-button"
            onClick={startInputPhase}
          >
            아이템 입력 시작
          </button>
        </div>
      </div>
    </div>
  )
}