import { Image, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import MoneyFormat from 'app/components/money/MoneyFormat';
import TreeName from 'app/components/renderer/tree-name/TreeName';
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder';
import { RentOrderList } from 'app/models/order';
import utilDateTime from 'app/utils/date-time';
import React, { useMemo } from 'react';
import './style.scss';

interface ModalClientRentOrderDetaiProps{
    rentOrderList: RentOrderList;
    onClose: () => void;
    // index?: number
}

const ModalClientRentOrderDetai: React.FC<ModalClientRentOrderDetaiProps> = ({rentOrderList, onClose}) => {
    // const rentOrderDetail = rentOrder.rentOrderList[index]

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
            key: 'rentPricePerUnit',
            dataIndex: 'rentPricePerUnit',
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
        return rentOrderList.rentOrderDetailList.map((x, index) => ({
            key: String(index + 1),
            id: x.id,
            totalPrice: x.totalPrice,
            quantity: x.quantity,
            rentPricePerUnit: x.rentPricePerUnit,
            sizeName: x.sizeName,
            productItemName: x.productItemName,
            imgURL: x.imgURL,
        }))
    }, [rentOrderList])

    const OrderDetail = useMemo(() =>{
        const { recipientName, recipientPhone, recipientAddress, createDate, startRentDate, endRentDate, status, transportFee, totalPrice, remainMoney, deposit, reason } = rentOrderList

        return {
            name: recipientName,
            phone: recipientPhone,
            address: recipientAddress,
            createOrderDate: utilDateTime.dateToString(createDate.toString()),
            startDate: utilDateTime.dateToString(startRentDate.toString()),
            endDate: utilDateTime.dateToString(endRentDate.toString()),
            status,
            transportFee,
            totalOrder: totalPrice,
            remainMoney,
            deposit, reason
        }
    }, [rentOrderList])

    return (
        <Modal
            open
            title={`Chi tiết đơn hàng ${rentOrderList.orderCode}`}
            onCancel={onClose}
            onOk={onClose}
            width={1200}
            className='mcrod-wrapper'
        >
            <Table dataSource={DataSource} columns={Column} pagination={false} />
            <UserInforOrder {...OrderDetail} />
        </Modal>
    )
}

export default ModalClientRentOrderDetai