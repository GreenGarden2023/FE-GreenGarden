import { Image, Select, Switch, Tag, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import ModalProduct from 'app/components/modal/product/ModalProduct';
import useDispatch from 'app/hooks/use-dispatch';
import { Category } from 'app/models/category';
import { Action, Status } from 'app/models/general-type';
import { Paging } from 'app/models/paging';
import { Product } from 'app/models/product';
import categoryService from 'app/services/category.service';
import productServcie from 'app/services/product.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import utilGeneral from 'app/utils/general';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect, useMemo, useState } from 'react';
import { AiFillCaretDown, AiFillEdit } from 'react-icons/ai';
import { IoCreateOutline } from 'react-icons/io5';
import { TbListDetails } from 'react-icons/tb';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './style.scss';

const { Option } = Select;
const ManageProduct: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryIdSelected, setCagoryIdSelected] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [paging, setPaging] = useState<Paging>();
  const [loading, setLoading] = useState(false);
  const [productSelected, setProductSelected] = useState<Product>();
  const [action, setAction] = useState<Action>('');
  const [loaderProId, setLoaderProId] = useState<string[]>([])
  
  useEffect(() =>{
    const init = async () =>{
      try{
        const res = await categoryService.getAllCategory()
        setCategories(res.data.result)
      }catch(err){
        dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
      }
    }
    init()
  }, [dispatch])

  useEffect(() =>{
    const currentCategory = searchParams.get('category');
    const currentPage = searchParams.get('page');

    if(!currentCategory || !currentPage || (categories.length !== 0 && categories.findIndex(x => x.id === currentCategory) < 0) || !pagingPath.isValidPaging(currentPage)) {
      setCagoryIdSelected('')
      setProducts([])
      return navigate(`/panel/manage-product`)
    };

    setCagoryIdSelected(currentCategory)

  }, [searchParams, categories, navigate])

  useEffect(() =>{
    const currentPage = searchParams.get('page')
    const currentCategory = searchParams.get('category')
    
    if(!currentPage || !currentCategory || categories.length === 0 || categories.findIndex(x => x.id === categoryIdSelected) < 0) return;
    const init = async () =>{
      setLoading(true)
      try{
        const res = await productServcie.getAllProduct({curPage: Number(currentPage), pageSize: CONSTANT.PAGING_ITEMS.PRODUCT}, categoryIdSelected)
        setProducts(res.data.result)
        setPaging(res.data.paging)
        // setCategories(res.data.result)
        console.log(res)
      }catch(err){
        dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
      }
      setLoading(false)
    }
    init()
  }, [categories, categoryIdSelected, searchParams, dispatch])
  
  const Column: ColumnsType<Product> = [
    {
      title: 'T??n lo???i s???n ph???m',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      // width: 200
    },
    {
      title: 'M?? t???',
      key: 'description',
      dataIndex: 'description',
      align: 'left',
      width: 600
    },
    {
      title: '???nh ?????i di???n',
      key: 'imgUrl',
      dataIndex: 'imgUrl',
      align: 'center',
      render: (_, record) => (
        <Image
          width={100}
          height={100}
          style={{maxHeight: '100px', objectFit: 'cover'}}
          src={record.imgUrl}
          onError={utilGeneral.setDefaultImage} 
        />
      ),
    },
    {
      title: 'Tr???ng th??i',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (_, record) => (
        <Switch loading={loaderProId.includes(record.id)} checked={record.status === 'active'} onChange={(checked: boolean) => handleToggleProduct(record, checked)} />
      ),
    },
    {
      title: 'Lo???i giao d???ch',
      key: 'type',
      dataIndex: 'type',
      align: 'center',
      render: (_, record) => (
        <>
          {
            record.isForSale && <Tag color='#108ee9' >B??n</Tag>
          }
          {
            record.isForRent && <Tag color='#87d068' >Thu??</Tag>
          }
        </>
      )
    },
    {
      title: 'C??ng c???',
      key: 'actions',
      dataIndex: 'actions',
      align: 'center',
      render: (_, record) => (
        <div className="btn-actions-wrapper">
          <Tooltip title='Chi ti???t' color='#108ee9'>
            <TbListDetails className='btn-icon'onClick={() => navigate(`/panel/manage-product-item/${record.id}?page=1`)} />
          </Tooltip>
          <Tooltip title='Ch???nh s???a' color='#108ee9'>
            <AiFillEdit className='btn-icon'  onClick={() => {
              setProductSelected(record)
              setAction('Update')
            }} />
          </Tooltip>
        </div>
      )
    },
  ]
  const DataSource = useMemo(() =>{
    return products.map((product, index) => ({
      key: String(index + 1),
      ...product
    }))
  }, [products])

  const handleChangeSelectCategory = (value: any) =>{
    navigate(`/panel/manage-product?category=${value}&page=1`)
  }
  const handleToggleProduct = async (product: Product, checked: boolean) =>{
    setLoaderProId([...loaderProId, product.id])
    try{
      const statusHandle: Status = checked ? 'active' : 'disable'
      await productServcie.toggleProduct(product, statusHandle)
      setProducts(products.map(x => x.id === product.id ? {
        ...x,
        status: statusHandle
      } : x))
      dispatch(setNoti({type: 'success', message: `C???p nh???t tr???ng th??i "${product.name}" th??nh c??ng`}))
    }catch(err){
      dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
    }
    setLoaderProId(loaderProId.filter(x => x !== product.id))
  }

  const handleCreateProduct = () =>{
    if(!categoryIdSelected){
      dispatch(setNoti({type: 'warning', message: 'Ch???n 1 th??? lo???i c??y tr?????c khi t???o m???i m???t lo???i c??y'}))
      return;
    }
    setProductSelected(undefined)
    setAction('Create')
  }
  const handleSubmitProduct = (product: Product, action: Action) => {
    if(action === 'Create'){
      if(products.length === CONSTANT.PAGING_ITEMS.PRODUCT){
        products.pop()
        setProducts([...products, product])
      }else{
        setProducts([...products, product])
      }
    }else{
      setProducts(products.map(p => p.id === product.id ? {
        ...product
      } : p))
    }
  }
  return (
    <div className="mp-wrapper">
      <section className="mp-infor default-layout">
        <h1>Qu???n l?? lo???i c??y</h1>
      </section>
      <section className="mp-search-wrapper default-layout">
        <Select
          placeholder="Ch???n 1 th??? lo???i c??y"
          dropdownMatchSelectWidth
          style={{ width: 250 }}
          optionLabelProp="label"
          suffixIcon={<AiFillCaretDown />}
          onChange={handleChangeSelectCategory}
          value={categoryIdSelected || undefined}
        >
          {
            categories.map((category, index) => (
              <Option key={index} value={category.id} label={category.name} >
                <Tooltip title={category.name} placement='right' color='#108ee9' >
                  <div className="mp-option">
                    <img src={category.imgUrl} alt="/"/>
                    <span>{category.name}</span>
                  </div>
                </Tooltip>
              </Option>
            ))
          }
        </Select>
        <div className="mp-btn-wrapper">
          <button onClick={handleCreateProduct} className='btn-create'>
            <IoCreateOutline size={20} />
            T???o m???i 1 lo???i c??y
          </button>
        </div>
      </section>
      <section className="mp-content-wrapper default-layout">
        {
          !searchParams.get('category') ?
          <h1>Ch???n 1 th??? lo???i c??y</h1> :
          <Table loading={loading} className='mc-table' dataSource={DataSource} columns={Column} pagination={{
            pageSize: paging?.pageSize || 1,
            current: paging?.curPage || 1,
            total: paging?.recordCount || 1,
            onChange: (page: number) =>{
              navigate(`/panel/manage-product?category=${categoryIdSelected}&page=${page}`)
            }
          }} />
        }
      </section>
      <ModalProduct 
        action={action} 
        open={action !== ''} 
        product={productSelected} 
        categoryId={categoryIdSelected}
        onClose={() => {
          setAction('')
          setProductSelected(undefined)
        }}
        onSubmit={handleSubmitProduct}
      />
    </div>
  )
}

export default ManageProduct