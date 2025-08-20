import { useRef } from 'react'
import { useSlot } from '../contexts/SlotContext'

export default function SlotDataInput() {
  const { state, dispatch } = useSlot()
  const fileInputRef = useRef(null)

  // 현재 입력 중인 슬롯과 아이템 정보
  const currentSlot = state.slots[state.currentSlotIndex]
  const currentItem = currentSlot?.items[state.currentItemIndex]
  
  // 전체 입력 진행률 계산
  const totalItems = state.slots.reduce((sum, slot) => sum + slot.itemCount, 0)
  const completedItems = state.slots.reduce((sum, slot, slotIndex) => {
    if (slotIndex < state.currentSlotIndex) {
      return sum + slot.itemCount
    } else if (slotIndex === state.currentSlotIndex) {
      return sum + state.currentItemIndex
    }
    return sum
  }, 0)

  const handleTextChange = (text) => {
    dispatch({
      type: 'UPDATE_SLOT_ITEM',
      payload: {
        slotId: state.currentSlotIndex,
        itemId: state.currentItemIndex,
        data: { text }
      }
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
      }
      
      // 파일 크기 검증 (20MB 제한)
      if (file.size > 20 * 1024 * 1024) {
        alert('파일 크기는 20MB 이하여야 합니다.')
        return
      }

      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          dispatch({
            type: 'UPDATE_SLOT_ITEM',
            payload: {
              slotId: state.currentSlotIndex,
              itemId: state.currentItemIndex,
              data: { image: event.target.result }
            }
          })
        } catch (error) {
          console.error('이미지 처리 중 오류:', error)
          alert('이미지 처리 중 오류가 발생했습니다.')
        }
      }
      
      reader.onerror = () => {
        console.error('파일 읽기 오류')
        alert('파일 읽기 중 오류가 발생했습니다.')
      }
      
      reader.readAsDataURL(file)
    }
    
    // input 값 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = ''
  }

  const handleNext = () => {
    // 다음 아이템으로 이동
    if (state.currentItemIndex < currentSlot.itemCount - 1) {
      dispatch({
        type: 'SET_CURRENT_INPUT_POSITION',
        payload: {
          slotIndex: state.currentSlotIndex,
          itemIndex: state.currentItemIndex + 1
        }
      })
    } else if (state.currentSlotIndex < state.slotCount - 1) {
      // 다음 슬롯으로 이동
      dispatch({
        type: 'SET_CURRENT_INPUT_POSITION',
        payload: {
          slotIndex: state.currentSlotIndex + 1,
          itemIndex: 0
        }
      })
    }
  }

  const handlePrevious = () => {
    // 이전 아이템으로 이동
    if (state.currentItemIndex > 0) {
      dispatch({
        type: 'SET_CURRENT_INPUT_POSITION',
        payload: {
          slotIndex: state.currentSlotIndex,
          itemIndex: state.currentItemIndex - 1
        }
      })
    } else if (state.currentSlotIndex > 0) {
      // 이전 슬롯의 마지막 아이템으로 이동
      const prevSlot = state.slots[state.currentSlotIndex - 1]
      dispatch({
        type: 'SET_CURRENT_INPUT_POSITION',
        payload: {
          slotIndex: state.currentSlotIndex - 1,
          itemIndex: prevSlot.itemCount - 1
        }
      })
    }
  }

  const handleComplete = () => {
    const allItemsComplete = state.slots.every(slot => 
      slot.items.every(item => item.text.trim() !== '' || item.image !== null)
    )
    
    if (allItemsComplete) {
      dispatch({ type: 'SET_GAME_STATE', payload: 'ready' })
    } else {
      alert('모든 아이템에 텍스트 또는 이미지를 입력해주세요.')
    }
  }

  const isLastItem = state.currentSlotIndex === state.slotCount - 1 && 
                    state.currentItemIndex === currentSlot?.itemCount - 1
  const isFirstItem = state.currentSlotIndex === 0 && state.currentItemIndex === 0

  return (
    <div className="slot-data-input">
      <div className="container">
        <h2 className="title">{state.gameTitle || '슬롯 게임'} - 아이템 데이터 입력</h2>
        <div className="progress">
          <span className="progress-text">
            {completedItems + 1} / {totalItems}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((completedItems + 1) / totalItems) * 100}%` }}
            />
          </div>
        </div>

        <div className="input-card">
          <h3 className="card-title">
            슬롯 #{state.currentSlotIndex + 1} - 아이템 #{state.currentItemIndex + 1}
          </h3>
          <div className="slot-info">
            <span className="slot-progress">
              ({state.currentItemIndex + 1}/{currentSlot?.itemCount})
            </span>
          </div>
          
          <div className="input-group">
            <label className="input-label">텍스트</label>
            <input
              type="text"
              className="text-input"
              placeholder="아이템에 표시할 텍스트를 입력하세요"
              value={currentItem?.text || ''}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">이미지</label>
            <div className="image-upload">
              <input
                type="file"
                ref={fileInputRef}
                className="file-input"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                className="upload-button"
                onClick={() => fileInputRef.current?.click()}
              >
                {currentItem?.image ? '이미지 변경' : '이미지 선택'}
              </button>
              {currentItem?.image && (
                <div className="image-preview">
                  <img 
                    src={currentItem.image} 
                    alt="미리보기"
                    onError={(e) => {
                      console.error('이미지 로드 실패:', e)
                      e.target.style.display = 'none'
                    }}
                    onLoad={() => {
                      console.log('이미지 로드 성공')
                    }}
                  />
                </div>
              )}
              {currentItem?.image && (
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() => {
                    dispatch({
                      type: 'UPDATE_SLOT_ITEM',
                      payload: {
                        slotId: state.currentSlotIndex,
                        itemId: state.currentItemIndex,
                        data: { image: null }
                      }
                    })
                  }}
                >
                  이미지 제거
                </button>
              )}
            </div>
          </div>

          <div className="slot-status">
            {currentItem?.text || currentItem?.image ? (
              <span className="status-complete">✅ 완료</span>
            ) : (
              <span className="status-incomplete">❌ 미완료</span>
            )}
          </div>
        </div>

        <div className="navigation-buttons">
          <button
            className="nav-button secondary"
            onClick={handlePrevious}
            disabled={isFirstItem}
          >
            이전
          </button>
          
          {!isLastItem ? (
            <button className="nav-button primary" onClick={handleNext}>
              다음
            </button>
          ) : (
            <button className="nav-button primary" onClick={handleComplete}>
              완료
            </button>
          )}
        </div>

        <button 
          className="reset-button"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          처음부터 다시
        </button>
      </div>
    </div>
  )
}