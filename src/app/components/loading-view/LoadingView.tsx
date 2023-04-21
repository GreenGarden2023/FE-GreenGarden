import React from 'react'
import './style.scss'

interface LoadingViewProps{
    loading: boolean
}

const LoadingView: React.FC<LoadingViewProps> = ({loading}) => {
  return (
    loading ? <div className="loading-wrapper">
      <div className="spinner-3"></div>
    </div> : <></>
  )
}

export default LoadingView