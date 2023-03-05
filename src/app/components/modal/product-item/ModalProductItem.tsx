import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Switch, Upload } from 'antd';
// import {  UploadFile } from 'antd/es/upload';
import useDispatch from 'app/hooks/use-dispatch';
import { ProductItemType } from 'app/models/general-type';
import { ProductItemHandleCreate } from 'app/models/product-item';
import { Size } from 'app/models/size';
import sizeService from 'app/services/size.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { AiFillCaretDown, AiOutlineCloudUpload } from 'react-icons/ai';
import { BiDollar } from 'react-icons/bi';
import * as yup from 'yup';
import './style.scss';

// import fileService from 'app/services/file.service';

const schema = yup.object().shape({
    name: yup.string().required('Product name is required').min(5, 'Product name is greater than 5 characters').max(30, 'Product name is less than 30 characters'),
    salePrice: yup.number().required('Sale price is required').positive('Sale price must be positive number').max(1000000000, 'Sale price is less than 1.000.000.000 VNĐ'),
    description: yup.string().max(200, 'Description is less than 200 characters'),
    sizeId: yup.string().required('Size is required'),
    quantity: yup.number().positive('Quantity is positive number').max(1000000, 'Quantity is less than 1000000'),
    type: yup.string().required('Type is required'),
    rentPrice: yup.number().positive('Rent price is positive number').max(1000000000, 'Sale price is less than 1.000.000.000 VNĐ'),

})

interface ModalProductItemProps{
    productIdSelected: string;
    // productItem?: ProductItem;
    // action: Action;
    open: boolean;
    onClose: () => void;
    // onSubmit: (product: Product, action: Action) => void;
}

