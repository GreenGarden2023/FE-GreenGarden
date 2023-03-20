import { Modal, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import MoneyFormat from 'app/components/money/MoneyFormat'
import useDispatch from 'app/hooks/use-dispatch'
import { ShippingFee } from 'app/models/shipping-fee'
import shippingFeeService from 'app/services/shipping-fee.service'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import React, { useEffect, useMemo, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import { GrUpdate } from 'react-icons/gr'

const ManageShippingFee: React.FC = () => {
    const dispatch = useDispatch();

    const [shipping, setShipping] = useState<ShippingFee[]>([])
    const [itemSelect, setItemSelect] = useState<ShippingFee>();
    const [amount, setAmount] = useState(0)

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await shippingFeeService.getList()
                setShipping(res.data)
            }catch{

            }
        }
        init()
    }, [])

    const Column: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (index + 1)
        },
        {
            title: 'Tên quận',
            key: 'district',
            dataIndex: 'district',
            align: 'center',
            render: (v) => (v)
        },
        {
            title: 'Tiền vận chuyển',
            key: 'feeAmount',
            dataIndex: 'feeAmount',
            align: 'center',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Xử lý',
            key: 'actions',
            dataIndex: 'actions',
            align: 'center',
            render: (_, record) => (
                <>
                    <Tooltip title='Chỉnh sửa tiền vận chuyển' color='#0099FF' >
                        <GrUpdate size={20} cursor='pointer' color='#00a76f' onClick={() => {
                            setItemSelect(record)
                            setAmount(record.feeAmount)
                        }} />
                    </Tooltip>
                </>
            )
        },
    ]
    const DataSource = useMemo(() =>{
        return shipping.map((x, index) => ({
            key: String(index + 1),
            ...x
        }))
    }, [shipping])
    const handleSubmit = async () =>{
        if(!itemSelect) return;

        itemSelect.feeAmount = amount

        try{
            await shippingFeeService.updateShippingFee(itemSelect)
            const index = shipping.findIndex(x => x.districtID === itemSelect.districtID)
            shipping[index] = itemSelect
            setShipping([...shipping])
            setAmount(0)
            setItemSelect(undefined)
            dispatch(setNoti({type: 'success', message: 'Cập nhật phí vận chuyển thành công'}))
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }

    return (
        <div className='msf-wrapper'>
            <HeaderInfor title='Quản lý phí vận chuyển' />
            <section className="msf-box default-layout">
                <Table dataSource={DataSource} columns={Column} pagination={false} />
            </section>
            {
                itemSelect &&
                <Modal
                    open
                    title={`Cập nhật phí vận chuyển cho ${itemSelect.district}`}
                    onCancel={() => setItemSelect(undefined)}
                    onOk={handleSubmit}
                >
                    <CurrencyFormat min={0} value={amount} thousandSeparator={true} suffix={' VNĐ'} 
                    allowNegative={false}
                    isAllowed={(values) => {
                        const value = values.floatValue || 0
                        console.log(value)
                        if(value >= 0) {
                            setAmount(value)
                        }
                        return value >= 0
                    }}
                    />
                </Modal>
            }
        </div>
    )
}

export default ManageShippingFee