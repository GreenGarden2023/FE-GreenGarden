import { Button, Col, DatePicker, DatePickerProps, Form, Input, Modal, Row, Select } from 'antd';
import { Package, PackageService, PackageServiceHandle } from 'app/models/package'
import React, { useEffect, useMemo } from 'react'
import PackageDetail from '../package-detail/PackageDetail';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import CONSTANT from 'app/utils/constant';
import GridConfig from '../grid-config/GridConfig';
import ErrorMessage from '../message.tsx/ErrorMessage';
import locale from 'antd/es/date-picker/locale/vi_VN';
import utilDateTime from 'app/utils/date-time';
import dayjs from 'dayjs'
import takeCareComboService from 'app/services/take-care-combo.service';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import './style.scss';

const schema = yup.object().shape({
    name: yup.string().trim().required('Họ và tên không được để trống').min(2, 'Họ và tên có ít nhất 2 ký tự').max(50, 'Họ và tên có nhiều nhất 50 ký tự'),
    address: yup.string().trim().required('Địa chỉ không được để trống').min(5, 'Địa chỉ có ít nhất 5 ký tự').max(100, 'Địa chỉ có nhiều nhất 100 ký tự'),
    phone: yup.string().trim().required('Số điện thoại không được để trống').matches(CONSTANT.PHONE_REGEX, 'Số điện thoại không hợp lệ'),
    email: yup.string().trim().required('Email không được để trống').matches(CONSTANT.EMAIL_REGEX, 'Email không hợp lệ'),
    treeQuantity: yup.number().required('Số lượng cây không được để trống').min(1, 'Có ít nhất 1 cây').max(20, 'Số cây tối đa là 20 cây'),
    numOfMonth: yup.number().required('Số tháng chăm sóc không được để trống').min(1, 'Cần ít nhất 1 tháng chăm sóc').max(24, 'Số tháng chăm sóc tối đa là 24'),
})

interface UpdatePackageServiceProps{
    pkgService: PackageService
    onClose: () => void;
    onSubmit: (pkgService: PackageService) => void;
}

