import { Button, Image, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import MoneyFormat from 'app/components/money/MoneyFormat';
import TreeName from 'app/components/renderer/tree-name/TreeName';
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder';
import { SaleOrderList } from 'app/models/order';
import utilDateTime from 'app/utils/date-time';
import React, { useMemo } from 'react';
import './style.scss';

interface ModalClientSaleOrderDetaiProps{
    saleOrderList: SaleOrderList;
    onClose: () => void;
}

const ModalClientSaleOrderDetai: React.FC<ModalClientSaleOrderDetaiProps> = ({ saleOrderList, onClose }) => {

    const Column: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
        },
        {
            title: 'Tên sản phẩm',
            key: 'productItemName',
            dataIndex: 'productItemName',
            render: (v) => (<TreeName name={v} />)
        },
        {
            title: 'Hình ảnh',
            key: 'imgURL',
            dataIndex: 'imgURL',
            align: 'center',
            render: (v) => (
                <Image 
                    width={100}
                    height={100}
                    src={v}
                    style={{objectFit: 'cover'}}
                />
            )
        },
        {
            title: 'Kích thước',
            key: 'sizeName',
            dataIndex: 'sizeName',
            align: 'center',
            render: (v) => (v)
        },
        {
            title: 'Giá tiền',
            key: 'salePricePerUnit',
            dataIndex: 'salePricePerUnit',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} isHighlight color='Light Blue' />)
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            align: 'center',
            render: (v) => (v)
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} isHighlight color='Blue' />)
        },
    ]
    const DataSource = useMemo(() =>{
        return saleOrderList.rentOrderDetailList.map((x, index) => ({
            key: String(index + 1),
            id: x.id,
            totalPrice: x.totalPrice,
            quantity: x.quantity,
            salePricePerUnit: x.salePricePerUnit,
            sizeName: x.sizeName,
            productItemName: x.productItemName,
            imgURL: x.imgURL,
        }))
    }, [saleOrderList])

    const OrderDetail = useMemo(() =>{
        const { recipientName, recipientPhone, recipientAddress, createDate, status, transportFee, 
            totalPrice, remainMoney, deposit, reason, nameCancelBy, isTransport } = saleOrderList

        return {
            name: recipientName,
            phone: recipientPhone,
            address: recipientAddress,
            createOrderDate: utilDateTime.dateToString(createDate.toString()),
            status,
            transportFee,
            totalOrder: totalPrice,
            remainMoney,
            deposit,
            reason: status === 'cancel' ? reason : undefined,
            nameCancelBy, isTransport
        }
    }, [saleOrderList])
    return (
        <Modal
            open
            title={`Chi tiết đơn hàng ${saleOrderList.orderCode}`}
            onCancel={onClose}
            onOk={onClose}
            width={1200}
            className='mcsod-wrapper'
            footer={false}
        >
            <Table className='table' dataSource={DataSource} columns={Column} pagination={false} />
            <UserInforOrder {...OrderDetail} />
            <div className='btn-form-wrapper mt-10'>
                <Button type='primary' className='btn-update' size='large' onClick={onClose}>
                    Đóng
                </Button>
            </div>
        </Modal>
    )
}

export default ModalClientSaleOrderDetai