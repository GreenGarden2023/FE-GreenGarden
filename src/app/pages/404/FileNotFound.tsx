import React from 'react'
import { useNavigate } from 'react-router-dom';
import './style.scss';

const FileNotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>FindNotFound</h1>
      <button onClick={() => navigate('/')}>Back to store</button>
    </div>
  )
}

export default FileNotFound