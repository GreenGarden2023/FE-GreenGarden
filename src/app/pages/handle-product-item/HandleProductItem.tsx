import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Divider, Form, Image, Input, InputNumber, Row, Select, Switch, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import useDispatch from 'app/hooks/use-dispatch';
import { ProductItemType } from 'app/models/general-type';
import { ProductItemHandleCreate } from 'app/models/product-item';
import { Size } from 'app/models/size';
import sizeService from 'app/services/size.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import utilsFile from 'app/utils/file';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { AiFillCaretDown, AiOutlineCloseCircle, AiOutlineCloudUpload } from 'react-icons/ai';
import { BiDollar } from 'react-icons/bi';
import * as yup from 'yup';
import './style.scss';

// import fileService from 'app/services/file.service';

const schema = yup.object().shape({
    // name: yup.string().required('Product name is required').min(5, 'Product name is greater than 5 characters').max(30, 'Product name is less than 30 characters'),
    // salePrice: yup.number().required('Sale price is required').positive('Sale price must be positive number').max(1000000000, 'Sale price is less than 1.000.000.000 VNĐ'),
    // description: yup.string().max(200, 'Description is less than 200 characters'),
    // sizeId: yup.string().required('Size is required'),
    // quantity: yup.number().positive('Quantity is positive number').max(1000000, 'Quantity is less than 1000000'),
    // type: yup.string().required('Type is required'),
    // rentPrice: yup.number().positive('Rent price is positive number').max(1000000000, 'Sale price is less than 1.000.000.000 VNĐ'),

})


