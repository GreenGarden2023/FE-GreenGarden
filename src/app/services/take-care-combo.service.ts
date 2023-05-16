import { Package, PackageHandle } from "app/models/package"
import { Response } from "app/models/response"
import golbalAxios from "app/utils/http-client"


const getAllTakeCareCombo = async (status: TStatus) =>{
    const res = await golbalAxios.get<Response<Package[]>>(`/takecare-combo/get-all-takecare-combo?status=${status}`)
    return res.data
}
const getATakeCareCombo = async (takecareComboID: string) =>{
    const res = await golbalAxios.get<Response<Package>>(`/takecare-combo/get-a-takecare-combo?takecareComboID=${takecareComboID}`)
    return res.data
}
const createTakeCareCombo = async (body: PackageHandle) =>{
    const res = await golbalAxios.post<Response<Package>>(`/takecare-combo/create-takecare-combo`, body, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    })
    return res.data
}
const updateTakeCareCombo = async (body: PackageHandle) =>{
    const res = await golbalAxios.post<Response<Package>>(`/takecare-combo/update-takecare-combo`, body, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    })
    return res.data
}

const takeCareComboService = {
    getAllTakeCareCombo,
    getATakeCareCombo,
    createTakeCareCombo,
    updateTakeCareCombo
}

export default takeCareComboService

type TStatus = 'active' | 'disabled' | 'all'