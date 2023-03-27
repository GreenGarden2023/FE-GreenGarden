import { Button, Col, Form, Image, Input, Modal, Row } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import useDispatch from 'app/hooks/use-dispatch';
import { Service, ServiceUpdate, UpdateServiceDetail } from 'app/models/service';
import serviceService from 'app/services/service.service';
import { setNoti } from 'app/slices/notification';
import React, { useEffect, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { Controller, useForm } from 'react-hook-form';

interface UpdateConfirmServiceDetailProps{
    service: Service;
    onClose: () => void;
    onSubmit: (service: Service) => void;
}

const UpdateConfirmServiceDetail: React.FC<UpdateConfirmServiceDetailProps> = ({service, onClose, onSubmit}) => {
    const dispatch = useDispatch()

    const { setValue, formState: {errors, isSubmitting}, control, trigger, handleSubmit } = useForm<ServiceUpdate>({

    })

    console.log({errors, trigger})


    const [serviceDetail, setServiceDetail] = useState(service)
    const [listQuan, setListQuan] = useState<string[]>([])
    const [listPrice, setListPrice] = useState<string[]>([])

    useEffect(() =>{
        const { id, name, phone, email, address, rewardPointUsed } = service
        setValue('serviceID', id)
        setValue('name', name)
        setValue('phone', phone)
        setValue('email', email)
        setValue('address', address)
        setValue('transportFee', 0)
        setValue('rewardPointUsed', rewardPointUsed)
    }, [service, setValue])

    const ColumnTree: ColumnsType<any> = [
        {
            title: 'Tên cây',
            key: 'treeName',
            dataIndex: 'treeName',
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            render: (v, record) => (
                <CurrencyFormat value={v} style={{border: listQuan.includes(record.id) ? '1px solid red' : '1px solid #6cdce7'}} 
                onValueChange={(values) => handleChangeTree(values, record.id, 'quantity')} className='currency-input-field'
                />
            )
        },
        {
            title: 'Hình ảnh',
            key: 'imgUrls',
            dataIndex: 'imgUrls',
            render: (v) => (
                <Image.PreviewGroup>
                    {
                        v.map((item, index) => (
                            <div key={index} style={{display: index === 0 ? 'initial' : 'none'}}>
                                <Image 
                                width={150}
                                height={150}
                                src={item}
                                style={{objectFit: 'cover'}}
                            />
                            </div>
                        ))
                    }
                </Image.PreviewGroup>
            )
        },
        {
            title: 'Mô tả của khách hàng',
            key: 'description',
            dataIndex: 'description',
        },
        {
            title: 'Mô tả của bạn',
            key: 'managerDescription',
            dataIndex: 'managerDescription',
            render: (v, record) => (<Input.TextArea value={v} onChange={(e) => {
                const value = e.target.value
                const index = serviceDetail.serviceDetailList.findIndex(x => x.id === record.id)
                serviceDetail.serviceDetailList[index].managerDescription = value
                setServiceDetail({...serviceDetail}) 
            }} autoSize={{minRows: 4, maxRows: 6}} ></Input.TextArea>)
        },
        {
            title: 'Thành tiền',
            key: 'servicePrice',
            dataIndex: 'servicePrice',
            render: (v, record) => (
                <CurrencyFormat value={v} style={{border: listPrice.includes(record.id) ? '1px solid red' : '1px solid #6cdce7'}} 
                onValueChange={(values) => handleChangeTree(values, record.id, 'price')} className='currency-input-field'
                />
            )
        },
    ]
    const handleChangeTree = (values: CurrencyFormat.Values, serviceId: string, type: 'quantity' | 'price') =>{
        const { value } = values
        const index = serviceDetail.serviceDetailList.findIndex(x => x.id === serviceId)
        if(type === 'quantity'){
            serviceDetail.serviceDetailList[index].quantity = value ? Number(value) : 0
        }else if(type === 'price'){
            serviceDetail.serviceDetailList[index].servicePrice = value ? Number(value) : 0
        }
        setServiceDetail({...serviceDetail})
        isValidDataTree()
    }
    const DataSourceTree = serviceDetail.serviceDetailList.map((x, index) => ({
            key: String(index + 1),
            id: x.id,
            treeName: x.treeName,
            quantity: x.quantity,
            imgUrls: x.imgUrls,
            description: x.description,
            managerDescription: x.managerDescription,
            servicePrice: x.servicePrice
        }))
    
    
    const isValidDataTree = () =>{
        let result = true;
        const quan: string[] = []
        const price: string[] = []

        for (const item of serviceDetail.serviceDetailList) {
            const quantity = item.quantity
            const servicePrice = item.servicePrice

            if(quantity === 0){
                quan.push(item.id)
                result = false
            }
            if(servicePrice < 1000){
                price.push(item.id)
                result = false
            }
        }
        setListQuan(quan)
        setListPrice(price)

        return result
    }
    const handleSubmitForm = async (data: ServiceUpdate) =>{
        if(!isValidDataTree()){
            return;
        }
        const body: UpdateServiceDetail = {
            serviceUpdate: data,
            serviceDetailUpdate: serviceDetail.serviceDetailList.map(x => ({
                serviceDetailID: x.id,
                quantity: x.quantity,
                servicePrice: x.servicePrice,
                managerDescription: x.managerDescription
            }))
        }
        try{
            await serviceService.updateServiceDetail(body)
            dispatch(setNoti({type: 'success', message: `Cập nhật thông tin dịch vụ chăm sóc cho đơn hàng "${service.serviceCode}" thành công`}))
            const { name, phone, email, address } = data
            const newService = {
                ...serviceDetail,
                name, phone, email, address
            }
            onSubmit(newService)
        }catch{

        }
    }

    return (
        <Modal
            open
            title={`Cập nhật thông tin dịch vụ chăm sóc cho đơn hàng "${service.serviceCode}"`}
            width='100%'
            onCancel={onClose}
            bodyStyle={{maxHeight: '650px', overflow: 'hidden auto'}}
            footer={null}
        >
            <Table columns={ColumnTree} dataSource={DataSourceTree} pagination={false} />
            <div className="user-infor-form">
                <h3>Xác nhận thông tin của khách hàng</h3>
                <Form
                    layout='vertical'
                    onFinish={handleSubmit(handleSubmitForm)}
                >
                    <Row gutter={[24, 24]}>
                        <Col span={8}>
                            <Form.Item label='Tên' required>
                                <Controller
                                    control={control}
                                    name='name'
                                    render={({field}) => (<Input {...field} />)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Số điện thoại' required>
                                <Controller
                                    control={control}
                                    name='phone'
                                    render={({field}) => (<Input {...field} />)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Email' required>
                                <Controller
                                    control={control}
                                    name='email'
                                    render={({field}) => (<Input {...field} />)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Địa chỉ' required>
                                <Controller
                                    control={control}
                                    name='address'
                                    render={({field}) => (<Input {...field} />)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Phí vận chuyển ' required>
                                <Controller
                                    control={control}
                                    name='transportFee'
                                    render={({field}) => (<Input {...field} />)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={`Sử dụng điểm thưởng (Số điểm đang có là ${service.userCurrentPoint})`} required>
                                <Controller
                                    control={control}
                                    name='rewardPointUsed'
                                    render={({field}) => (<Input {...field} />)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} >
                            <div className='btn-form-wrapper'>
                                <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                                <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>
                                    Cập nhật thông tin
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
}

export default UpdateConfirmServiceDetail