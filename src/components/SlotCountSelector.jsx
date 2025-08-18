import { useState } from 'react'
import { useSlot } from '../contexts/SlotContext'

export default function SlotCountSelector() {
  const { dispatch } = useSlot()
  const [selectedCount, setSelectedCount] = useState(3)

  const handleStart = () => {
    dispatch({ type: 'SET_SLOT_COUNT', payload: selectedCount })
  }

  return (
    <div className="slot-count-selector">
      <div className="container">
        <h1 className="title">🎰 슬롯 게임</h1>
        <p className="subtitle">몇 개의 슬롯으로 게임할까요?</p>
        
        <div className="count-options">
          {[3, 4, 5, 6, 8].map(count => (
            <button
              key={count}
              className={`count-option ${selectedCount === count ? 'active' : ''}`}
              onClick={() => setSelectedCount(count)}
            >
              {count}개
            </button>
          ))}
        </div>
        
        <button className="start-button" onClick={handleStart}>
          시작하기
        </button>
      </div>
    </div>
  )
}