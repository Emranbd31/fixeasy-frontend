import { useEffect, useRef, useState } from 'react'

function stopStream(stream) {
  if (!stream) return
  stream.getTracks().forEach((track) => {
    try {
      track.stop()
    } catch (error) {
      console.warn('Unable to stop track', error)
    }
  })
}

export default function CameraCapture({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState('')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') {
      return undefined
    }

    let isMounted = true

    async function startStream() {
      setError('')
      setIsReady(false)

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 720 } },
          audio: false
        })

        if (!isMounted) {
          stopStream(stream)
          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => {
            setError('We could not start the camera preview.')
          })
          setIsReady(true)
        }
      } catch (cameraError) {
        console.error('Camera error', cameraError)
        setError('Unable to access the camera. Check permissions and try again.')
      }
    }

    startStream()

    return () => {
      isMounted = false
      stopStream(streamRef.current)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      streamRef.current = null
      setIsReady(false)
      setError('')
    }
  }, [isOpen])

  const handleCapture = async () => {
    if (!videoRef.current) {
      setError('Camera preview is not ready yet.')
      return
    }

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result)
          } else {
            reject(new Error('Unable to capture photo.'))
          }
        },
        'image/jpeg',
        0.92
      )
    }).catch((captureError) => {
      console.error('Capture error', captureError)
      setError('We could not save the snapshot. Try again.')
      return null
    })

    if (!blob) return

    const file = new File([blob], `fixeasy-selfie-${Date.now()}.jpg`, { type: blob.type })
    onCapture?.(file)
    onClose?.()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="camera-capture" role="dialog" aria-modal="true" aria-labelledby="camera-capture-title">
      <div className="camera-capture__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="camera-capture__modal">
        <header className="camera-capture__header">
          <h2 id="camera-capture-title">Capture a live selfie</h2>
          <p>Align your face inside the frame and tap capture. We only store the photo for verification.</p>
        </header>

        <div className="camera-capture__preview">
          {error ? (
            <div className="camera-capture__error" role="alert">
              {error}
            </div>
          ) : (
            <video ref={videoRef} playsInline muted autoPlay />
          )}
        </div>

        <footer className="camera-capture__actions">
          <button type="button" className="camera-capture__button camera-capture__button--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="camera-capture__button camera-capture__button--primary"
            onClick={handleCapture}
            disabled={!isReady || Boolean(error)}
          >
            {isReady ? 'Capture selfie' : 'Preparing camera…'}
          </button>
        </footer>
      </div>
    </div>
  )
}
