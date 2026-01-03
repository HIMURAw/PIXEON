const PromoBanner = () => {
    return (
        <div className="container mx-auto px-4 my-8">
            <div className="bg-pink-50 border border-pink-100 rounded-lg py-6 px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                {/* Metin Kısmı */}
                <p className="text-gray-700 text-lg font-medium">
                    Super discount for your{' '}
                    <span className="text-red-600 font-bold underline decoration-2 underline-offset-4 cursor-pointer">
                        first purchase.
                    </span>
                </p>

                {/* Kupon Kodu Kısmı */}
                <div className="border-2 border-dashed border-red-400 rounded-full px-6 py-2 bg-white">
                    <span className="text-red-600 font-extrabold tracking-wider">
                        FREE25PIX
                    </span>
                </div>

                {/* Bilgi Kısmı */}
                <p className="text-gray-400 text-sm">
                    Use discount code in checkout!
                </p>
            </div>
        </div>
    );
};

export default PromoBanner;