import ApiService from '../ApiService';

class PaymentService extends ApiService {
    async checkout(data: { token: string; method: string; denomination: number[] }) {
        return this.post('payment/checkout', data);
    }
} 

const paymentService = new PaymentService();
export default paymentService;