const UpdatePackageService: React.FC<UpdatePackageServiceProps> = ({ pkgService, onClose, onSubmit }) => {
    const dispatch = useDispatch()

    const { setValue, control, formState: {errors, isSubmitting, isSubmitted}, handleSubmit, trigger, setError, reset } = useForm<PackageServiceHandle>({
        resolver: yupResolver(schema)
    })
    useEffect(() =>{
        if(!pkgService) return;
        const { name, email, phone, address, treeQuantity, takecareComboDetail, startDate, numOfMonths } = pkgService

        setValue('id', pkgService.id)
        setValue('name', name)
        setValue('email', email)
        setValue('phone', phone)
        setValue('isAtShop', true)
        setValue('address', address)
        setValue('treeQuantity', treeQuantity)
        setValue('numOfMonth', numOfMonths)
        setValue('takecareComboId', takecareComboDetail.takecareComboID)
        setValue('startDate', utilDateTime.dayjsToLocalStringTemp(dayjs(startDate)))

    }, [pkgService, setValue, trigger])

    const PackageDetailSelect = useMemo(() =>{
        const { takecareComboDescription, takecareComboGuarantee, takecareComboID, takecareComboName, takecareComboPrice } = pkgService.takecareComboDetail
        const pkg: Package = {
            id: takecareComboID,
            description: takecareComboDescription,
            guarantee: takecareComboGuarantee,
            name: takecareComboName,
            price: takecareComboPrice,
            status: true
        }
        return pkg
    }, [pkgService.takecareComboDetail])

    const handleSubmitForm = async (data: PackageServiceHandle) =>{
        if(!data.startDate){
            setError('startDate', {
                type: 'pattern',
                message: 'Ngày bắt đầu chăm sóc không được để trống'
            })
            return;
        }

        try{
            const res = await takeCareComboService.updateTakeCareComboService(data)
            onSubmit(res.data)
            dispatch(setNoti({type: 'success', message: `Cập nhật thông tin gói chăm sóc (${pkgService.code}) thành công`}))
            handleCloseModal()
        }catch{

        }
    }

    const handleCloseModal = () =>{
        onClose()
        reset()
    }

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        if(!date){
            setValue('startDate', '')
        }else{
            setValue('startDate', utilDateTime.dayjsToLocalStringTemp(date))
        }
        isSubmitted && trigger('startDate')
        // console.log(utilDateTime.dayjsToLocalStringTemp(date));
    };

    return (
        <Modal
            open
            title={`Cập nhật thông tin gói chăm sóc (${pkgService.code})`}
            onCancel={onClose}
            footer={false}
            width={1000}
        >
            {PackageDetailSelect && <PackageDetail pkg={PackageDetailSelect} />}
            <Form
                labelAlign='left'
                layout='vertical'
                onFinish={handleSubmit(handleSubmitForm)}
            >
                <div className="form-update-pkg-service">
                    <h1>Thông tin khách hàng</h1>
                    <div className="user-info-wrapper">
                        <GridConfig>
                            <Row gutter={[24, 0]}>
                                <Col span={12}>
                                    <Form.Item label="Họ và tên" required>
                                        <Controller
                                            control={control}
                                            name='name'
                                            render={({ field }) => (<Input {...field} />)}
                                        />
                                        {errors.name && <ErrorMessage message={errors.name.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Email" required>
                                        <Controller
                                            control={control}
                                            name='email'
                                            render={({ field }) => (<Input {...field} />)}
                                        />
                                        {errors.email && <ErrorMessage message={errors.email.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Số điện thoại" required>
                                        <Controller
                                            control={control}
                                            name='phone'
                                            render={({ field }) => (<Input {...field} />)}
                                        />
                                        {errors.phone && <ErrorMessage message={errors.phone.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Chọn nơi chăm sóc cây">
                                        <Controller
                                            control={control}
                                            name='isAtShop'
                                            render={({ field }) => (
                                                <Select {...field}>
                                                    <Select.Option key={1} value={true} >Chăm sóc tại cửa hàng</Select.Option>
                                                    <Select.Option key={2} value={false} >Chăm sóc tại nhà</Select.Option>
                                                </Select>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Địa chỉ" required>
                                        <Controller
                                            control={control}
                                            name='address'
                                            render={({ field }) => (<Input {...field} />)}
                                        />
                                        {errors.address && <ErrorMessage message={errors.address.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Số lượng cây" required>
                                        <Controller
                                            control={control}
                                            name='treeQuantity'
                                            render={({ field: { value } }) => (<Input type='number' value={value} onChange={(e) =>{
                                                const value = e.target.value ? Number(e.target.value) : 0
                                                if(value > 0){
                                                    setValue('treeQuantity', value)
                                                }else{
                                                    setValue('treeQuantity', 0)
                                                }
                                                isSubmitted && trigger('treeQuantity')
                                            }} />)}
                                        />
                                        {errors.treeQuantity && <ErrorMessage message={errors.treeQuantity.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Số tháng chăm sóc" required>
                                        <Controller
                                            control={control}
                                            name='numOfMonth'
                                            render={({ field: { value } }) => (<Input type='number' value={value} onChange={(e) =>{
                                                const value = e.target.value ? Number(e.target.value) : 0
                                                if(value > 0){
                                                    setValue('numOfMonth', value)
                                                }else{
                                                    setValue('numOfMonth', 0)
                                                }
                                                isSubmitted && trigger('numOfMonth')
                                            }} />)}
                                        />
                                        {errors.numOfMonth && <ErrorMessage message={errors.numOfMonth.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Ngày bắt đầu chăm sóc" required>
                                        <DatePicker
                                            placeholder='Chọn ngày bắt đầu chăm sóc'
                                            locale={locale}
                                            format={CONSTANT.DATE_FORMAT_LIST}
                                            disabledDate={(current) => current && current.valueOf()  < Date.now().valueOf()}
                                            style={{width: '100%'}}
                                            onChange={onChange}
                                            defaultValue={dayjs(pkgService.startDate, 'YYYY/MM/DD')}
                                        />
                                        {errors.startDate && <ErrorMessage message={errors.startDate.message} />}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </GridConfig>
                    </div>
                </div>
                <div className='btn-form-wrapper' style={{marginTop: '15px'}}>
                    <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={handleCloseModal}>Hủy bỏ</Button>
                    <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>
                        Cập nhật
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default UpdatePackageService