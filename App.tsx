
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Input from './components/Input';
import TextArea from './components/TextArea';
import RadioGroup from './components/RadioGroup';
import { 
  CheckCircleIcon, 
  LoadingSpinnerIcon, 
  ExclamationTriangleIcon, 
  ClipboardIcon, 
  ClipboardCheckIcon, 
  ShoppingBagIcon,
  TrashIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon
} from './components/Icons';

// =============================================================================
// DANH SÁCH SẢN PHẨM - Vui lòng cập nhật sản phẩm của bạn tại đây
// =============================================================================
interface ProductVariant {
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  image: string;
  category: 'tre' | 'lục bình' | 'gỗ';
  variants: ProductVariant[];
}

const PRODUCTS: Product[] = [
  // Tre
  { id: 'tre-coc', name: 'Cốc tre', category: 'tre', image: 'https://i.postimg.cc/6pTM71hX/coctre.jpg', variants: [{ name: '200ml', price: 70000 }, { name: '500ml', price: 120000 }] },
  { id: 'tre-onghut', name: 'Ống hút tre', category: 'tre', image: 'https://i.postimg.cc/ZncwNGgT/ong-hut-tre-sp.jpg', variants: [{ name: 'Tiêu chuẩn', price: 3000 }] },
  { id: 'tre-den-tochim', name: 'Chụp đèn trang trí hình tổ chim', category: 'tre', image: 'https://i.postimg.cc/pXWGvdhy/chaoden3.jpg', variants: [{ name: 'Nhỏ', price: 90000 }, { name: 'Lớn', price: 120000 }] },
  { id: 'tre-dua', name: 'Bộ 10 đôi đũa tre', category: 'tre', image: 'https://i.postimg.cc/Mp4d1bsj/duatre1.jpg', variants: [{ name: 'Đũa trơn', price: 37000 }, { name: 'Đũa tiện', price: 65000 }, { name: 'Đũa xoắn', price: 65000 }] },
  { id: 'tre-ban', name: 'Bàn Tráng Miệng Bằng Tre', category: 'tre', image: 'https://i.postimg.cc/sDTngR7m/ban-trang-mieng.png', variants: [{ name: 'Nhỏ', price: 350000 }, { name: 'Lớn', price: 450000 }] },
  { id: 'tre-denlong', name: 'Đèn lồng tre đan thủ công', category: 'tre', image: 'https://i.postimg.cc/G3J76DpZ/den-lonng.jpg', variants: [{ name: 'Nhỏ', price: 520000 }, { name: 'Lớn', price: 920000 }] },
  // Lục Bình
  { id: 'lb-don', name: 'Đôn lục bình', category: 'lục bình', image: 'https://i.postimg.cc/289PXWcC/don.jpg', variants: [{ name: 'Nhỏ', price: 200000 }, { name: 'Lớn', price: 400000 }] },
  { id: 'lb-tham', name: 'Thảm lục bình', category: 'lục bình', image: 'https://i.postimg.cc/bNw7TgR6/tham.jpg', variants: [{ name: 'Nhỏ', price: 200000 }, { name: 'Lớn', price: 500000 }] },
  { id: 'lb-lot', name: 'Tấm Lót Lục Bình', category: 'lục bình', image: 'https://i.postimg.cc/PfyGY91p/tamlot.jpg', variants: [{ name: 'Nhỏ', price: 120000 }, { name: 'Lớn', price: 150000 }] },
  { id: 'lb-gio-tron', name: 'Giỏ lục bình tròn', category: 'lục bình', image: 'https://i.postimg.cc/Vk32z8PT/giotron.jpg', variants: [{ name: 'Nhỏ', price: 150000 }, { name: 'Lớn', price: 500000 }] },
  { id: 'lb-gio-cn', name: 'Giỏ chữ nhật', category: 'lục bình', image: 'https://i.postimg.cc/P5LBGq9Y/giochunhat.jpg', variants: [{ name: 'Nhỏ', price: 120000 }, { name: 'Lớn', price: 500000 }] },
  { id: 'lb-chao-den', name: 'Chao đèn lục bình', category: 'lục bình', image: 'https://i.postimg.cc/D0Bth47d/chao-den-luc-binh.jpg', variants: [{ name: 'Nhỏ', price: 100000 }, { name: 'Lớn', price: 150000 }] },
  // Gỗ
  { id: 'go-lich', name: 'Lịch gỗ vạn niên', category: 'gỗ', image: 'https://i.postimg.cc/TwcVNrc0/lichgo.jpg', variants: [{ name: 'Nhỏ', price: 350000 }, { name: 'Lớn', price: 450000 }] },
  { id: 'go-but', name: 'Bút gỗ Walnut', category: 'gỗ', image: 'https://i.postimg.cc/SRNWBJTh/butgo.jpg', variants: [{ name: 'Bút bi', price: 250000 }, { name: 'Bút máy', price: 350000 }] },
  { id: 'go-so', name: 'Sổ tay bằng gỗ', category: 'gỗ', image: 'https://i.postimg.cc/xCQGPsLq/sogo.jpg', variants: [{ name: 'Loại 1', price: 230000 }, { name: 'Loại 2', price: 430000 }] },
  { id: 'go-dongho', name: 'Đồng hồ gỗ 3D Việt Nam', category: 'gỗ', image: 'https://i.postimg.cc/43VbVC7r/dongho.jpg', variants: [{ name: '34 tỉnh thành', price: 1000000 }] },
  { id: 'go-hopqua', name: 'Hộp quà gỗ', category: 'gỗ', image: 'https://i.postimg.cc/8zqm7k5R/hopquago.jpg', variants: [{ name: 'Nhỏ', price: 330000 }, { name: 'Lớn', price: 370000 }] },
  { id: 'go-tranh', name: 'Tranh gỗ xếp hình PUZZLE', category: 'gỗ', image: 'https://i.postimg.cc/4yLzssqh/tranhgo.jpg', variants: [{ name: 'Nhỏ', price: 330000 }, { name: 'Lớn', price: 370000 }] },
];
// =============================================================================
// THÔNG TIN CHUYỂN KHOẢN - Vui lòng điền thông tin của bạn vào đây
// =============================================================================
const BANK_CONFIG = {
  BANK_ID: 'VCB', 
  ACCOUNT_NO: '9911630540',
  ACCOUNT_NAME: 'TRUONG TAN THAI'
};
// =============================================================================

