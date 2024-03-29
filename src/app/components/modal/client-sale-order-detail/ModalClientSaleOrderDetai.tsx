import { Button, Image, Modal, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import MoneyFormat from 'app/components/money/MoneyFormat';
import TreeName from 'app/components/renderer/tree-name/TreeName';
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder';
import { SaleOrderList } from 'app/models/order';
import utilDateTime from 'app/utils/date-time';
import React, { useMemo } from 'react';
import './style.scss';
import { BsFillCaretDownSquareFill, BsFillCaretRightSquareFill } from 'react-icons/bs';
import CareGuideSummary from 'app/components/care-guide-summary/CareGuideSummary';
import { BiHide } from 'react-icons/bi';
import { useState } from 'react';
import { GrFormView } from 'react-icons/gr';
// import CareGuide from 'app/components/care-guide/CareGuide';

interface ModalClientSaleOrderDetaiProps{
    saleOrderList: SaleOrderList;
    onClose: () => void;
}

const ModalClientSaleOrderDetai: React.FC<ModalClientSaleOrderDetaiProps> = ({ saleOrderList, onClose }) => {
    const [isViewOrderInfo, setIsViewOrderInfo] = useState(true)

    const Column: ColumnsType<any> = [
        {
            title: 'Tên sản phẩm',
            key: 'productItemName',
            dataIndex: 'productItemName',
            render: (v) => (<TreeName name={v} minWidth={120} />)
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
            render: (v) => (<MoneyFormat value={v} color='Light Blue' />)
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
            render: (v) => (<MoneyFormat value={v} color='Blue' />)
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
            careGuide: x.careGuide
        }))
    }, [saleOrderList])

    const OrderDetail = useMemo(() =>{
        const { recipientName, recipientPhone, recipientAddress, createDate, status, transportFee, 
            totalPrice, remainMoney, deposit, reason, nameCancelBy, isTransport, careGuideURL } = saleOrderList

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
            nameCancelBy, isTransport, careGuideURL
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
            <Table 
                className='table' 
                dataSource={DataSource} 
                columns={Column} 
                pagination={false} 
                scroll={{x: 480}}
                expandable={{
                    expandedRowRender: (record) => (<CareGuideSummary careGuide={record.careGuide} treeName={record.productItemName} />),
                    expandIcon: ({ expanded, onExpand, record }) => 
                    expanded ? 
                        <Tooltip title="Đóng hướng dẫn chăm sóc" color='#0099FF' >
                            <BsFillCaretDownSquareFill color='#0099FF' onClick={(e: any) => onExpand(record, e)} cursor='pointer' /> 
                        </Tooltip>
                        : 
                        <Tooltip title="Xem hướng dẫn chăm sóc" color='#0099FF' >
                            <BsFillCaretRightSquareFill color='#0099FF' onClick={(e: any) => onExpand(record, e)} cursor='pointer' />
                        </Tooltip>
                }}
            />
            <div style={{width: 'fit-content', margin: '20px 0 0 auto'}}>
                <button className="ts-btn-create btn btn-create" onClick={() => setIsViewOrderInfo(!isViewOrderInfo)}>
                    {isViewOrderInfo ? <BiHide size={25} /> : <GrFormView size={25} className='icon-view-order' />}
                    {isViewOrderInfo ? 'Ẩn ' : 'Hiện '}thông tin đơn hàng
                </button>
            </div>
            {
                isViewOrderInfo && <UserInforOrder {...OrderDetail} />
            }
            <div className='btn-form-wrapper mt-10'>
                <Button type='primary' className='btn-update' size='large' onClick={onClose} >
                    Đóng
                </Button>
            </div>
        </Modal>
    )
}

export default ModalClientSaleOrderDetai