import { Button, Col, Form, Image, Input, InputNumber, Modal, Row, Select, Switch } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { ProductItemDetail, ProductItemDetailHandle } from 'app/models/product-item';
import { Size } from 'app/models/size';
import sizeService from 'app/services/size.service';
import uploadService from 'app/services/upload.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiFillCaretDown, AiOutlineCloudUpload } from 'react-icons/ai';
import * as yup from 'yup';
import './style.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import productItemService from 'app/services/product-item.service';
import { ProductItemType } from 'app/models/general-type';
import { CiSquareRemove } from 'react-icons/ci';

const schema = yup.object().shape({
    sizeId: yup.string().required('Kích thước không được để trống'),
    quantity: yup.number().required('Số lượng không được để trống').min(1, 'Số lượng có ít nhất 1 cây').typeError('Kiểu giá trị của số lượng là số'),
    salePrice: yup.string().nullable(),
    rentPrice: yup.string().nullable(),
    imagesUrls: yup.array().required('Có ít nhất 1 hình ảnh cho thông tin này')
})

interface ModalSizeProductItemProps{
    productItemId: string;
    productItemType: ProductItemType;
    productItemDetail?: ProductItemDetail;
    onClose: () => void;
    onSubmit: (productItemDetail: ProductItemDetailHandle) => void;
}

