export interface CreateServiceCalendar{
    calendarInitial?: CalendarInitial
    calendarUpdate?: CalendarUpdate
}

export interface CalendarInitial {
    serviceOrderId: string
    serviceDate: Date
}
  
export interface CalendarUpdate {
    serviceCalendarId: string
    nextServiceDate: Date
    reportFileURL: string
    sumary: string
}

export interface ServiceCalendar {
    id: string
    serviceOrderId: string
    serviceDate: Date
    nextServiceDate: Date
    reportFileURL: string
    sumary: string
    status: string
}