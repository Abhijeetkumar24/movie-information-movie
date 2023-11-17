import { ExceptionMessage, HttpStatusCode, HttpStatusMessage } from '../interface/enum';
import { HttpResponse } from '../interface/global.interface';

class ResponseUtils{
    successResponse(
        data: any,
        message: string = HttpStatusMessage.OK,
        status: string = HttpStatusMessage.OK,
    ): HttpResponse {
        const response : HttpResponse = {
            code: this.getStatusCode(<keyof typeof HttpStatusCode> status),
            status: status,
            message: message,
            timestamp: new Date().getTime(),
            data: data,
            error: null,
        };
        return response;
    }


    errorResponse(
        error: any,
        message: ExceptionMessage = ExceptionMessage.SOMETHING_WENT_WRONG,
        status : HttpStatusMessage = HttpStatusMessage.BAD_REQUEST
    ): HttpResponse {
        const response: HttpResponse = {
            code: error?.code || this.getStatusCode(<keyof typeof HttpStatusCode> status),
            status: error?.status || status,
            message: error?.message || message,
            timestamp: new Date().getTime(),
            data: null,
            error: error?.data || error
        };

        return response;
    }

    private getStatusCode(status: keyof typeof HttpStatusCode): number {
        return HttpStatusCode[status] || HttpStatusCode.BAD_GATEWAY
    }

}

export const responseUtils = new ResponseUtils();