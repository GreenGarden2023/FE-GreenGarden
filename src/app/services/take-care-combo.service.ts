import { TServicePkgStatus, TStatusPkg } from "app/models/general-type"
import { Package, PackageHandle, PackageService, PackageServiceAssignHandle, PackageServiceHandle, PackageServiceStatusHandle } from "app/models/package"
import { Response } from "app/models/response"
import golbalAxios from "app/utils/http-client"
import queryString from "query-string"

const getAllTakeCareCombo = async (status: TStatusPkg) =>{
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
// -----------------------------
const createTakeCareComboService = async (body: PackageServiceHandle) =>{
    const res = await golbalAxios.post<Response<PackageService>>('/takecare-combo-service/create-takecare-combo-service', body)
    return res.data
}
const getATakeCareComboService = async (takecareComboServiceID: string) =>{
    const res = await golbalAxios.get<Response<PackageService>>(`/takecare-combo-service/get-a-takecare-combo-service?takecareComboServiceID=${takecareComboServiceID}`)
    return res.data
}
const getTakeCareComboServiceByCode = async (code: string) =>{
    const res = await golbalAxios.get<Response<PackageService>>(`/takecare-combo-service/get-takecare-combo-service-by-code?code=${code}`)
    return res.data
}
const getAllTakeCareComboService = async (status: TServicePkgStatus) =>{
    const res = await golbalAxios.get<Response<PackageService[]>>(`/takecare-combo-service/get-all-takecare-combo-service?status=${status}`)
    return res.data
}
const getAllTakeCareComboServiceByTech = async (status: TServicePkgStatus, technicianId: string) =>{
    const params = { status, technicianId }
    const res = await golbalAxios.get<Response<PackageService[]>>(`/takecare-combo-service/get-all-takecare-combo-service-by-tech?${queryString.stringify(params)}`)
    return res.data
}
const changeTakeCareComboServiceStatus = async (body: PackageServiceStatusHandle) =>{
    const res = await golbalAxios.post<Response<PackageService>>('/takecare-combo-service/change-takecare-combo-service-status', body)
    return res.data
}
const assignTakeCareComboServiceTechnician = async (body: PackageServiceAssignHandle) =>{
    const res = await golbalAxios.post<Response<PackageService>>('/takecare-combo-service/assign-takecare-combo-service-technician', body)
    return res.data
}
const updateTakeCareComboService = async (body: PackageServiceHandle) =>{
    const res = await golbalAxios.post<Response<PackageService>>('/takecare-combo-service/update-takecare-combo-service', body)
    return res.data
}
const cancelTakeCareComboService = async (takecareComboServiceId: string, cancelReason: string) =>{
    const res = await golbalAxios.post<Response<PackageService>>('/takecare-combo-service/cancel-takecare-combo-service', {takecareComboServiceId, cancelReason})
    return res.data
}
const rejectTakeCareComboService = async (takecareComboServiceId: string, rejectReason: string) =>{
    const res = await golbalAxios.post<Response<PackageService>>('/takecare-combo-service/reject-takecare-combo-service', {takecareComboServiceId, rejectReason})
    return res.data
}

const takeCareComboService = {
    getAllTakeCareCombo,
    getATakeCareCombo,
    createTakeCareCombo,
    updateTakeCareCombo,
    // -----
    createTakeCareComboService,
    getATakeCareComboService,
    getTakeCareComboServiceByCode,
    getAllTakeCareComboServiceByTech,
    getAllTakeCareComboService,
    changeTakeCareComboServiceStatus,
    assignTakeCareComboServiceTechnician,
    updateTakeCareComboService,
    cancelTakeCareComboService,
    rejectTakeCareComboService
}

export default takeCareComboService
