import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import LandingHeader from '../../components/header/LandingHeader';
// import { Breadcrumb, Badge } from 'antd';
// import { AiOutlineHome } from 'react-icons/ai';
// import { SiGumtree } from 'react-icons/si';
import './style.scss'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button, Switch ,Form, Input, DatePicker, DatePickerProps } from 'antd';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import useDispatch from '../../hooks/use-dispatch';
import { setTitle } from '../../slices/window-title';
import { setNoti } from '../../slices/notification';

interface ProductT{
    first: string;
    last: string;
}

interface ProductType{
    name: string;
    isTree: boolean;
    types: ProductT[];
    time: string;
}

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    types: yup.array().of(
        yup.object().shape({
            first: yup.string().required('First is required'),
            last: yup.string().required('Last is required'),
        })
    ),
    time: yup.string().required('Time is required')
})

const Product: React.FC = () =>{
    const { slug } = useParams();
    
    const dispatch = useDispatch();

    const { handleSubmit, control, formState: { errors, isSubmitted }, setValue, trigger } = useForm<ProductType>({
        defaultValues: {
            name: '',
            isTree: true,
            types: [
                {
                    first: '1',
                    last: '2'
                },
                {
                    first: '3',
                    last: '4'
                }
            ],
            time: '01/01/2015'
        },
        resolver: yupResolver(schema)
    })
    const { fields, append } = useFieldArray(
        {
            control,
            name: 'types'
        }
    )

    useEffect(() =>{
        if(!slug) return;
        dispatch(setTitle(slug || ''))
    }, [dispatch, slug])

    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
    const handleSubmitForm = (data: ProductType) =>{
        console.log(data)
    }
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log({date, dateString});
        setValue('time', dateString)
        if(isSubmitted){
            trigger('time')
        }
      };
    return (
        <Form onFinish={handleSubmit(handleSubmitForm)}>
            <p>asds</p>
            <Form.Item
                label="Name"
            >
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => <Input {...field} />}
                />
                {errors.name && <span>{errors.name.message}</span>}
            </Form.Item>
            <Form.Item
                label="Tree"
            >
                <Controller
                    control={control}
                    name="isTree"
                    render={({ field: { value, onChange } }) => (
                        <Switch
                          
                          checked={value}
                          onChange={(checked) => {
                            onChange(checked);
                          }}
                        />
                      )}
                />
            </Form.Item>
            {
                fields.map((item, index) => (
                    <Form.Item
                        label={`Type ${index + 1}`}
                        key={index}
                    >
                        <Form.Item
                            label={`Label first ${index + 1}`}
                            style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                            validateStatus={errors.types?.[index]?.first ? 'error' : ''}
                        >
                            <Controller
                                control={control}
                                name={`types.${index}.first`}
                                render={({ field }) => <Input {...field} />}
                            />
                            {errors.types?.[index]?.first && <span>{errors.types?.[index]?.first?.message}</span>}
                        </Form.Item>
                        <Form.Item
                            label={`Label last ${index + 1}`}
                            style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                        >
                            <Controller
                                control={control}
                                name={`types.${index}.last`}
                                render={({ field }) => <Input {...field} />}
                            />
                            {errors.types?.[index]?.last && <span>{errors.types?.[index]?.last?.message}</span>}
                        </Form.Item>
                    </Form.Item>
                ))
            }
            <Form.Item label='Time'>
                <Controller
                    control={control}
                    name='time'
                    render={({field}) => <DatePicker 
                                            defaultValue={dayjs(field.value, 'DD/MM/YYYY')} 
                                            format={dateFormatList} onChange={onChange} 
                                        />}
                />
                {errors.time && <span>{errors.time.message}</span>}
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button  htmlType='button' onClick={() => {
                    append({
                        first: '',
                        last: ''
                    })
                    dispatch(setNoti({
                        type: 'info',
                        message: 'Ngon',
                        description: 'Không ngon'
                    }))
                }}>
                    Add
                </Button>
                <Button type="primary" htmlType="submit" loading disabled>
                    Submit
                </Button>
            </Form.Item>
        </Form>
        // <div>
        //     <LandingHeader />
        //     <div className="product-content">
        //         <Breadcrumb>
        //             <Breadcrumb.Item href="/">
        //                 <AiOutlineHome />
        //                 <span>Trang chủ</span>
        //             </Breadcrumb.Item>
        //             <Breadcrumb.Item href=''>
        //                 <SiGumtree />
        //                 <span>{slug}</span>
        //             </Breadcrumb.Item>
        //         </Breadcrumb>
        //         <p className="title">
        //            {slug} 
        //         </p>
        //         <p className="product-header">
        //             Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore illum aut repellendus earum, similique minus quidem voluptate exercitationem veniam nam eius amet est corporis ex incidunt fugit nobis? Totam, unde. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae quos perspiciatis doloribus magni fugiat error laboriosam saepe. Soluta dignissimos, harum saepe, iste deserunt excepturi ducimus debitis, velit hic optio necessitatibus.
        //         </p>
        //         <div className="--items">
        //             <div className="product-detail">
        //                 <Badge.Ribbon  text={`-5%`} color="green">
        //                     <img src={`${process.env.PUBLIC_URL}/product_1.jpg`} alt="" />
        //                     <p className='name'>Cây Nhất Mạt Hương</p>
        //                     <div className="transaction-type">
                                
        //                     </div>
        //                 </Badge.Ribbon>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
}

export default Product;