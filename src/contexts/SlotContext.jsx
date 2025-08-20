import { createContext, useContext, useReducer, useEffect } from 'react'

const SlotContext = createContext()

const initialState = {
  gameTitle: '',
  slotCount: 0,
  slots: [], // { id: 0, itemCount: 3, items: [{ text: '', image: null }, ...] }
  gameState: 'titleInput', // 'titleInput', 'setup', 'slotItemCount', 'input', 'ready', 'playing', 'result'
  currentSlotIndex: 0,
  currentItemIndex: 0,
  result: []
}

function slotReducer(state, action) {
  switch (action.type) {
    case 'SET_GAME_TITLE':
      return {
        ...state,
        gameTitle: action.payload,
        gameState: 'setup'
      }
    
    case 'SET_SLOT_COUNT':
      return {
        ...state,
        slotCount: action.payload,
        slots: Array(action.payload).fill(null).map((_, index) => ({
          id: index,
          itemCount: 0,
          items: []
        })),
        gameState: action.payload > 0 ? 'slotItemCount' : 'setup',
        currentSlotIndex: 0,
        currentItemIndex: 0
      }
    
    case 'SET_SLOT_ITEM_COUNT':
      return {
        ...state,
        slots: state.slots.map(slot => 
          slot.id === action.payload.slotId 
            ? { 
                ...slot, 
                itemCount: action.payload.itemCount,
                items: Array(action.payload.itemCount).fill(null).map((_, index) => ({
                  id: index,
                  text: '',
                  image: null
                }))
              }
            : slot
        )
      }
    
    case 'START_INPUT_PHASE':
      return {
        ...state,
        gameState: 'input',
        currentSlotIndex: 0,
        currentItemIndex: 0
      }
    
    case 'UPDATE_SLOT_ITEM':
      return {
        ...state,
        slots: state.slots.map(slot => 
          slot.id === action.payload.slotId 
            ? {
                ...slot,
                items: slot.items.map(item =>
                  item.id === action.payload.itemId
                    ? { ...item, ...action.payload.data }
                    : item
                )
              }
            : slot
        )
      }
    
    case 'SET_CURRENT_INPUT_POSITION':
      return {
        ...state,
        currentSlotIndex: action.payload.slotIndex,
        currentItemIndex: action.payload.itemIndex
      }
    
    case 'SET_GAME_STATE':
      return {
        ...state,
        gameState: action.payload
      }
    
    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload
      }
    
    case 'RESET':
      return initialState
    
    default:
      return state
  }
}

export function SlotProvider({ children }) {
  const [state, dispatch] = useReducer(slotReducer, initialState)

  useEffect(() => {
    const savedData = localStorage.getItem('slotGameData')
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        // 게임 제목이 있고 slotCount가 있으면 저장된 데이터 복원
        if (data.gameTitle && data.slotCount > 0) {
          dispatch({ type: 'SET_GAME_TITLE', payload: data.gameTitle })
          dispatch({ type: 'SET_SLOT_COUNT', payload: data.slotCount })
          
          // 슬롯 데이터 복원
          data.slots.forEach((slot, index) => {
            dispatch({ 
              type: 'SET_SLOT_ITEM_COUNT',
              payload: { slotId: index, itemCount: slot.itemCount }
            })
            slot.items.forEach((item, itemIndex) => {
              dispatch({
                type: 'UPDATE_SLOT_ITEM',
                payload: {
                  slotId: index,
                  itemId: itemIndex,
                  data: item
                }
              })
            })
          })
          
          // 게임 상태 복원 (result는 제외하고)
          const gameState = data.gameState === 'result' ? 'ready' : (data.gameState || 'ready')
          dispatch({ type: 'SET_GAME_STATE', payload: gameState })
        }
      } catch (error) {
        console.error('저장된 데이터 로드 실패:', error)
        // 오류 시 로컬스토리지 데이터 삭제
        localStorage.removeItem('slotGameData')
      }
    }
  }, [])

  useEffect(() => {
    if (state.slotCount > 0) {
      try {
        const dataToSave = JSON.stringify(state)
        // 로컬스토리지 크기 제한 확인 (대략 8MB)
        if (dataToSave.length > 8 * 1024 * 1024) {
          console.warn('데이터가 너무 커서 저장하지 않습니다.')
          return
        }
        localStorage.setItem('slotGameData', dataToSave)
      } catch (error) {
        console.error('데이터 저장 중 오류:', error)
        // 저장 실패 시 이미지 데이터를 제외하고 다시 시도
        try {
          const stateWithoutImages = {
            ...state,
            slots: state.slots.map(slot => ({ ...slot, image: null }))
          }
          localStorage.setItem('slotGameData', JSON.stringify(stateWithoutImages))
        } catch (secondError) {
          console.error('이미지 제외 저장도 실패:', secondError)
        }
      }
    }
  }, [state])

  return (
    <SlotContext.Provider value={{ state, dispatch }}>
      {children}
    </SlotContext.Provider>
  )
}

export function useSlot() {
  const context = useContext(SlotContext)
  if (!context) {
    throw new Error('useSlot must be used within a SlotProvider')
  }
  return context
}