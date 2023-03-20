import { Checkbox, Col, Modal, Row, Switch } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import LandingFooter from 'app/components/footer/LandingFooter'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import LandingHeader from 'app/components/header/LandingHeader'
import ModalTakeCareCreateTree from 'app/components/modal/takecare-create-tree/ModalTakeCareCreateTree'
import { UserTree } from 'app/models/user-tree'
import userTreeService from 'app/services/user-tree.service'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useState } from 'react'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import './style.scss'

// 1 là create - 2 là update - 3 là tạo service
interface ModalProps{
    openModal: number;
    tree?: UserTree
}

const ClientTakeCareService: React.FC = () => {

    const [modalState, setModalState] = useState<ModalProps>({openModal: 0})

    const [listTrees, setListTrees] = useState<UserTree[]>([])
    const [treesSelect, setTreesSelect] = useState<UserTree[]>([])

    useEffect(() =>{
        pagingPath.scrollTop()

        const init = async () =>{
            try{
                const res = await userTreeService.getListUserTree()
                console.log(res)
                setListTrees(res.data.userTrees)
            }catch{

            }
        }
        init()
    }, [])

    const handleCreateNewTree = () =>{
        setModalState({openModal: 1})
    }
    const handleCreateUpdateTree = (tree: UserTree, isCreate: boolean) =>{
        if(isCreate){
            setListTrees([tree, ...listTrees])
        }else{
            const index = listTrees.findIndex(x => x.id === tree.id)
            listTrees[index] = tree
            setListTrees(listTrees)
        }
        setModalState({openModal: 0, tree: undefined})
    }
    console.log({treesSelect})
    const handleSelectTree = (tree: UserTree) =>{
        const index = treesSelect.findIndex(x => x.id === tree.id)

        if(index < 0){
            setTreesSelect([tree, ...treesSelect])
        }else{
            treesSelect.splice(index, 1)
            setTreesSelect([...treesSelect])
        }
    }
    
    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper ts-wrapper">
                    <HeaderInfor title='Dịch vụ chăm sóc cây cảnh' />
                    <section className="ts-box default-layout">
                        <button className="ts-btn-create btn btn-create" onClick={handleCreateNewTree}>
                            <AiOutlinePlusSquare size={25} />
                            Tạo mới cây của bạn
                        </button>
                    </section>
                    <section className="default-layout ts-create-service">
                        <div>
                            <p>Bạn đã chọn ({treesSelect.length}) cây để chăm sóc</p>
                        </div>
                        <div>
                            <button> Tạo dịch vụ chăm sóc cây</button>
                        </div>
                    </section>
                    <section className="ts-infor default-layout">
                        {/* no product before */}
                        <div className="empty-tree">
                            <h1>Hiện tại bạn chưa có cây nào. Hãy tạo mới 1 cây</h1>
                            <button className='btn btn-create' onClick={handleCreateNewTree}>Tạo mới</button>
                        </div>
                        <div className="filtering">
                            <Checkbox>Hiển thị các cây đã chọn</Checkbox>
                        </div>
                        <Row gutter={[12, 12]}>
                            {
                                listTrees.map((item, index) => (
                                    <Col key={index} span={6}>
                                        <div className="item-detail">
                                            <img src="/assets/inventory-empty.png" alt="/" />
                                            <div className="item-infor">
                                                <h1>{item.treeName}</h1>
                                                <p className='quantity'>
                                                    Số lượng 
                                                    <span>{item.quantity}</span>
                                                </p>
                                                <p className='description'>
                                                    Mô tả 
                                                    <span>{item.description}</span>
                                                </p>
                                            </div>
                                            <div className="item-action">
                                                <div className="status">
                                                    <Switch checked={item.status === 'active'} />
                                                </div>
                                                <div className="detail">
                                                    <button onClick={() => setModalState({openModal: 2, tree: item})}>Detail</button>
                                                </div>
                                                <div className="check">
                                                    <Checkbox onChange={() => handleSelectTree(item)} checked={treesSelect.findIndex(x => x.id === item.id) > -1} >Chọn cây để chăm sóc</Checkbox>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            }
                        </Row>
                    </section>
                </div>
            </div>
            <LandingFooter />
            {
                (modalState.openModal === 1 || modalState.openModal === 2) && 
                <ModalTakeCareCreateTree 
                    tree={modalState.tree}
                    onClose={() => setModalState({openModal: 0, tree: undefined})}
                    onSubmit={handleCreateUpdateTree}
                />
            }
        </div>
    )
}

export default ClientTakeCareService