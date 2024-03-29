import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Image, Input, Modal, Switch, Table, Tooltip, Upload } from 'antd';
import { ColumnsType } from 'antd/es/table';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import useDispatch from 'app/hooks/use-dispatch';
import { Category, CategoryHandle } from 'app/models/category';
import { Paging } from 'app/models/paging';
import categoryService from 'app/services/category.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiFillEdit, AiOutlinePlus } from 'react-icons/ai';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import './style.scss';
// import moment from 'moment'
// import dayjs from 'dayjs';
// import type { DatePickerProps } from 'antd/es/date-picker';
import utilsFile from 'app/utils/file';

const schema = yup.object().shape({
  Name: yup.string().required('Tên danh mục không được để trống').min(5, 'Tên danh mục có ít nhất 5 ký tự').max(30, 'Tên danh mục có nhiều nhất 30 ký tự'),
  imgUrl: yup.string().required('Ảnh đại diện không được để trống'),
  Description: yup.string().max(500, 'Mô tả có nhiều nhất 500 ký tự'),
  imgFile: yup.mixed()
  .test('FILE_FORMAT', 'Ảnh đại diện chỉ hỗ trợ các định dạng png/jpg/jpeg', (value) => {
    return !value || (value && CONSTANT.SUPPORT_FORMATS.includes(value.type))
  })
  .test('FILE_SIZE', 'Kích thước ảnh đại diện quá lớn', (value ) => {
    return !value || (value && value.size <= CONSTANT.FILE_SIZE_ACCEPTED)
  })
})

