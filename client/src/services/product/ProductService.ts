import ApiService from '../ApiService';

class ProductService extends ApiService {
    async getAllProducts() {
        return this.get('products');
    }
} 

const productService = new ProductService();
export default productService;