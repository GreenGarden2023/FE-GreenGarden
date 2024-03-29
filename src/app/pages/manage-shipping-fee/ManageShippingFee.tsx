import { Button, Modal, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import MoneyFormat from 'app/components/money/MoneyFormat'
import CurrencyInput from 'app/components/renderer/currency-input/CurrencyInput'
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
    const [loadingAction, setLoadingAction] = useState(false)

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await shippingFeeService.getList()
                setShipping(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [dispatch])

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
            render: (v) => (<MoneyFormat value={v} color='Blue' isHighlight />)
        },
        {
            title: 'Xử lý',
            key: 'actions',
            dataIndex: 'actions',
            align: 'center',
            render: (_, record) => (
                <>
                    <Tooltip title='Chỉnh sửa phí vận chuyển' color='#0099FF' >
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
        setLoadingAction(true)
        try{
            await shippingFeeService.updateShippingFee(itemSelect)
            const index = shipping.findIndex(x => x.districtID === itemSelect.districtID)
            shipping[index] = itemSelect
            setShipping([...shipping])
            dispatch(setNoti({type: 'success', message: 'Cập nhật phí vận chuyển thành công'}))
            setAmount(0)
            setItemSelect(undefined)
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoadingAction(false)
    }

    const handleChangeAmount = (values: CurrencyFormat.Values) =>{
        const { floatValue } = values
        const data = Number(floatValue || 0)
        setAmount(data)
    }

    const handleCloseModal = () =>{
        setItemSelect(undefined)
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
                    title={`Cập nhật phí vận chuyển cho ${itemSelect.district} (VND)`}
                    onCancel={handleCloseModal}
                    footer={false}
                >
                    <CurrencyInput min={0} value={amount} onChange={handleChangeAmount} />
                    <div className='btn-form-wrapper mt-10'>
                        <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={handleCloseModal} >Hủy bỏ</Button>
                        <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large' onClick={handleSubmit}>
                            Cập nhật
                        </Button>
                    </div>
                </Modal>
            }
        </div>
    )
}

export default ManageShippingFee