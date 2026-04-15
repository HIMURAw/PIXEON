const PromoBanner = () => {
    return (
        <div className="w-full mt-20 mb-2">
            <div className="bg-pink-50 border border-pink-100 rounded-lg py-6 px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                {/* Metin Kısmı */}
                <p className="text-gray-700 text-lg font-medium">
                    İlk PlayStation konsol alımınıza özel{' '}
                    <span className="text-blue-600 font-bold underline decoration-2 underline-offset-4 cursor-pointer">
                        1.000 ₺ İndirim!
                    </span>
                </p>

                {/* Kupon Kodu Kısmı */}
                <div className="border-2 border-dashed border-blue-400 rounded-full px-6 py-2 bg-white">
                    <span className="text-blue-600 font-extrabold tracking-wider">
                        PS5GIFT1000
                    </span>
                </div>

                {/* Bilgi Kısmı */}
                <p className="text-gray-400 text-sm">
                    Ödeme sayfasında kodu kullanın.
                </p>
            </div>
        </div>
    );
};

export default PromoBanner;