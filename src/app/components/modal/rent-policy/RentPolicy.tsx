import { Divider, Modal } from 'antd'
import React from 'react'
import { FaFileContract } from 'react-icons/fa';
import './style.scss'
import { MdOutlineCancel } from 'react-icons/md';
import { BsCheck2Circle } from 'react-icons/bs';

// - Nếu trong quá trình thuê cây có vấn đề như hư, héo, chết,.... thì khách hàng sẽ chịu trách nhiệm hoàn toàn tuỳ thuộc vào tình trạng của cây.
// - Khách hàng phải kiểm tra kĩ cây trước khi nhận. Nếu có vấn đề thì phải báo cho cửa hàng, cây sẽ được đổi cây mới không phụ thu bất kì chi phí nào. 
// - Nếu khách hàng không kiểm tra kĩ cây trước khi nhận thì khi cây có vấn đề thì khách hàng phải chịu trách nhiệm.
// - Nếu cây không được trả đúng hạn thì sẽ phụ thu thêm tiền cho các ngày tiếp theo đến khi nào cây được trả.
// - Khách hàng có thể tự mình gia hạn thêm thời gian thuê hoặc gọi điện đến cửa hàng để gia hạn thêm.
// - Khi gia hạn thuê thì chỉ được chọn những cây đang thuê, không được thêm bất cứ cây nào khác nếu thêm thì sẽ tạo đơn hành mới. 
// - Khi thuê khách hàng phải cọc 20% giá trị đơn hàng. Khi trả cây thì cửa hàng sẽ trả lại cọc cho khách hàng.
// - Khách hàng đặt đơn xong vui lòng thanh toán cọc. Đơn hàng chỉ được giao khi khách hàng thanh toán cọc đầy đủ.
// - Nếu trong quá trình thuê cây có vấn đề thì phải báo gấp cho cửa hàng biết để kịp thời cứu chữa.

const RENT_POLICY = [
    '- Nếu trong quá trình thuê cây có vấn đề như hư, héo, chết,.... thì khách hàng sẽ chịu trách nhiệm hoàn toàn tuỳ thuộc vào tình trạng của cây.',
    '- Khách hàng phải kiểm tra kĩ cây trước khi nhận. Nếu có vấn đề thì phải báo cho cửa hàng, cây sẽ được đổi cây mới không phụ thu bất kì chi phí nào.',
    '- Nếu khách hàng không kiểm tra kĩ cây trước khi nhận thì khi cây có vấn đề thì khách hàng phải chịu trách nhiệm.',
    '- Nếu cây không được trả đúng hạn thì sẽ phụ thu thêm tiền cho các ngày tiếp theo đến khi nào cây được trả.',
    '- Khách hàng có thể tự mình gia hạn thêm thời gian thuê hoặc gọi điện đến cửa hàng để gia hạn thêm.',
    '- Khi gia hạn thuê thì chỉ được chọn những cây đang thuê, không được thêm bất cứ cây nào khác nếu thêm thì sẽ tạo đơn hành mới.',
    '- Khi thuê khách hàng phải cọc 20% giá trị đơn hàng. Khi trả cây thì cửa hàng sẽ trả lại cọc cho khách hàng.',
    '- Khách hàng đặt đơn xong vui lòng thanh toán cọc. Đơn hàng chỉ được giao khi khách hàng thanh toán cọc đầy đủ.',
    '- Nếu trong quá trình thuê cây có vấn đề thì phải báo gấp cho cửa hàng biết để kịp thời cứu chữa.'
]

interface RentPolicyProps{
    checked: boolean
    onConfirm: () => void;
}

const RentPolicy: React.FC<RentPolicyProps> = ({checked, onConfirm}) => {
  return (
    <Modal
        open
        onCancel={onConfirm}
        footer={false}
        width={1000}
        className='policy-modal'
    >
        <div className='policy-wrapper'>
            <div className="header">
                <FaFileContract size={30} color='#00a76f' />
                <span>Điều khoản khi thuê cây</span>
            </div>
            <Divider />
            <div className="content">
                {
                    RENT_POLICY.map((item, index) => (
                        <p className='policy-item' key={index}>{item}</p>
                    ))
                }
            </div>
            <Divider />
            <div className="confirmation">
                {
                    checked ? 
                    <>
                        <BsCheck2Circle size={25} color='#00a76f' />
                        <span className='accept'>Đã đồng ý với các điều khoản trên</span>
                    </> : 
                    <>
                        <MdOutlineCancel size={25} color='#f95441' />
                        <span className='deny'>Chưa đồng ý với các điều khoản trên</span>
                    </>
                }
            </div>
        </div>
    </Modal>
  )
}

export default RentPolicy