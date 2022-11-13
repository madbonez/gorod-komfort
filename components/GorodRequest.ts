export interface GorodRequest {
    requestNumber: string,

    publishDateText: string,
    publishDate: Date,
    publisherName: string,

    // finalStatus: string,

    header: string;
    description: string;
    photoUrls: string[],

    // Тип проблемы
    // Проблема
    // Подъезд №
    // Местонахождение проблемы
    // Этаж
    // Помещение, в котором обнаружена проблема
    // Помещение
    // Местоположение
    // Элемент
    labels: {[key: string]: string}[]

    responses: {
        publishDateText: string,
        publishDate: string,
        isOverdue: boolean,
        overdueText: string,

        status: string,
        statusDateText: string,
        statusDate: Date,

        userName: string,
        text: string,
        photoUrls: string[],
    }[]

}