const ModalProductItemDetail: React.FC<ModalSizeProductItemProps> = ({ productItemId, productItemType, productItemDetail, onClose, onSubmit }) => {
    const dispatch = useDispatch();
console.log({productItemId})
    const [sizes, setSizes]= useState<Size[]>([]);
    const [sizesFilter, setSizesFilter]= useState<Size[]>([]);
    const ref = useRef<HTMLInputElement>(null);

    const { control, formState: { errors, isSubmitting }, getValues, setValue, handleSubmit, setError, trigger, reset } = useForm<ProductItemDetailHandle>({
        defaultValues: {
            status: 'active',
            imagesUrls: []
        },
        resolver: yupResolver(schema)
    })

    useEffect(() =>{
        if(!productItemId) return;

        setValue('productItemID', productItemId)
    }, [productItemId, setValue])

    useEffect(() =>{
        if(!productItemDetail) return;

        const { id, imagesURL, quantity, rentPrice, salePrice, size, status } = productItemDetail
        setValue('id', id)
        setValue('productItemID', productItemId)
        setValue('imagesUrls', imagesURL)
        setValue('quantity', quantity)
        setValue('rentPrice', rentPrice || null)
        setValue('salePrice', salePrice || null)
        setValue('sizeId', size.id)
        setValue('status', status)

    }, [productItemDetail, setValue, productItemId])

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await sizeService.getAllSize();
                setSizes(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init();
    }, [dispatch])

    useEffect(() =>{
        if(!productItemType) return;

        
        if(productItemType === 'normal'){
            setSizesFilter(sizes.filter(x => x.sizeType === false))
        }else{
            setValue('quantity', 1)
            setSizesFilter(sizes.filter(x => x.sizeType === true))
        }

    }, [sizes, productItemType, setValue])

    const handleCloseModal = () => {
        onClose()
    }
    const handleRemoveImage = (index: number) => {
        const finalValues = getValues('imagesUrls')
        finalValues.splice(index, 1)
        setValue('imagesUrls', finalValues)
            trigger('imagesUrls')
    }
    const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) =>{
        const files = e.target.files
        if(!files) return;

        const finalFiles: File[] = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if(!CONSTANT.SUPPORT_FORMATS.includes(file.type)){
                setError('imagesUrls', {
                    type: 'pattern',
                    message: `Định dạng ảnh chỉ chấp nhận ${CONSTANT.SUPPORT_FORMATS.join(' - ')}`
                })
                trigger('imagesUrls')
                return;
            }
            finalFiles.push(file)
        }
        try{
            const res = await uploadService.uploadListFiles(finalFiles)
            let finalValues = getValues('imagesUrls')
            finalValues = [...finalValues, ...res.data]
            setValue('imagesUrls', finalValues)
            trigger('imagesUrls')
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    const handleSubmitForm = async (data: ProductItemDetailHandle) =>{
        if((!data.rentPrice && !data.salePrice)){
            setError('rentPrice', {
                type: 'pattern',
                message: 'Phải có ít nhất 1 giá thuê hoặc giá bán'
            })
            setError('salePrice', {
                type: 'pattern',
                message: 'Phải có ít nhất 1 giá thuê hoặc giá bán'
            })
            await trigger('quantity')
            return;
        }
        const finalData: ProductItemDetailHandle = {
            ...data,
            rentPrice: data.rentPrice ? data.rentPrice : null,
            salePrice: data.salePrice ? data.salePrice : null,
        }
        console.log(finalData)
        if(!data.id){
            try{
                const res = await productItemService.createProductItemDetail(finalData)
                onSubmit(res.data)
                onClose()
                reset()
                dispatch(setNoti({type: 'success', message: `Tạo mới thành công`}))
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }else{
            try{
                const res = await productItemService.updateProductItemDetail(finalData)
                onSubmit(res.data)
                onClose()
                reset()
                dispatch(setNoti({type: 'success', message: `Cập nhật thành công`}))
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
    }
    return (
        <Modal
            title={`${productItemDetail ? 'Chỉnh sửa' : 'Tạo mới'} thông tin chi tiết`}
            open
            footer={null}
            onCancel={onClose}
            width={1000}
        >
            <Form
                layout='vertical'
                onFinish={handleSubmit(handleSubmitForm)}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='Kích thước sản phẩm' required>
                            <Controller
                                control={control}
                                name='sizeId'
                                render={({ field }) => (
                                    <Select suffixIcon={<AiFillCaretDown />} {...field} >
                                        {
                                            sizesFilter.map((size, index) => (
                                                <Select.Option key={index} value={size.id}>
                                                    {size.sizeName}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            />
                            {errors.sizeId && <ErrorMessage message={errors.sizeId.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Số lượng sản phẩm' required>
                            <Controller
                                control={control}
                                name='quantity'
                                render={({ field }) => <Input type='number' disabled={productItemType === 'unique'} {...field} />}
                            />
                            {errors.quantity && <ErrorMessage message={errors.quantity.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Giá bán'>
                            <Controller
                                control={control}
                                name='salePrice'
                                render={({ field }) => <InputNumber min={0} type='number' {...field} style={{width: '100%'}} />}
                            />
                            {errors.salePrice && <ErrorMessage message={errors.salePrice.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Giá thuê'>
                            <Controller
                                control={control}
                                name='rentPrice'
                                render={({ field }) => <InputNumber min={0} type='number' {...field} style={{width: '100%'}} />}
                            />
                            {errors.rentPrice && <ErrorMessage message={errors.rentPrice.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item label='Trạng thái'>
                            <Controller
                                control={control}
                                name='status'
                                render={({ field: { value, onChange } }) => <Switch checked={value === 'active'} onChange={onChange} />}
                            />
                            {errors.status && <ErrorMessage message={errors.status.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{marginBottom: '20px'}}>
                        <button className='btn btn-upload' type='button' onClick={() => ref.current?.click()}>
                            <AiOutlineCloudUpload size={24} />
                            Đăng tải hình ảnh
                        </button>
                        {errors.imagesUrls && <ErrorMessage message={errors.imagesUrls.message} />}
                    </Col>
                    <input type="file" hidden ref={ref} accept='.png,.jpg,.jpeg' multiple onChange={handleUploadFiles} />
                    {
                        getValues('imagesUrls') &&
                        <Image.PreviewGroup>
                            {
                                getValues('imagesUrls').map((item, index) => (
                                    <Col span={6} key={index} className='preview-wrapper'>
                                        <Image 
                                            src={item}
                                            alt='/'
                                            className='img-preview'
                                        />
                                        <CiSquareRemove size={30} onClick={() => handleRemoveImage(index)} className='btn-remove' />
                                    </Col>
                                ))
                            }
                        </Image.PreviewGroup>
                    }
                    <Col span={24} >
                        <div className='btn-form-wrapper'>
                            <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={handleCloseModal}>Hủy bỏ</Button>
                            <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large' onClick={() => console.log(errors)}>
                                {
                                    productItemDetail ? 'Cập nhật' : 'Tạo mới'
                                }
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalProductItemDetail