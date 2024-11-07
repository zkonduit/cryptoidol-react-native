import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import Avatar from './canvas/Avatar'
import ConfettiComponent from './ConfettiComponent'
import AudioScoring from './AudioScoring'
import { Recording } from './Recording'
import { ScoreResult } from './ScoreResult'
import { GeneratingProof } from './GeneratingProof'
import { preloadModel } from '../audio/audioClassifier'
import { setupModelProver } from '../prover/setupModelProver'
import DebugControls from './DebugButton'
import Minting from './Minting'
import Minted from './Minted'

const MainBlock = () => {
  const [state, setState] = useState('minting')
  const [renderAvatar, setRenderAvatar] = useState(false) // TODO - set this to true after testing
  const [recordingPath, setRecordingPath] = useState(null)
  const [recordingScore, setRecordingScore] = useState(null)
  const [preprocessedRecordingData, setPreprocessedRecordingData] = useState(null)
  const [proof, setProof] = useState(null)

  const onRecorded = (restingRecordingPath) => {
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

  const onProofGenerated = (proof) => {
    setProof(proof)
    setState('minted')
    console.debug('Proof generated successfully')
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


      {
        renderAvatar && <Avatar state={state} />
      }

      {
        state === 'minted' &&
        <ConfettiComponent />
        // TODO - also show the NFT image as in the web version
      }


      {(state === 'recording' || state === 'start' || state === 'listening' || state === 'recorded') && (
        <Recording onSubmit={onRecorded} state={state} setState={setState} />
      )
      }
      {state === 'scoring' && (
        <AudioScoring onCancel={() => setState('start')} recording={recordingPath} onFinished={onScoringFinished} />
      )
      }
      {
        state === 'scored' && (
          <ScoreResult score={recordingScore} onRetryRecording={() => setState('start')}
                       onShare={() => setState('proving')} />
        )
      }
      {
        state === 'proving' && (
          <GeneratingProof score={recordingScore} onProofGenerated={onProofGenerated}
                           preprocessedRecordingData={preprocessedRecordingData} onCancelled={() => setState('scored')} />
        )
      }
      {
        state === 'minting' && (
          <Minting onTransactionComplete={() => setState('minted')} onCancelled={() => setState('scored')}
                   proof={proof} />
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
