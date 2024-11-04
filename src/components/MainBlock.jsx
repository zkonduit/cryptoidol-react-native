import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import CustomCanvas from './canvas/CustomCanvas'
import ConfettiComponent from './ConfettiComponent'
import AudioScoring from './AudioScoring'
import { Recording } from './Recording'
import { ScoreResult } from './ScoreResult'
import { PublishScore } from './PublishScore'
import { preloadModel } from '../audio/audioClassifier'
import { setupModelProver } from '../prover/setupModelProver'
import DebugControls from './DebugButton'
import Minted from './Minted'

const MainBlock = () => {
  const [state, setState] = useState('start')
  const [renderAvatar, setRenderAvatar] = useState(false) // TODO - set this to true after testing
  const [recordingPath, setRecordingPath] = useState(null)
  const [recordingScore, setRecordingScore] = useState(null)
  const [preprocessedRecordingData, setPreprocessedRecordingData] = useState(null)

  const scoreRecording = (restingRecordingPath) => {
    setRecordingPath(restingRecordingPath)
    setState('scoring')
    console.debug('Recording Submitted for Scoring')
  }

  const onScoringFinished = (processedData, score) => {
    setPreprocessedRecordingData(processedData)
    setRecordingScore(score)
    setState('scored')
    console.debug('Audio Scoring Result:', score)
  }

  useEffect(() => {

    preloadModel().catch(error => console.error('Error preloading model:', error))
    setupModelProver().catch(error => console.error('Error preparing model prover:', error))

  }, [])


  return (
    <SafeAreaView style={{ flex: 1 }}>

      {
        <DebugControls state={state} onFinished={() => setState('minted')} renderAvatar={renderAvatar}
                       onRenderSelected={(selection) => setRenderAvatar(selection)} /> // TODO - remove this button after testing

      }


      <CustomCanvas state={state} renderAvatar={renderAvatar} />

      {
        state === 'minted' &&
        <ConfettiComponent />
        // TODO - also show the NFT image as in the web version
      }


      {(state === 'recording' || state === 'start' || state === 'listening' || state === 'recorded') && (
        <Recording onSubmit={scoreRecording} state={state} setState={setState} />
      )
      }
      {state === 'scoring' && (
        <AudioScoring onCancel={() => setState('recording')} recording={recordingPath} onFinished={onScoringFinished} />
      )
      }
      {
        state === 'scored' && (
          <ScoreResult score={recordingScore} onRetryRecording={() => setState('recording')}
                       onShare={() => setState('sharing')} />
        )
      }
      {
        state === 'sharing' && (
          <PublishScore score={recordingScore} onPublish={() => setState('minted')}
                        preprocessedRecordingData={preprocessedRecordingData} />
        )
      }
      {
        state === 'minted' && (
          <Minted onPress={() => setState('start')} />
        )
      }
    </SafeAreaView>
  )
}

export default MainBlock
