import { useState } from 'react'
import { useSlot } from '../contexts/SlotContext'

function TitleInput() {
  const { state, dispatch } = useSlot()
  const [title, setTitle] = useState(state.gameTitle || '')

  const clearStorage = () => {
    localStorage.removeItem('slotGameData')
    window.location.reload()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      dispatch({ type: 'SET_GAME_TITLE', payload: title.trim() })
    }
  }

  return (
    <div className="container">
      <div className="title-input">
        <h1 className="title">게임 제목 설정</h1>
        <p className="subtitle">슬롯 머신 게임의 제목을 입력해주세요</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">게임 제목</label>
            <input
              type="text"
              className="text-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 점심 메뉴 추첨기"
              maxLength={50}
              autoFocus
            />
          </div>
          
          <button 
            type="submit" 
            className="start-button"
            disabled={!title.trim()}
          >
            다음 단계로
          </button>
        </form>
        
        <button 
          type="button" 
          className="reset-button"
          onClick={clearStorage}
        >
          저장된 데이터 초기화
        </button>
      </div>
    </div>
  )
}

export default TitleInput