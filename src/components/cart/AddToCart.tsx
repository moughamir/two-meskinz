import { useCart } from '@/contexts/CartContext';
import { ProductVariant } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function AddToCart({ variants, availableForSale }: { variants: ProductVariant[], availableForSale: boolean }) {
    const { addToCart } = useCart();
    const defaultVariant = variants[0];
    const variant = defaultVariant;

    const handleAddToCart = () => {
        if (variant) {
            addToCart({
                id: variant.id,
                title: variant.title,
                price: variant.price.amount,
                image: variant.image?.src || '',
                variant: variant
            });
        }
    };

    return (
        <Button
            onClick={handleAddToCart}
            disabled={!availableForSale}
            className="w-full mt-4"
        >
            {availableForSale ? 'Add To Cart' : 'Out Of Stock'}
        </Button>
    );
}
