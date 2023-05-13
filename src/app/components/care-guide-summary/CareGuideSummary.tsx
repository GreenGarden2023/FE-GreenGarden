import React from 'react'
import './style.scss'
import { MdOutlineIntegrationInstructions } from 'react-icons/md'

interface CareGuideSummaryProps{
    careGuide: string;
    treeName?: string
}

const CareGuideSummary: React.FC<CareGuideSummaryProps> = ({ careGuide, treeName }) => {
  return (
    <div className='care-guide-render'>
        {
            !careGuide ? 
            `Hiện chưa có hướng dẫn chăm sóc ${treeName ? `nào cho (${treeName})` : ''}` : <div>
                <div className="title">
                    <MdOutlineIntegrationInstructions color='#00a76f' size={20} />
                    <span>Hướng dẫn chăm sóc {treeName ? `(${treeName})` : ''}</span>
                </div>
                <div className="text">
                    {
                        careGuide.split('\n').map((item, index) => (
                            <p key={index}>- {item}</p>
                        ))
                    }
                </div>
            </div>
        }
    </div>
  )
}

export default CareGuideSummary