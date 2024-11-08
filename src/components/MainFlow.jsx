import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import Avatar from './canvas/Avatar'
import ConfettiComponent from './elements/ConfettiComponent'
import AudioScoring from './AudioScoring'
import { Recording } from './Recording'
import { ScoreResult } from './ScoreResult'
import { GeneratingProof } from './GeneratingProof'
import { preloadModel } from '../audio/audioClassifier'
import { setupModelProver } from '../prover/setupModelProver'
import DebugControls from './elements/DebugButton'
import { Minting } from './Minting'
import DeviceInfo from 'react-native-device-info'
import Minted from './Minted'

const MainFlow = () => {
  const [state, setState] = useState('start')
  const [renderAvatar, setRenderAvatar] = useState(false)
  const [recordingPath, setRecordingPath] = useState(null)
  const [recordingScore, setRecordingScore] = useState(null)
  const [preprocessedRecordingData, setPreprocessedRecordingData] = useState(null)
  const [nftData, setNftData] = useState(null)
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
    setState('minting')
    console.debug('Proof generated successfully')
  }

  const onMinted = (nftId, uri) => {
    setNftData({ id: nftId, uri })
    setState('minted')
    console.debug('NFT minted successfully with ID:', nftId + ' and Image URI:', uri)
  }

  const onTryAgain = () => {
    setProof(null)
    setRecordingPath(null)
    setRecordingScore(null)
    setPreprocessedRecordingData(null)
    setNftData(null)
    setState('start')
  }

  // Only render the avatar on real devices
  useEffect(() => {
    DeviceInfo.isEmulator().then((emulator) => setRenderAvatar(!emulator))
  }, [])

  useEffect(() => {

    preloadModel().catch(error => console.error('Error preloading model:', error))
    setupModelProver().catch(error => console.error('Error preparing model prover:', error))

  }, [])


  return (
    <SafeAreaView style={{ flex: 1 }}>

      {
        <DebugControls state={state} renderAvatar={renderAvatar}
                       onRenderSelected={(selection) => setRenderAvatar(selection)} /> // TODO - remove this button after testing

      }


      {
        state !== 'minted' && renderAvatar && <Avatar state={state} />
      }

      {
        state === 'minted' &&
        <>
          <ConfettiComponent />
        </>


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
          <Minting onMinted={onMinted} onCancelled={() => setState('scored')}
                   proof={proof} onRecordAgain={onTryAgain} />
        )
      }
      {
        state === 'minted' && (
          <Minted nft={nftData} />
        )
      }
    </SafeAreaView>
  )
}

export default MainFlow