interface CartItem {
  productId: string;
  variantName: string;
  name: string; // Tên sản phẩm đầy đủ bao gồm cả variant
  price: number;
  quantity: number;
  image: string;
  cartItemId: string; // ID duy nhất cho mỗi mục trong giỏ hàng (productId + variantName)
}

interface OrderData {
  fullName: string;
  phoneNumber: string;
  address: string;
  notes: string;
  paymentMethod: 'cod' | 'bank_transfer' | '';
  orderMemo: string;
  cartItems: { name: string; quantity: number; }[]; // Đơn giản hóa cho Google Sheets
  totalAmount: number;
}

/*
  =============================================================================
  HƯỚNG DẪN TÍCH HỢP GOOGLE SHEETS (Đã cập nhật cho Giỏ hàng)
  =============================================================================
  1. Tạo một Google Sheet mới.
  2. Mở "Tiện ích mở rộng" > "Apps Script".
  3. Xóa mã cũ và dán mã mới sau đây:

    function doPost(e) {
      try {
        var sheetName = "Đơn hàng";
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName); 
        
        if (!sheet) {
          sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
          // Thêm hàng tiêu đề mới
          sheet.appendRow(["Thời gian", "Họ và tên", "Số điện thoại", "Địa chỉ", "Ghi chú", "Phương thức TT", "Mã Đơn Hàng", "Chi tiết Đơn hàng", "Tổng tiền"]);
        }
        
        var data = JSON.parse(e.postData.contents);
        
        // Định dạng các mặt hàng trong giỏ hàng để ghi vào sheet
        var cartItemsString = data.cartItems.map(function(item) {
          return item.name + " (x" + item.quantity + ")";
        }).join(", ");

        sheet.appendRow([
          new Date(),
          data.fullName,
          data.phoneNumber,
          data.address,
          data.notes,
          data.paymentMethod === 'cod' ? 'Khi nhận hàng' : 'Chuyển khoản',
          data.orderMemo,
          cartItemsString, // Dữ liệu giỏ hàng
          data.totalAmount  // Tổng tiền
        ]);
        
        return ContentService
          .createTextOutput(JSON.stringify({ status: "success", message: "Đã thêm đơn hàng." }))
          .setMimeType(ContentService.MimeType.JSON);
      } catch (error) {
        return ContentService
          .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

  4. Lưu, "Triển khai" > "Lần triển khai mới", chọn "Ứng dụng web", quyền truy cập "Bất kỳ ai".
  5. Sao chép URL ứng dụng web và dán vào hằng số APPS_SCRIPT_URL bên dưới.
  =============================================================================
*/
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrSGSP0WdNZAbBk1hqNYAL4ILC4Qa3LYRYCbehb9dH7sgPYgFwOkj0C6tdwww_byeu/exec';

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const PriceDisplay: React.FC<{ variants: ProductVariant[] }> = ({ variants }) => {
  if (!variants || variants.length === 0) return null;

  if (variants.length === 1) {
    return <p className="text-[#8BC34A] font-bold mt-1 mb-3">{formatPrice(variants[0].price)}</p>;
  }

  const prices = variants.map(v => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return <p className="text-[#8BC34A] font-bold mt-1 mb-3">{`${new Intl.NumberFormat('vi-VN').format(minPrice)} - ${new Intl.NumberFormat('vi-VN').format(maxPrice)}`}</p>;
};

const VariantSelectionModal: React.FC<{ product: Product; onClose: () => void; onAddToCart: (product: Product, variant: ProductVariant) => void;}> = ({ product, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    setSelectedVariant(null);
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVariant) {
      onAddToCart(product, selectedVariant);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Chọn loại sản phẩm</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <img src={product.image} alt={product.name} className="h-20 w-20 rounded-md object-cover flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
              </div>
            </div>
            <fieldset className="space-y-4">
              <legend className="text-base font-medium text-gray-800 mb-3">Loại sản phẩm của quý khách là</legend>
              {product.variants.map(variant => (
                <div key={variant.name}>
                  <input
                    type="radio"
                    id={`variant-${product.id}-${variant.name}`}
                    name={`variant-${product.id}`}
                    value={variant.name}
                    onChange={() => setSelectedVariant(variant)}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={`variant-${product.id}-${variant.name}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-[#8BC34A] peer-checked:ring-1 peer-checked:ring-[#8BC34A] peer-checked:bg-[#F1F8E9] transition-colors duration-200"
                  >
                    <span className="text-base font-medium text-gray-800">{variant.name}</span>
                    <span className="text-base font-bold text-[#689F38]">{formatPrice(variant.price)}</span>
                  </label>
                </div>
              ))}
            </fieldset>
          </div>
          <div className="p-4 bg-gray-50 border-t rounded-b-xl">
            <button
              type="submit"
              disabled={!selectedVariant}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#8BC34A] hover:bg-[#689F38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC34A] disabled:bg-[#C5E1A5] disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<'products' | 'checkout'>('products');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Omit<OrderData, 'cartItems' | 'totalAmount'>>({
    fullName: '', phoneNumber: '', address: '', notes: '', paymentMethod: '', orderMemo: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memoCopied, setMemoCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const cartTotalAmount = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartTotalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const handleAddToCart = (product: Product, variant: ProductVariant) => {
    const cartItemId = `${product.id}-${variant.name}`;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          productId: product.id,
          variantName: variant.name,
          name: product.variants.length > 1 ? `${product.name} - ${variant.name}` : product.name,
          price: variant.price,
          quantity: 1,
          image: product.image,
          cartItemId: cartItemId
        }
      ];
    });
    setIsCartOpen(true);
    setVariantModalProduct(null);
  };

  const handleProductClick = (product: Product) => {
    if (product.variants.length === 1) {
      handleAddToCart(product, product.variants[0]);
    } else {
      setVariantModalProduct(product);
    }
  };

  const handleUpdateQuantity = (cartItemId: string, change: number) => {
    setCart(prevCart => {
      const itemToUpdate = prevCart.find(item => item.cartItemId === cartItemId);
      if (itemToUpdate && itemToUpdate.quantity + change <= 0) {
        return prevCart.filter(item => item.cartItemId !== cartItemId);
      }
      return prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + change } : item
      );
    });
  };
  
  const handleRemoveFromCart = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };
  
  const handleGoToCheckout = () => {
    if (cart.length === 0) return;
    const orderMemo = `DH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setFormData(prev => ({...prev, orderMemo}));
    setCurrentView('checkout');
    setIsCartOpen(false);
  };

  const qrCodeUrl = useMemo(() => {
    if (formData.paymentMethod !== 'bank_transfer' || !BANK_CONFIG.BANK_ID || !BANK_CONFIG.ACCOUNT_NO) {
      return '';
    }
    const memo = formData.orderMemo.replace(/ /g, '%20');
    return `https://img.vietqr.io/image/${BANK_CONFIG.BANK_ID}-${BANK_CONFIG.ACCOUNT_NO}-compact2.png?amount=${cartTotalAmount}&addInfo=${memo}&accountName=${BANK_CONFIG.ACCOUNT_NAME.replace(/ /g, '%20')}`;
  }, [formData.paymentMethod, formData.orderMemo, cartTotalAmount]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePaymentChange = useCallback((value: 'cod' | 'bank_transfer') => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
    setPaymentConfirmed(false);
  }, []);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMemoCopied(true);
    setTimeout(() => setMemoCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.paymentMethod) {
        setError("Vui lòng chọn phương thức thanh toán.");
        return;
    }
    setIsLoading(true);
    setError(null);
    
    const finalOrderData: OrderData = { 
        ...formData, 
        cartItems: cart.map(item => ({ name: item.name, quantity: item.quantity })), 
        totalAmount: cartTotalAmount 
    };

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST', mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8', },
            body: JSON.stringify(finalOrderData),
        });
        
        const textResponse = await response.text();
        let result;
        try {
          result = JSON.parse(textResponse);
        } catch (e) {
          throw new Error(`Phản hồi từ máy chủ không hợp lệ: ${textResponse}`);
        }

        if (!response.ok || result.status !== 'success') {
            throw new Error(result.message || 'Có lỗi xảy ra phía máy chủ.');
        }
        
        setSubmittedOrder(finalOrderData);
        setIsSubmitted(true);
    } catch (err) {
        console.error('Lỗi khi gửi đến Google Sheets:', err);
        setError('Không thể gửi biểu mẫu. Vui lòng kiểm tra lại URL của Apps Script và đảm bảo bạn đã triển khai phiên bản mới nhất.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleNewOrder = () => {
    setCart([]);
    setCurrentView('products');
    setFormData({ fullName: '', phoneNumber: '', address: '', notes: '', paymentMethod: '', orderMemo: '' });
    setPaymentConfirmed(false);
    setIsSubmitted(false);
    setSubmittedOrder(null);
    setError(null);
  };
  
  const renderProductGroup = (categoryName: string, categoryKey: Product['category']) => {
    const products = PRODUCTS.filter(p => p.category === categoryKey);
    if (products.length === 0) return null;

    return (
      <div key={categoryKey}>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-20 after:bg-[#8BC34A]">
          {categoryName}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group flex flex-col">
              <div className="relative">
                <img src={product.image} alt={product.name} className="h-40 w-full object-cover"/>
              </div>
              <div className="p-4 flex flex-col flex-grow text-center">
                <h3 className="text-base font-semibold text-gray-800 truncate flex-grow">{product.name}</h3>
                <PriceDisplay variants={product.variants} />
                <button 
                  onClick={() => handleProductClick(product)}
                  className="w-full mt-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8BC34A] hover:bg-[#689F38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC34A] transition duration-150 ease-in-out"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


  if (isSubmitted && submittedOrder) {
    const isBankTransfer = submittedOrder.paymentMethod === 'bank_transfer';
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isBankTransfer ? 'Đã ghi nhận đơn hàng!' : 'Đặt hàng thành công!'}
          </h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn! Mã đơn hàng của bạn là <strong className="font-mono bg-slate-100 p-1 rounded">{submittedOrder.orderMemo}</strong>. Chúng tôi sẽ xử lý sớm nhất.
          </p>
          
          {isBankTransfer && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md text-left mb-6">
              <h3 className="font-bold text-amber-800">Thông tin quan trọng</h3>
              <p className="text-sm text-amber-700 mt-1">
                Vui lòng kiểm tra lại để chắc chắn rằng bạn đã chuyển khoản thành công với nội dung: <strong className="font-mono bg-amber-100 p-1 rounded">{submittedOrder.orderMemo}</strong>.
              </p>
               <p className="text-sm text-amber-700 mt-2">
                Đơn hàng sẽ được xử lý ngay sau khi chúng tôi xác nhận đã nhận được thanh toán.
              </p>
            </div>
          )}

          <button
            onClick={handleNewOrder}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#8BC34A] hover:bg-[#689F38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC34A] transition duration-150 ease-in-out"
          >
            Tạo đơn hàng mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen">
       {variantModalProduct && (
        <VariantSelectionModal
          product={variantModalProduct}
          onClose={() => setVariantModalProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <img src="https://i.postimg.cc/jjfCZPb1/econova-logo-2.png" alt="Econova Logo" className="h-16 w-auto" />
            <div className="relative">
              <button onClick={() => setIsCartOpen(true)} className="p-2 rounded-full text-gray-500 hover:text-[#689F38] hover:bg-[#F1F8E9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC34A]">
                <ShoppingBagIcon className="h-7 w-7" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8BC34A] text-xs font-medium text-white">
                    {cartTotalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {currentView === 'products' ? (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Sản phẩm</h1>
              <p className="text-gray-500 mb-8">Chọn sản phẩm bạn yêu thích và thêm vào giỏ hàng.</p>
              <div className="space-y-12">
                {renderProductGroup('Sản phẩm Tre', 'tre')}
                {renderProductGroup('Sản phẩm Lục Bình', 'lục bình')}
                {renderProductGroup('Sản phẩm Gỗ', 'gỗ')}
              </div>
            </div>
        ) : (
          // Checkout View
          <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-8 sm:px-8">
              <button onClick={() => setCurrentView('products')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#689F38] font-medium mb-4">
                <ArrowLeftIcon className="h-4 w-4"/>
                Quay lại
              </button>
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Thông tin Thanh toán</h1>
              <p className="text-center text-gray-500 mb-8">Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng.</p>
              
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                  <p className="font-bold">Không thể gửi</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="mb-6 bg-slate-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Tóm tắt đơn hàng</h3>
                {cart.map(item => (
                  <div key={item.cartItemId} className="flex justify-between items-center text-sm text-gray-600 py-1">
                    <span>{item.name} <span className="text-xs">x{item.quantity}</span></span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-base font-bold text-gray-900 mt-2 pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(cartTotalAmount)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input id="fullName" label="Họ và tên" value={formData.fullName} onChange={handleChange} required />
                <Input id="phoneNumber" label="Số điện thoại" type="tel" value={formData.phoneNumber} onChange={handleChange} required pattern="0[0-9]{9}" title="Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0."/>
                <Input id="address" label="Địa chỉ nhận hàng" value={formData.address} onChange={handleChange} required/>
                
                <RadioGroup label="Phương thức thanh toán" name="paymentMethod" required options={[{ label: 'Thanh toán khi nhận hàng (COD)', value: 'cod' },{ label: 'Chuyển khoản ngân hàng', value: 'bank_transfer' },]} value={formData.paymentMethod} onChange={handlePaymentChange} />

                {formData.paymentMethod === 'bank_transfer' && (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                      <h3 className="font-bold text-center text-gray-800">Thông tin chuyển khoản</h3>
                      {qrCodeUrl ? (
                        <div className="flex flex-col items-center">
                            <img src={qrCodeUrl} alt="Mã QR thanh toán" className="w-48 h-48 rounded-md shadow-md"/>
                            <p className="text-xs text-gray-500 mt-2">Quét mã để thanh toán qua ứng dụng ngân hàng.</p>
                        </div>
                      ) : <p className="text-center text-sm text-red-600">Vui lòng điền thông tin ngân hàng để tạo mã QR.</p>}
                      <div className="text-sm space-y-2">
                        <p><strong>Ngân hàng:</strong> {BANK_CONFIG.BANK_ID}</p>
                        <p><strong>Số tài khoản:</strong> {BANK_CONFIG.ACCOUNT_NO}</p>
                        <p><strong>Chủ tài khoản:</strong> {BANK_CONFIG.ACCOUNT_NAME}</p>
                        <p><strong>Số tiền:</strong> <strong className="text-[#8BC34A]">{formatPrice(cartTotalAmount)}</strong></p>
                        <div className="flex items-center gap-2 pt-1">
                          <strong className="flex-shrink-0">Nội dung:</strong>
                          <div className="relative w-full">
                            <input type="text" readOnly value={formData.orderMemo} className="w-full bg-slate-200 text-slate-800 font-mono text-xs p-2 pr-10 rounded-md border border-slate-300"/>
                            <button type="button" onClick={() => handleCopyToClipboard(formData.orderMemo)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                              {memoCopied ? <ClipboardCheckIcon className="h-5 w-5 text-green-600" /> : <ClipboardIcon className="h-5 w-5 text-gray-500" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="!mt-5 pt-4 border-t border-slate-300">
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center"><input id="payment-confirmation" name="payment-confirmation" type="checkbox" checked={paymentConfirmed} onChange={(e) => setPaymentConfirmed(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#8BC34A] focus:ring-[#8BC34A]"/></div>
                          <div className="ml-3 text-sm"><label htmlFor="payment-confirmation" className="font-medium text-gray-800">Tôi xác nhận đã chuyển khoản</label><p className="text-gray-500">Vui lòng chỉ đánh dấu khi bạn đã hoàn tất thanh toán.</p></div>
                        </div>
                      </div>
                  </div>
                )}

                <TextArea id="notes" label="Ghi chú (tùy chọn)" value={formData.notes} onChange={handleChange} rows={3} />
                <div>
                  <button type="submit" disabled={isLoading || (formData.paymentMethod === 'bank_transfer' && !paymentConfirmed)} className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#8BC34A] hover:bg-[#689F38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC34A] disabled:bg-[#C5E1A5] disabled:cursor-not-allowed transition duration-150 ease-in-out">
                    {isLoading ? <><LoadingSpinnerIcon className="w-5 h-5 mr-3" />Đang gửi...</> : 'Hoàn tất Đơn Hàng'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Cart Modal */}
      <div className={`fixed inset-0 z-30 transition-opacity ${isCartOpen ? 'bg-black/60' : 'pointer-events-none bg-black/0'}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Giỏ hàng của bạn</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-500 hover:text-gray-800"><XMarkIcon className="h-6 w-6" /></button>
            </div>

            {cart.length > 0 ? (
              <div className="flex-grow overflow-y-auto p-4">
                <ul className="space-y-4">
                  {cart.map(item => (
                    <li key={item.cartItemId} className="flex items-start gap-4">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover"/>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => handleUpdateQuantity(item.cartItemId, -1)} className="p-1 border rounded-md"><MinusIcon className="h-4 w-4"/></button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.cartItemId, 1)} className="p-1 border rounded-md"><PlusIcon className="h-4 w-4"/></button>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveFromCart(item.cartItemId)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                  <ShoppingBagIcon className="h-16 w-16 text-gray-300 mb-4"/>
                  <h3 className="text-lg font-semibold text-gray-800">Giỏ hàng trống</h3>
                  <p className="text-gray-500">Hãy thêm sản phẩm vào giỏ hàng nhé!</p>
              </div>
            )}
            
            <div className="p-4 border-t bg-white">
              <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                  <span className="text-xl font-bold text-[#8BC34A]">{formatPrice(cartTotalAmount)}</span>
              </div>
              <button
                onClick={handleGoToCheckout}
                disabled={cart.length === 0}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#8BC34A] hover:bg-[#689F38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC34A] disabled:bg-[#C5E1A5] disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                Thanh toán
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
