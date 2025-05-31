import ApiService from '../ApiService';

class BookingService extends ApiService {
    async booking(data: { productIds: number[] }) {
        return this.post('booking', data);
    }

     async bookingDetails(data: { token: string }) {
        return this.post('booking/detail', data);
    }
} 

const bookingService = new BookingService();
export default bookingService;