const ModalProductItem: React.FC<ModalProductItemProps> = ({productIdSelected, open, onClose}) => {
    const dispatch = useDispatch();
    const [sizes, setSizes] = useState<Size[]>([])
    // const [uploaded, setUploaded] = useState<UploadFile[]>([])

    const { setValue, getValues, control, handleSubmit, formState: {  isSubmitting },  trigger } = useForm<ProductItemHandleCreate>({
        defaultValues: {
           
        },
        resolver: yupResolver(schema)
    })

    const { fields } = useFieldArray({
        control,
        name: 'sizeModelList'
    })


    useEffect(() =>{
        const init = async () =>{
            try{
                const resSize = await sizeService.getAllSize();
                setSizes(resSize.data)
            }catch(err){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
            }
        }
        init()
    }, [dispatch])

    // useEffect(() =>{
    //     const initFiles = async () =>{
    //         try{
    //             const res = await fileService.getAnImage('https://greengardenstorage.blob.core.windows.net/greengardensimages/0b7212b6-e3c4-4570-bdee-94ab30331ff9.png')
    //             setUploaded([res])
    //         }catch{
    //             dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE})) 
    //         }
    //     }
    //     initFiles()
    // }, [dispatch])

    const handleCloseModal = () =>{
        onClose()
    }
    
    // const isValidLarge = (files: RcFile[] | UploadFile[]) =>{
    //     const newFiles = files.map(x => x as RcFile)
    //     let errorMsg = ''
    //     for (let i = 0; i < newFiles.length; i++) {
    //         const file = newFiles[i];
    //         if(!CONSTANT.SUPPORT_FORMATS.includes(file.type)){
    //             errorMsg += `Image ${i + 1} is not valid file\n\r`
    //         }else if(file.size <= 100000){
    //             errorMsg += `Image ${i + 1} is too large\n\r`
    //         }
    //     }
    //     if(errorMsg){
    //         setError('imgURLs', {
    //             type: 'pattern',
    //             message: errorMsg
    //         })
    //         return false
    //     }
    //     return true
    // }

    const handleSubmitForm = async (data: ProductItemHandleCreate) =>{
        // const files = data.imgFiles || []
        // if(!files || files.length === 0){
        //     setError('imgURLs', {
        //         type: 'pattern',
        //         message: 'Image is required'
        //     })
        //     return
        // }

        // if(files.length > 6){
        //     setError('imgURLs', {
        //         type: 'pattern',
        //         message: 'Image count is less than 7 items'
        //     })
        //     return  
        // }

        // if(!isValidLarge(files)) return;
        
    }
    
    // const handleUpload  = async (index: number, info: UploadChangeParam<UploadFile<any>>) =>{
    //     const listPreview: string[] = []
    //     const listFile: RcFile[] = []
    //     console.log(info)
    //     // console.log(info.fileList)
    //     // console.log()
    //     setUploaded([...info.fileList])

        // const fileInForm = getValues('imgFiles') || []
        
        // const newInfof = info.fileList.filter((x, index) => {
        //     if((index + 1) > uploaded) return x
        // })
        // console.log(info.fileList.length)
        // setUploaded(info.fileList.length)
        // console.log(newInfof)



        
        // for (let i = 0; i < info.fileList.length; i++) {
        //     const originFileObj = info.fileList[i].originFileObj as RcFile;
        //     utilsFile.getBase64(originFileObj, (url) =>{
        //         listPreview.push(url)
        //         setValue('imgURLs', [...listPreview])
        //     })
        //     listFile.push(originFileObj)
        // }
        // await trigger('imgURLs')
        // setValue('imgFiles', listFile)
        // clearErrors('imgURLs')
    // }

    // const handleRemoveItem = async (index: number) =>{
    //     // let newFileList = [...uploaded];
    //     // newFileList.splice(index, 1)
    //     // setUploaded([...newFileList])
        

    //     // const urls = getValues('imgURLs')
    //     // const files = getValues('imgFiles')

    //     // urls?.splice(index, 1)
    //     // files?.splice(index, 1)

    //     // setValue('imgURLs', urls)
    //     // setValue('imgFiles', files)
    //     // await trigger('imgURLs')
    //     // if(!isSubmitted) return;
    //     // isValidLarge(newFileList)
    // }
    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
          return uploadAdapter(loader);
        };
    }
    function uploadAdapter(loader) {
        return {
          upload: () => {
            return new Promise((resolve, reject) => {
              const body = new FormData();
              loader.file.then((file) => {
                body.append("files", file);
                
                fetch(`${process.env.REACT_APP_API_END_POINT}/image/upload`, {
                  method: "post",
                  body: body
                })
                  .then((res) => res.json())
                  .then((res) => {
                    resolve({
                      default: res.data[0]
                    });
                  })
                  .catch((err) => {
                    reject(err);
                  });
              });
            });
          }
        };
      }
    return (
        <Modal
            className='modal-pi-wrapper'
            open={open}
            onCancel={handleCloseModal}
            footer={null}
            // title={`${action} product item ${productItem ? (' ' + productItem.name) : ''}`}
            width={800}
        >
            <Form
                layout='vertical'
                onFinish={handleSubmit(handleSubmitForm)}
                className='modal-pi-form'
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='Name' required>
                            <Controller 
                                control={control}
                                name='name'
                                render={({ field }) => <Input {...field} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Type' required>
                            <Controller 
                                control={control}
                                name='type'
                                render={({ field: { value, onChange} }) => (
                                    <Select suffixIcon={<AiFillCaretDown />} onChange={(value: string) => {
                                        setValue('type', value as ProductItemType)
                                        trigger('type')
                                    }} value={value} >
                                        <Select.Option value='normal'>
                                            Normal
                                        </Select.Option>
                                        <Select.Option value='unique'>
                                            Unique
                                        </Select.Option>
                                    </Select>
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='Description'>
                            <Controller 
                                control={control}
                                name='description'
                                render={({ field }) => <Input.TextArea {...field} style={{height: 120}} />}
                            />
                        </Form.Item>
                    </Col>
                    {
                        fields.map((field, index) => (
                            <>
                                <Col span={12}>
                                    <Form.Item label='Size' required>
                                        <Controller 
                                            control={control}
                                            name={`sizeModelList.${index}.sizeId`}
                                            render={({ field }) => (
                                                <Select suffixIcon={<AiFillCaretDown />} {...field} >
                                                    {
                                                        sizes.map((size, index) => (
                                                            <Select.Option key={index} value={size.id}>
                                                                {size.sizeName}
                                                            </Select.Option>
                                                        ))
                                                    }
                                                </Select>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Status'>
                                        <Controller 
                                            control={control}
                                            name={`sizeModelList.${index}.status`}
                                            render={({ field: {value} }) => <Switch checked={value === 'active'} onChange={(checked: boolean) => {
                                                setValue(`sizeModelList.${index}.status`, checked ? 'active' : 'disable')
                                            }} />}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Sale Price' required>
                                        <Controller 
                                            control={control}
                                            name={`sizeModelList.${index}.salePrice`}
                                            render={({ field }) => <InputNumber type={'number'} addonAfter={<BiDollar />} {...field} style={{width: '100%'}} />}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Rent Price' required>
                                        <Controller 
                                            control={control}
                                            name={`sizeModelList.${index}.rentPrice`}
                                            render={({ field }) => <InputNumber type={'number'} addonAfter={<BiDollar />} {...field} style={{width: '100%'}} />}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Quantity'>
                                        <Controller 
                                            control={control}
                                            name={`sizeModelList.${index}.quantity`}
                                            render={({ field: { value, onChange } }) => (
                                                <InputNumber 
                                                    onChange={onChange} 
                                                    value={getValues('type') === 'unique' ? '' : value} 
                                                    disabled={getValues('type') === 'unique'} 
                                                    type={'number'} 
                                                    style={{width: '100%'}} 
                                                />
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label='Images' required>
                                        <Upload
                                            // onChange={(info) => handleUpload(index, info)}
                                            showUploadList={false}
                                            accept='.png,.jpg,.jpeg'
                                            multiple
                                            className='modal-pi-uploader'
                                            // fileList={uploaded}
                                            // onRemove={}
                                        >
                                                <button type='button'>
                                                    <AiOutlineCloudUpload size={24} />
                                                    Upload images
                                                </button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label='Content'>
                                        <Controller
                                            control={control}
                                            name={`sizeModelList.${index}.content`}
                                            render={({field: { value }}) => (
                                                <CKEditor
                                                    editor={ ClassicEditor }
                                                    data={value}
                                                    onChange={ ( event, editor ) => {
                                                        const data = editor.getData();
                                                        setValue(`sizeModelList.${index}.content`, data)
                                                    } }
                                                    config={{
                                                        extraPlugins: [uploadPlugin]
                                                    }}
                                                />
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                            </>
                        ))
                    }
                   
                    
                    
                   
                    
                    
                    
                   
                    {/* {
                        getValues('imgURLs')?.length !== 0 &&
                        <>
                            <Col span={24} className='preview-wrapper'>
                                <Image.PreviewGroup>
                                    <Row gutter={[12, 12]}>
                                        {
                                            getValues('imgURLs')?.map((x, index) => (
                                                <Col span={6} className='preview-item' key={index}>
                                                    <Image
                                                        key={index}
                                                        // width={190}
                                                        src={x}
                                                        className='preview-image'
                                                    />
                                                    <AiOutlineCloseCircle className='btn-close' size={25} color='#fff' onClick={() => handleRemoveItem(index)} />
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                </Image.PreviewGroup>
                            </Col>
                            {
                                errors.imgURLs && 
                                <Col span={24}>
                                    <ErrorMessage message={errors.imgURLs.message} />
                                </Col>
                            }
                        </>
                    } */}
                    <Col span={24}>
                        <Form.Item className='btn-form-wrapper'>
                            <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={handleCloseModal}>Cancel</Button>
                            <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>Create</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalProductItem