import React, { useState } from 'react'
import { Product, OrderItem } from '../types'
import {
  X,
  Star,
  Car,
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Heart,
  Info,
  Gauge,
  Calendar,
  Settings,
  Share2,
  Phone
} from 'lucide-react'
import { shopLinkUtils } from '../utils/shopLinks'

interface ProductDetailsProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
  cartItem?: OrderItem
  onUpdateCartQuantity?: (productId: string, quantity: number) => void
  shopId?: string
  shopName?: string
  onCheckout?: () => void
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose,
  onAddToCart,
  cartItem,
  onUpdateCartQuantity,
  shopId,
  shopName,
  onCheckout
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details')

  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder-product.jpg']
  const isAvailable = product.stock > 0
  const isSold = product.stock === 0
  const carYear = product.subcategory || ''
  const mileage = product.dimensions?.length || 0
  const engineSize = product.weight || 0
  const exteriorColor = product.dimensions?.width || 0
  const interiorColor = product.dimensions?.height || 0

  const handleInquire = () => {
    if (shopName && window.Telegram?.WebApp) {
      const message = `Hi! I'm interested in the ${product.name} ${carYear ? `(${carYear})` : ''} listed at $${product.price.toLocaleString()}. Is it still available?`
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/${shopName}?text=${encodeURIComponent(message)}`)
      }
    }
  }

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout()
    }
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const calculateSavings = () => {
    if (product.costPrice && product.costPrice > 0) {
      const savings = ((product.costPrice - product.price) / product.costPrice * 100)
      return savings > 0 ? savings.toFixed(0) : null
    }
    return null
  }

  const handleShareProduct = () => {
    if (!shopId || !shopName) return

    const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'YourBot'
    const productLink = shopLinkUtils.generateShopLink(shopId, { productId: product.id })
    const shareMessage = shopLinkUtils.generateProductShareMessage(product, { id: shopId, name: shopName }, {})

    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(productLink)}&text=${encodeURIComponent(shareMessage)}`)
    } else if (navigator.share) {
      navigator.share({
        title: product.name,
        text: shareMessage,
        url: productLink
      })
    } else {
      navigator.clipboard.writeText(`${shareMessage}\n\n${productLink}`).then(() => {
        if (window.Telegram?.WebApp?.showAlert) {
          window.Telegram.WebApp.showAlert('Product link copied to clipboard!')
        } else {
          alert('Product link copied to clipboard!')
        }
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-telegram-bg rounded-t-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-telegram-bg border-b border-telegram-hint/20 p-4 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-telegram-secondary-bg"
          >
            <X className="w-5 h-5 text-telegram-text" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-telegram-secondary-bg">
              <Heart className="w-5 h-5 text-telegram-hint" />
            </button>
            {shopId && shopName && (
              <button
                onClick={handleShareProduct}
                className="p-2 rounded-full bg-telegram-secondary-bg hover:bg-telegram-button hover:text-telegram-button-text transition-colors"
                title="Share Product"
              >
                <Share2 className="w-5 h-5 text-telegram-button" />
              </button>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder-product.jpg'
              }}
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === selectedImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product.featured && (
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Featured
                </span>
              )}
              {isSold && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Sold
                </span>
              )}
              {isAvailable && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Available
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex space-x-2 p-4 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    index === selectedImageIndex ? 'border-telegram-button' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-4">
          {/* Title and Price */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-xl font-bold text-telegram-text flex-1 pr-2">
                {product.name}
              </h1>
              <div className="text-right">
                <div className="text-2xl font-bold text-telegram-button">
                  {formatPrice(product.price)}
                </div>
                {product.costPrice && product.costPrice > product.price && (
                  <div className="text-sm text-telegram-hint line-through">
                    {formatPrice(product.costPrice)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Year and Body Type */}
            <div className="flex items-center space-x-4 text-sm text-telegram-hint">
              {carYear && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {carYear}
                </span>
              )}
              <span>•</span>
              <span className="capitalize">{product.category}</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            {mileage > 0 && (
              <div className="flex items-center space-x-2 bg-telegram-secondary-bg p-2 rounded-lg">
                <Gauge className="w-4 h-4 text-telegram-button" />
                <div>
                  <p className="text-xs text-telegram-hint">Mileage</p>
                  <p className="text-sm font-medium text-telegram-text">{mileage.toLocaleString()} mi</p>
                </div>
              </div>
            )}
            {product.sku && (
              <div className="flex items-center space-x-2 bg-telegram-secondary-bg p-2 rounded-lg">
                <Car className="w-4 h-4 text-telegram-button" />
                <div>
                  <p className="text-xs text-telegram-hint">VIN</p>
                  <p className="text-sm font-medium text-telegram-text">{product.sku.slice(0, 8)}...</p>
                </div>
              </div>
            )}
          </div>

          {/* Specifications */}
          {product.tags && product.tags.length > 0 && (
            <div className="bg-telegram-secondary-bg p-3 rounded-lg">
              <h4 className="text-xs font-medium text-telegram-hint mb-2 flex items-center gap-1">
                <Settings className="w-3 h-3" />
                Key Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-telegram-button bg-opacity-10 text-telegram-button px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-telegram-hint/20">
            <div className="flex space-x-6">
              {[
                { id: 'details', label: 'Overview' },
                { id: 'specs', label: 'Specifications' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-telegram-button text-telegram-button'
                      : 'border-transparent text-telegram-hint'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[100px]">
            {activeTab === 'details' && (
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-telegram-text mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Description
                  </h3>
                  <div className="text-telegram-hint text-sm">
                    {showFullDescription ? (
                      <p>{product.description}</p>
                    ) : (
                      <p>
                        {product.description.length > 150
                          ? `${product.description.substring(0, 150)}...`
                          : product.description}
                      </p>
                    )}
                    {product.description.length > 150 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-telegram-button text-sm mt-1 hover:underline"
                      >
                        {showFullDescription ? 'Show Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Vehicle Highlights */}
                <div className="bg-telegram-secondary-bg p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-telegram-text mb-3">Vehicle Highlights</h4>
                  <div className="space-y-2 text-sm text-telegram-hint">
                    {carYear && <p>• Model Year: {carYear}</p>}
                    {mileage > 0 && <p>• Odometer: {mileage.toLocaleString()} miles</p>}
                    {engineSize > 0 && <p>• Engine: {engineSize}L</p>}
                    {product.tags && product.tags.length > 0 && (
                      <p>• Transmission: {product.tags.find(t => t.toLowerCase().includes('automatic') || t.toLowerCase().includes('manual')) || 'Contact for details'}</p>
                    )}
                    {product.tags?.find(t => t.toLowerCase().includes('gas') || t.toLowerCase().includes('diesel') || t.toLowerCase().includes('hybrid') || t.toLowerCase().includes('electric')) && (
                      <p>• Fuel Type: {product.tags.find(t => t.toLowerCase().includes('gas') || t.toLowerCase().includes('diesel') || t.toLowerCase().includes('hybrid') || t.toLowerCase().includes('electric'))}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-3">
                <h3 className="font-medium text-telegram-text mb-3">Technical Specifications</h3>
                <div className="space-y-2">
                  {carYear && (
                    <div className="flex justify-between py-2 border-b border-telegram-hint/10">
                      <span className="text-telegram-hint">Year</span>
                      <span className="text-telegram-text">{carYear}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 border-b border-telegram-hint/10">
                    <span className="text-telegram-hint">Body Type</span>
                    <span className="text-telegram-text capitalize">{product.category}</span>
                  </div>

                  {mileage > 0 && (
                    <div className="flex justify-between py-2 border-b border-telegram-hint/10">
                      <span className="text-telegram-hint">Mileage</span>
                      <span className="text-telegram-text">{mileage.toLocaleString()} miles</span>
                    </div>
                  )}

                  {engineSize > 0 && (
                    <div className="flex justify-between py-2 border-b border-telegram-hint/10">
                      <span className="text-telegram-hint">Engine Size</span>
                      <span className="text-telegram-text">{engineSize}L</span>
                    </div>
                  )}

                  {product.sku && (
                    <div className="flex justify-between py-2 border-b border-telegram-hint/10">
                      <span className="text-telegram-hint">VIN</span>
                      <span className="text-telegram-text text-xs">{product.sku}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 border-b border-telegram-hint/10">
                    <span className="text-telegram-hint">Status</span>
                    <span className={`text-telegram-text font-medium ${
                      isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isAvailable ? 'Available' : 'Sold'}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-telegram-bg border-t border-telegram-hint/20 p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleInquire}
              disabled={isSold}
              className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 active:scale-95 transition-all ${
                isSold
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-telegram-button text-telegram-button-text hover:opacity-90'
              }`}
            >
              <Phone className="w-5 h-5" />
              <span>
                {isSold ? 'Vehicle Sold' : 'Contact Dealer'}
              </span>
            </button>
          </div>
          {isAvailable && (
            <p className="text-xs text-center text-telegram-hint mt-2">
              Schedule a test drive or request more information
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails