
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScannedProduct } from '@/types/health';
import { formatDistanceToNow } from 'date-fns';

interface ProductHistoryProps {
  products: ScannedProduct[];
  onProductSelect: (product: ScannedProduct) => void;
  onClearHistory: () => void;
}

const ProductHistory: React.FC<ProductHistoryProps> = ({ 
  products, 
  onProductSelect, 
  onClearHistory 
}) => {
  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const sortedProducts = [...products].sort((a, b) => 
    new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
  );

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-emerald-700">Scan History</h2>
          <p className="text-gray-600">{products.length} products scanned</p>
        </div>
        {products.length > 0 && (
          <Button 
            variant="outline" 
            onClick={onClearHistory}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Clear History
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scanned products yet</h3>
            <p className="text-gray-500">Start scanning food products to see your history here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedProducts.map((product) => (
            <Card 
              key={product.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onProductSelect(product)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <Badge variant={getRiskBadgeVariant(product.riskLevel)}>
                        {product.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Compatibility: {product.compatibilityScore}%
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(product.scannedAt), { addSuffix: true })}
                      </span>
                    </div>
                    {product.warnings.length > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        {product.warnings.length} warning{product.warnings.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductHistory;
