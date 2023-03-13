import { Select, Tag } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { Size } from 'app/models/size';
import sizeService from 'app/services/size.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useEffect, useMemo, useState } from 'react'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai';
import './style.scss';

interface FilterBoxProps{
    sizeFilter: boolean
}

const FilterBox: React.FC<Partial<FilterBoxProps>> = ({sizeFilter}) => {
    const dispatch = useDispatch();

    const [size, setSizes] = useState<Size[]>([])
    const [sizeId, setSizeId] = useState('');

    useEffect(() =>{
        if(!sizeFilter) return;
        const init = async () =>{
            try{
                const res = await sizeService.getAllSize();
                setSizes(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [sizeFilter, dispatch])

    const DisplayButtonCondition = useMemo(() =>{
        if(sizeFilter){
            return true
        }
        return false
    }, [sizeFilter])

    const handleFilter = () =>{
        console.log(sizeId)
    }

    return (
        <div className='filter-wrapper'>
            {
                sizeFilter && 
                <div className="filter-item">
                    <Select 
                        suffixIcon={<AiFillCaretDown />}
                        placeholder="Chọn 1 kích thước cây"
                        style={{ width: 250 }}
                        optionLabelProp="label"
                        onChange={(value) => setSizeId(value)}
                    >
                        {
                            size.map((item, index) => (
                                <Select.Option key={index} value={item.id} label={item.sizeName} >
                                    <div className="size-option">
                                        <span style={{minWidth: '100px', display: 'inline-block'}}>{item.sizeName}</span>
                                        {
                                            item.sizeType ? <Tag color='#108ee9' >Duy nhất</Tag> : <Tag color='#87d068' >Số lượng lớn</Tag>
                                        }
                                    </div>
                                </Select.Option>
                            ))
                        }
                    </Select>
                </div>
            }
            {
                DisplayButtonCondition && 
                <div className="filter-btn">
                    <button className='btn btn-search' onClick={handleFilter}>
                        <AiOutlineSearch size={25} />
                        Tìm kiếm
                    </button>
                </div>
            }
        </div>
    )
}

export default FilterBox