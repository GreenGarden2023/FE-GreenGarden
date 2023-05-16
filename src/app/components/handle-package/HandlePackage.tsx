import { Button, Col, Form, Input, Modal, Row } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import GridConfig from '../grid-config/GridConfig';
import ErrorMessage from '../message.tsx/ErrorMessage';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { PackageHandle } from 'app/models/package';
import { Package } from 'app/models/package';
import takeCareComboService from 'app/services/take-care-combo.service';
import CurrencyInput from '../renderer/currency-input/CurrencyInput';
import utilGeneral from 'app/utils/general';

const schema = yup.object().shape({
    name: yup.string().trim().required('Tên gói không được để trống'),
    price: yup.number().min(1000, 'Gói có giá ít nhất là 1000'),
    description: yup.string().trim().required('Mô tả gói không được để trống'),
    guarantee: yup.string().trim().required('Cam kết không được để trống')
    // fullName: yup.string().trim().required('Họ và tên không được để trống').min(2, 'Họ và tên có ít nhất 2 ký tự').max(50, 'Họ và tên có nhiều nhất 50 ký tự'),
    // address: yup.string().trim().required('Địa chỉ không được để trống').min(5, 'Địa chỉ có ít nhất 5 ký tự').max(100, 'Địa chỉ có nhiều nhất 100 ký tự'),
    // phone: yup.string().trim().required('Số điện thoại không được để trống').matches(CONSTANT.PHONE_REGEX, 'Số điện thoại không hợp lệ'),
    // mail: yup.string().trim().required('Email không được để trống').matches(CONSTANT.EMAIL_REGEX, 'Email không hợp lệ'),
    // quantity: yup.number().required('Số lượng cây không được để trống').min(1, 'Có ít nhất 1 cây'),
    // months: yup.number().required('Số tháng chăm sóc không được để trống').min(1, 'Cần ít nhất 1 tháng chăm sóc'),
})

interface HandlePackageProps{
    data?: Package;
    onClose: () => void;
    onSubmit: (data: Package) => void;
}

const HandlePackage: React.FC<HandlePackageProps> = ({ data, onClose, onSubmit }) => {
    const dispatch = useDispatch()

    const { setValue, control, formState: { errors, isSubmitting, isSubmitted }, handleSubmit, reset, trigger } = useForm<PackageHandle>({
        resolver: yupResolver(schema)
    })

    useEffect(() =>{
        if(!data){
            setValue('status', true)
            setValue('price', 0)
            return;
        }

        const { id, name, price, description, guarantee, status } = data
        setValue('id', id)
        setValue('name', name)
        setValue('price', price)
        setValue('description', description)
        setValue('guarantee', guarantee)
        setValue('status', status)

    }, [data, setValue])

    const handleSubmitForm = async (body: PackageHandle) =>{
        try{
            if(!data){
                // handler
                const res = await takeCareComboService.createTakeCareCombo(body)
                onSubmit(res.data)
                dispatch(setNoti({type: 'success', message: 'Tạo mới gói chăm sóc thành công'}))
                onClose()
                reset()
            }else{
                // handler
                const res = await takeCareComboService.updateTakeCareCombo(body)
                onSubmit(res.data)
                dispatch(setNoti({type: 'success', message: 'Cập nhật gói chăm sóc thành công'}))
                onClose()
                reset()
            }
        }catch{

        }
    }

    const handleCancel = () =>{
        onClose()
        reset()
    }

    return (
        <Modal
            open
            title={`${data ? 'Cập nhật' : 'Tạo mới'} gói chăm sóc`}
            onCancel={handleCancel}
            width={1000}
            footer={false}
        >
            <Form
                labelAlign='left'
                layout='vertical'
                onFinish={handleSubmit(handleSubmitForm)}
            >
                <GridConfig>
                    <Row gutter={[24, 0]}>
                        <Col span={12}>
                            <Form.Item label='Tên gói' required>
                                <Controller 
                                    control={control}
                                    name='name'
                                    render={({ field }) => (<Input {...field} />)}
                                />
                                {errors.name && <ErrorMessage message={errors.name.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Giá tiền' required>
                                <Controller 
                                    control={control}
                                    name='price'
                                    render={({ field: { value } }) => (<CurrencyInput  value={value || 0} min={0} onChange={(e) => {
                                        utilGeneral.setCurrency(setValue, 'price', e)
                                        isSubmitted && trigger('price')
                                    }}/>)}
                                />
                                {errors.price && <ErrorMessage message={errors.price.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Mô tả' required>
                                <Controller 
                                    control={control}
                                    name='description'
                                    render={({ field }) => (<Input.TextArea autoSize={{minRows: 4, maxRows: 6}} {...field} />)}
                                />
                                {errors.description && <ErrorMessage message={errors.description.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Cam kết' required>
                                <Controller 
                                    control={control}
                                    name='guarantee'
                                    render={({ field }) => (<Input.TextArea autoSize={{minRows: 4, maxRows: 6}} {...field} />)}
                                />
                                {errors.guarantee && <ErrorMessage message={errors.guarantee.message} />}
                            </Form.Item>
                        </Col>
                    </Row>
                </GridConfig>
                <div className='btn-form-wrapper'>
                    <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={handleCancel}>Hủy bỏ</Button>
                    <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>
                        {data ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default HandlePackage