const ManageCategory: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySelected, setCagorySelected] = useState<Category>();
  const [paging, setPaging] = useState<Paging>();
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaderCateId, setLoaderCateId] = useState<string[]>([]);
  
  const { setValue, handleSubmit, formState: { errors, isSubmitting }, control, trigger, reset, setError } = useForm<CategoryHandle>({
    resolver: yupResolver(schema)
  })

  useEffect(() =>{
    const currentPage = searchParams.get('page');
    if(!pagingPath.isValidPaging(currentPage)){
      navigate('/panel/manage-category?page=1', { replace: true })
      return;
    }

    const init = async () =>{
      setLoading(true)
      try{
        const res = await categoryService.getAllCategory({curPage: Number(currentPage), pageSize: CONSTANT.PAGING_ITEMS.CATEGORY})
        setCategories(res.data.result)
        setPaging(res.data.paging)
      }catch(err){
        dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
      }
      setLoading(false)
    }
    init();
    
  }, [dispatch, navigate, searchParams])

  useEffect(() =>{
    if(!categorySelected) return;

    const { id, name, imgUrl, status, description } = categorySelected;

    setValue('ID', id)
    setValue('Name', name)
    setValue('imgUrl', imgUrl)
    setValue('Status', status)
    setValue('Description', description)

  }, [categorySelected, setValue])
  const Column: ColumnsType<Category> = [
      {
        title: 'Tên thể loại cây',
        key: 'name',
        dataIndex: 'name',
        align: 'center',
        width: 200
      },
      {
        title: 'Mô tả',
        key: 'description',
        dataIndex: 'description',
        align: 'left',
        width: 600
      },
      {
        title: 'Trạng thái',
        key: 'status',
        dataIndex: 'status',
        render: (_, record) => (
          <Switch loading={loaderCateId.includes(record.id)} checked={record.status === CONSTANT.STATUS.ACTIVE} onChange={(checked: boolean) => handleToggleStatus(checked, record)} />
        ),
        align: 'center'
      },
      {
        title: 'Ảnh đại diện',
        key: 'imgUrl',
        dataIndex: 'imgUrl',
        render: (_, record) => (
          <Image 
            width={100}
            height={100}
            src={record.imgUrl}
            onError={({currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = '/assets/inventory-empty.png'
            }}
            style={{objectFit: 'cover'}}
          />
        ),
        align: 'center'
      },
      {
        title: 'Công cụ',
        key: 'actions',
        dataIndex: 'actions',
        render: (_, record) => (
          <div className="btn-actions-wrapper">
            <Tooltip title='Chỉnh sửa' color='#108ee9'>
              <AiFillEdit className='btn-icon' color='#00a76f' onClick={() => {
                setCagorySelected(record)
                setAction(CONSTANT.ACTION.UPDATE)
              }} />
            </Tooltip>
          </div>
        ),
        align: 'center'
      }
  ]
  const DataSource = useMemo(() =>{
    return categories.map((category, index) => ({
      key: String(index + 1),
      ...category
    }))
  }, [categories])

  const handleToggleStatus = async (checked: boolean, category: Category) =>{
    setLoaderCateId([...loaderCateId, category.id])
    try{
      const statusHandle = checked ? CONSTANT.STATUS.ACTIVE : CONSTANT.STATUS.DISABLE
      await categoryService.toggleStatus(category.id, category.name, statusHandle)
      setCategories(categories.map(x => x.id === category.id ? {
        ...x,
        status: statusHandle
      } : x))
      dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái "${category.name}" thành công`}))
    }catch(err){
      dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
    }
    setLoaderCateId(loaderCateId.filter(x => x !== category.id))
  }

  const onSubmitForm = async (data: CategoryHandle) =>{
    if(action === CONSTANT.ACTION.CREATE){
      try{
        const res = await categoryService.createCategory(data)
        if(categories.length === CONSTANT.PAGING_ITEMS.CATEGORY){
          categories.pop()
          setCategories([res.data, ...categories])
        }else{
          setCategories([res.data, ...categories])
        }
        closeModal()
        dispatch(setNoti({type: 'success', message: `Tạo mới "${data.Name}" thành công`}))
      }catch(err: any){
        if(err.response.data.code === 400){
          setError('Name', {
            type: 'pattern',
            message: err.response.data.message
          })
          // await trigger('Name')
          return
        }
        dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
      }
    }else{
      try{
        await categoryService.updateCategory(data);
        setCategories(
          categories.map(category => category.id === categorySelected?.id ? ({
            ...categorySelected,
            name: data.Name,
            description: data.Description,
            imgUrl: data.imgUrl || ''
          }) : category)
        )
        closeModal();
        dispatch(setNoti({type: 'success', message: `Cập nhật "${data.Name}" thành công`}))
      }catch(err: any){
        if(err.response.data.code === 400){
          setError('Name', {
            type: 'pattern',
            message: err.response.data.message
          })
          // await trigger('Name')
          return
        }
        dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
      }
    }
  }
  const handleUpload: UploadProps['onChange']  = (info: UploadChangeParam<UploadFile>) =>{
    utilsFile.getBase64(info.file.originFileObj as RcFile, (url) => {
      setValue('imgFile', info.file.originFileObj)
      trigger('imgFile')
      setValue('imgUrl', url)
      trigger('imgUrl')
    })
  }
  const closeModal = () =>{
    setCagorySelected(undefined)
    setAction('')
    reset()
  }
  
  return (
    <div className='mc-wrapper'>
      <section className="mc-infor default-layout">
        <h1>Quản lý danh mục cây</h1>
      </section>
      <section className="mc-search-wrapper default-layout">
        <button className='btn-create' onClick={() => {
          setAction(CONSTANT.ACTION.CREATE)
          reset()
        }}>Tạo mới 1 thể loại cây</button>
      </section>
      <section className="mc-box default-layout">
        <Table loading={loading} className='mc-table' dataSource={DataSource} columns={Column} pagination={{
          pageSize: paging?.pageSize || 1,
          current: paging?.curPage || 1,
          total: paging?.recordCount || 1,
          onChange: (page: number) =>{
            navigate(`/panel/manage-category?page=${page}`)
          }
        }} />
      </section>
      <Modal
        open={Boolean(categorySelected) || action === CONSTANT.ACTION.CREATE}
        title={`${action === 'Create' ? 'Tạo mới' : 'Cập nhật'} danh mục ${categorySelected?.name || ''}`}
        onCancel={closeModal}
        footer={null}
        width={800}
        className='mc-modal-create'
      >
        <Form
          layout='vertical'
          onFinish={handleSubmit(onSubmitForm)}
          action='#'
        >
          <Form.Item label='Tên danh mục' required validateStatus={errors.Name ? 'error' : ''}>
            <Controller
              control={control}
              name='Name'
              render={({ field }) => <Input {...field} />}
            />
            {errors.Name && <ErrorMessage message={errors.Name.message} />}
          </Form.Item>
          <Form.Item label='Mô tả' validateStatus={errors.Description ? 'error' : ''}>
            <Controller
              control={control}
              name='Description'
              render={({ field }) => <Input.TextArea {...field} style={{ height: 120, resize: 'none' }} />}
            />
            {errors.Description && <ErrorMessage message={errors.Description.message} />}
          </Form.Item>
          <Form.Item label='Ảnh đại diện' required>
            <Controller
              control={control}
              name='imgUrl'
              render={({ field: { value }}) => (
              <>
                <div>
                  <Upload
                    onChange={handleUpload}
                    showUploadList={false}
                    accept='.png,.jpg,.jpeg'
                  >
                    {
                      value ? <img src={value} style={{width: '200px', cursor: 'pointer'}} alt='/' /> : <div className='mc-upload-box'>
                      <AiOutlinePlus />
                      <span>Đăng tải</span>
                    </div>
                    }
                  </Upload>
                </div>
                {errors.imgFile && <ErrorMessage message={errors.imgFile.message} />}
                {errors.imgUrl && <ErrorMessage message={errors.imgUrl.message} />}
              </>
              )}
            />
          </Form.Item>
          <Form.Item className='btn-box' >
            <Button type='default' htmlType='button' className='btn-cancel' size='large' onClick={closeModal}>
              Hủy bỏ
            </Button>
            <Button loading={isSubmitting} type='primary' htmlType='submit' className='btn-update' size='large'>{action === 'Create' ? 'Tạo mới' : 'Cập nhật'}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ManageCategory