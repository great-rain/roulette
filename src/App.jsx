import { SlotProvider, useSlot } from './contexts/SlotContext'
import TitleInput from './components/TitleInput'
import SlotCountSelector from './components/SlotCountSelector'
import SlotItemCountSetup from './components/SlotItemCountSetup'
import SlotDataInput from './components/SlotDataInput'
import SlotGame from './components/SlotGame'
import ResultScreen from './components/ResultScreen'
import './App.css'

function AppContent() {
  const { state } = useSlot()

  const renderCurrentStep = () => {
    switch (state.gameState) {
      case 'titleInput':
        return <TitleInput />
      case 'setup':
        return <SlotCountSelector />
      case 'slotItemCount':
        return <SlotItemCountSetup />
      case 'input':
        return <SlotDataInput />
      case 'ready':
      case 'playing':
        return <SlotGame />
      case 'result':
        return <ResultScreen />
      default:
        return <TitleInput />
    }
  }

  return (
    <div className="app">
      {renderCurrentStep()}
    </div>
  )
}

function App() {
  return (
    <SlotProvider>
      <AppContent />
    </SlotProvider>
  )
}

export default App
