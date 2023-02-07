import React from 'react'
import './style.scss';

interface ErrorMessageProps{
    message?: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <span className='error-message'>{message}</span>
  )
}

export default ErrorMessage