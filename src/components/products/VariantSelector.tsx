import { ProductOption, ProductVariant } from "@/lib/types";

export function VariantSelector({ options, variants }: { options: ProductOption[], variants: ProductVariant[] }) {
    return (
        <div>
            {options.map((option) => (
                <div key={option.id}>
                    <h3 className="font-semibold">{option.name}</h3>
                    <div className="flex space-x-2">
                        {option.values.map((value) => (
                            <button key={value} className="px-4 py-2 border rounded-md">
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