const HandleProductItem: React.FC = () => {
    const dispatch = useDispatch();
    const [sizes, setSizes] = useState<Size[]>([])
    const [uploaded, setUploaded] = useState<UploadFile[][]>([])
    const [listErr, setListErr] = useState<string[][]>([])

    const { setValue, getValues, control, handleSubmit, formState: { errors, isSubmitted, isSubmitting },  trigger, setError } = useForm<ProductItemHandleCreate>({
        defaultValues: {
           sizeModelList: []
        },
        // resolver: yupResolver(schema)
    })

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
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

    const handleCloseModal = () =>{
        // onClose()
    }
    
    const isValidLarge = (files: RcFile[] | UploadFile[]) =>{
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
    }

    const test = (index: number, value: string[]) =>{
        return new Promise(res => {
res(handleSetListError(index,value ))
        })
    }

    const handleSetListError = (index: number, value: string[]) =>{
        const lError = [...listErr]
        console.log(lError)
        lError[index] = value
        setListErr([...lError])
    }
    console.log(listErr)
    const handleSubmitForm = async (data: ProductItemHandleCreate) =>{
        let check = true
        for (let i = 0; i < data.sizeModelList.length; i++) {
            const element = data.sizeModelList[i];
            if(!element.imgFiles || element.imgFiles.length === 0){
                console.log(i, element)
                await test(i, ['Images is required'])
                // const lError = [...listErr]
                // lError[i] = []
                // setListErr([...lError])
            }else if(element.imgFiles.length > 6){
                await test(i, ['Image count is less than 7 items'])
                check = false
                // const lError = [...listErr]
                // lError[i] = ['Image count is less than 7 items']
                // setListErr([...lError])
            }else{
                let errorMsg = ''
                for (let j = 0; j < element.imgFiles.length; j++) {
                    const child = element.imgFiles[j];
                    if(!CONSTANT.SUPPORT_FORMATS.includes(child.type)){
                        errorMsg += `Image ${j + 1} is not valid file\n\r`
                        check = false

                    }
                }
                if(errorMsg){
                    await test(i, [errorMsg])
                    
                }else{
                    await test(i, [])
                }
            }
        }
        if(!check) return

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
    
    const handleUpload  = async (index: number, info: UploadChangeParam<UploadFile<any>>) =>{
        const listPreview: string[] = []
        const listFile: RcFile[] = []
        const itemUploads = [...uploaded]
        itemUploads[index] = [...info.fileList]
        
        setUploaded([...itemUploads])
        
        for (let i = 0; i < info.fileList.length; i++) {
            const originFileObj = info.fileList[i].originFileObj as RcFile;
            utilsFile.getBase64(originFileObj, (url) =>{
                listPreview.push(url)
                setValue(`sizeModelList.${index}.imagesURL`, [...listPreview])
            })
            listFile.push(originFileObj)
        }
        await trigger(`sizeModelList.${index}.imagesURL`)
        setValue(`sizeModelList.${index}.imgFiles`, listFile)
        await trigger(`sizeModelList.${index}.imgFiles`)

        // clearErrors('imgURLs')
    }
    console.log(uploaded)
    const handleRemoveItem = async (index: number, indexImg: number) =>{
        console.log({index, indexImg})
        const itemUploads = [...uploaded]
        itemUploads[index].splice(indexImg, 1)
        setUploaded([...itemUploads])

        const urls = getValues(`sizeModelList.${index}.imagesURL`)
        const files = getValues(`sizeModelList.${index}.imgFiles`)

        urls?.splice(indexImg, 1)
        files?.splice(indexImg, 1)

        setValue(`sizeModelList.${indexImg}.imagesURL`, urls)
        setValue(`sizeModelList.${indexImg}.imgFiles`, files)

        await trigger('sizeModelList')
        // if(!isSubmitted) return;
        // isValidLarge(newFileList)
    }
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
    const handleAddSize = () =>{
        if(getValues('sizeModelList').length >= 1 && getValues('type') === 'unique'){
            dispatch(setNoti({type: 'warning', message: 'Can not gi do'}))
            return
        }
        append({
            status: 'active'
        })
        trigger('sizeModelList')
    }
    const handleRemove = (index: number) =>{
        const items = [...uploaded]
        if(items[index]){
            items[index] = []
            setUploaded([...items])
        }
        remove(index)
        trigger('sizeModelList')
    }
    return (
        // <Modal
        //     className='modal-pi-wrapper'
        //     open={open}
        //     onCancel={handleCloseModal}
        //     footer={null}
        //     // title={`${action} product item ${productItem ? (' ' + productItem.name) : ''}`}
        //     width={800}
        // >
        <div className="modal-pi-wrapper">
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
                                    <Select disabled={(getValues('sizeModelList').length > 1)} suffixIcon={<AiFillCaretDown />} onChange={(value: string) => {
                                        const val = value as ProductItemType
                                        setValue('type', val)
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
                    <Col span={24}>
                        <Button htmlType='button' disabled={!getValues('type')} onClick={handleAddSize}>Plus</Button>
                    </Col>
                    {
                        fields.map((field, index) => (
                            <React.Fragment key={index}>
                                <Col span={12}>
                                    <Form.Item label='Size' required>
                                        <Controller 
                                            control={control}
                                            name={`sizeModelList.${index}.size`}
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
                                <Col span={12}>
                                    <Button htmlType='button' onClick={() => handleRemove(index)}>Remove</Button>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label='Images' required>
                                        <Upload
                                            onChange={(info) => handleUpload(index, info)}
                                            showUploadList={false}
                                            accept='.png,.jpg,.jpeg'
                                            multiple
                                            className='modal-pi-uploader'
                                            fileList={uploaded[index]}
                                        >
                                            <button type='button'>
                                                <AiOutlineCloudUpload size={24} />
                                                Upload images
                                            </button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                {
                                    getValues(`sizeModelList.${index}.imagesURL`)?.length !== 0 &&
                                    <>
                                        <Col span={24} className='preview-wrapper'>
                                            <Image.PreviewGroup>
                                                <Row gutter={[12, 12]}>
                                                    {
                                                        getValues(`sizeModelList.${index}.imagesURL`)?.map((x, indexImg) => (
                                                            <Col span={6} className='preview-item' key={indexImg}>
                                                                <Image
                                                                    key={index}
                                                                    // width={190}
                                                                    src={x}
                                                                    className='preview-image'
                                                                />
                                                                <AiOutlineCloseCircle className='btn-close' size={25} color='#fff' onClick={() => handleRemoveItem(index, indexImg)} />
                                                            </Col>
                                                        ))
                                                    }
                                                </Row>
                                            </Image.PreviewGroup>
                                        </Col>
                                        {
                                            (listErr[index] && listErr[index].length !== 0) && 
                                            <Col span={24}>
                                                <ErrorMessage message={listErr[index][0]} />
                                            </Col>
                                        }
                                    </>
                                }
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
                                <Divider />
                            </React.Fragment>
                        ))
                    }
                    <Col span={24}>
                        <Form.Item className='btn-form-wrapper'>
                            <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={handleCloseModal}>Cancel</Button>
                            <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>Create</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
        // </Modal>
    )
}

export default HandleProductItem