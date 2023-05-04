import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Form, Image, Input, Modal, Row, Select, Switch } from 'antd';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import CurrencyInput from 'app/components/renderer/currency-input/CurrencyInput';
import useDispatch from 'app/hooks/use-dispatch';
import { ProductItem, ProductItemDetailHandle } from 'app/models/product-item';
import { Size } from 'app/models/size';
import productItemService from 'app/services/product-item.service';
import sizeService from 'app/services/size.service';
import uploadService from 'app/services/upload.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import utilGeneral from 'app/utils/general';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiFillCaretDown, AiOutlineCloudUpload } from 'react-icons/ai';
import { CiSquareRemove } from 'react-icons/ci';
import * as yup from 'yup';
import './style.scss';

const schema = yup.object().shape({
    sizeId: yup.string().required('Kích thước không được để trống'),
    transportFee: yup.number().required('Phí vận chuyển không được để trống').typeError('Phí vận chuyển chỉ chấp nhận số'),
    quantity: yup.number().required('Số lượng không được để trống'),
    salePrice: yup.number().nullable(),
    rentPrice: yup.number().nullable(),
    imagesUrls: yup.array().required('Có ít nhất 1 hình ảnh cho thông tin này').min(1, 'Có ít nhất 1 hình ảnh cho thông tin này')
})

interface ModalSizeProductItemProps{
    productItem: ProductItem
    productDetailIndex: number;
    // productItemDetail?: ProductItemDetail;
    isRent: boolean;
    isSale: boolean;
    onClose: () => void;
    onSubmit: (productItemDetail: ProductItemDetailHandle) => void;
}

const ModalProductItemDetail: React.FC<ModalSizeProductItemProps> = ({ productItem, productDetailIndex, isRent, isSale, onClose, onSubmit }) => {
    const dispatch = useDispatch();

    const [sizes, setSizes]= useState<Size[]>([]);
    const [sizesFilter, setSizesFilter]= useState<Size[]>([]);
    const ref = useRef<HTMLInputElement>(null);

    const { control, formState: { errors, isSubmitting }, getValues, setValue, handleSubmit, setError, trigger, reset } = useForm<ProductItemDetailHandle>({
        defaultValues: {
            status: 'active',
            imagesUrls: [],
            transportFee: 0,
        },
        resolver: yupResolver(schema)
    })

    useEffect(() =>{
        setValue('productItemID', productItem.id)
    }, [productItem, setValue])

    useEffect(() =>{
        const productItemDetail = productItem.productItemDetail[productDetailIndex]
        if(!productItemDetail) return;

        const { id, imagesURL, quantity, rentPrice, salePrice, size, status, transportFee } = productItemDetail
        setValue('id', id)
        setValue('productItemID', productItem.id)
        setValue('imagesUrls', imagesURL)
        setValue('quantity', quantity)
        setValue('rentPrice', rentPrice)
        setValue('salePrice', salePrice)
        setValue('sizeId', size.id)
        setValue('status', status)
        setValue('transportFee', transportFee)

    }, [setValue, productItem, productDetailIndex])

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await sizeService.getAllSize();
                // if(productDetailIndex < 0){
                //     setSizes(res.data)
                // }else{
                    const sizeExsited = productItem.productItemDetail.map(x => x.size.id)
                    const sizeFinal = res.data.filter(x => !sizeExsited.includes(x.id))
                    if(productDetailIndex >= 0){
                        sizeFinal.push(productItem.productItemDetail[productDetailIndex].size)
                    }
                    setSizes(sizeFinal)
                // }
            }catch(e){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init();
    }, [dispatch, productDetailIndex, productItem])

    useEffect(() =>{
        const productItemType = productItem.type
        if(!productItemType) return;

        
        if(productItemType === 'normal'){
            setSizesFilter(sizes.filter(x => x.sizeType === false))
        }else{
            setValue('quantity', 1)
            setSizesFilter(sizes.filter(x => x.sizeType === true))
        }

    }, [sizes, productItem, setValue])

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
            if(!CONSTANT.SUPPORT_FORMATS.includes(file.type) || file.size > CONSTANT.FILE_SIZE_ACCEPTED){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.INVALID_FILE}))
                // setError('imagesUrls', {
                //     type: 'pattern',
                //     message: `Định dạng ảnh chỉ chấp nhận ${CONSTANT.SUPPORT_FORMATS.join(' - ')}`
                // })
                // trigger('imagesUrls')
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
            rentPrice: data.rentPrice,
            salePrice: data.salePrice,
        }
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
            title={`${productDetailIndex > -1 ? 'Chỉnh sửa' : 'Tạo mới'} thông tin chi tiết`}
            open
            footer={null}
            onCancel={onClose}
            width={1000}
        >
            <Form
                layout='vertical'
                onFinish={handleSubmit(handleSubmitForm)}
            >
                <Row gutter={[24, 24]}>
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
                                render={({ field: { value } }) => <Input type='number' min={0} disabled={productItem.type === 'unique'} value={value} onChange={(e) =>{
                                    const data = Number(e.target.value || 0)
                                    setValue('quantity', data)
                                }} />}
                            />
                            {errors.quantity && <ErrorMessage message={errors.quantity.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Giá bán'>
                            <Controller
                                control={control}
                                name='salePrice'
                                render={({ field: { value } }) => <CurrencyInput disbaled={!isSale} value={value || 0} min={0} onChange={(e) => utilGeneral.setCurrency(setValue, 'salePrice', e)}/>}
                            />
                            {errors.salePrice && <ErrorMessage message={errors.salePrice.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Giá thuê'>
                            <Controller
                                control={control}
                                name='rentPrice'
                                render={({ field: { value } }) => <CurrencyInput disbaled={!isRent} value={value || 0} min={0} onChange={(e) => utilGeneral.setCurrency(setValue, 'rentPrice', e)}/>}
                            />
                            {errors.rentPrice && <ErrorMessage message={errors.rentPrice.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Trạng thái'>
                            <Controller
                                control={control}
                                name='status'
                                render={({ field: { value, onChange } }) => <Switch checked={value === 'active'} onChange={onChange} />}
                            />
                            {errors.status && <ErrorMessage message={errors.status.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Phí vận chuyển (VND)'>
                            <Controller
                                control={control}
                                name='transportFee'
                                render={({ field: { value } }) => <CurrencyInput value={value} min={0} onChange={(e) => utilGeneral.setCurrency(setValue, 'transportFee', e)}/>}
                            />
                            {errors.transportFee && <ErrorMessage message={errors.transportFee.message} />}
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
                            <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large' >
                                {
                                    productDetailIndex > -1 ? 'Cập nhật' : 'Tạo mới'
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